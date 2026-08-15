[CmdletBinding()]
param(
    [string]$RepositoryPath,
    [string]$Remote = 'origin',
    [string]$BranchName,
    [switch]$DryRun,
    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'
$script:RepositoryRoot = $null
$script:LogPath = $null
$lockStream = $null
$temporaryDirectory = $null
$previousGitIndex = $env:GIT_INDEX_FILE
$previousGitObjectDirectory = $env:GIT_OBJECT_DIRECTORY
$previousGitAlternateObjectDirectories = $env:GIT_ALTERNATE_OBJECT_DIRECTORIES
$previousGitTerminalPrompt = $env:GIT_TERMINAL_PROMPT
$previousAuthorName = $env:GIT_AUTHOR_NAME
$previousAuthorEmail = $env:GIT_AUTHOR_EMAIL
$previousCommitterName = $env:GIT_COMMITTER_NAME
$previousCommitterEmail = $env:GIT_COMMITTER_EMAIL

function Set-ProcessEnvironmentValue {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [AllowNull()][string]$Value
    )

    if ([string]::IsNullOrEmpty($Value)) {
        Remove-Item -LiteralPath ("Env:{0}" -f $Name) -ErrorAction SilentlyContinue
    }
    else {
        Set-Item -LiteralPath ("Env:{0}" -f $Name) -Value $Value
    }
}

function Write-SyncLog {
    param(
        [Parameter(Mandatory = $true)][string]$Message,
        [ValidateSet('INFO', 'WARN', 'ERROR')][string]$Level = 'INFO'
    )

    $line = '{0} [{1}] {2}' -f ([DateTimeOffset]::Now.ToString('o')), $Level, $Message
    Write-Host $line
    if (-not [string]::IsNullOrWhiteSpace($script:LogPath)) {
        Add-Content -LiteralPath $script:LogPath -Value $line -Encoding UTF8
    }
}

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [switch]$AllowFailure
    )

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $rawOutput = & git -C $script:RepositoryRoot @Arguments 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    $output = (@($rawOutput | ForEach-Object { $_.ToString() }) -join [Environment]::NewLine).TrimEnd()

    if (($exitCode -ne 0) -and (-not $AllowFailure)) {
        $commandText = 'git {0}' -f ($Arguments -join ' ')
        if ([string]::IsNullOrWhiteSpace($output)) {
            throw "$commandText failed with exit code $exitCode."
        }
        throw "$commandText failed with exit code $exitCode.`n$output"
    }

    return [pscustomobject]@{
        ExitCode = $exitCode
        Output = $output
    }
}

function Get-DefaultSyncBranch {
    $machineName = $env:COMPUTERNAME
    if ([string]::IsNullOrWhiteSpace($machineName)) {
        $machineName = [Environment]::MachineName
    }
    if ([string]::IsNullOrWhiteSpace($machineName)) {
        $machineName = 'windows'
    }
    $slug = $machineName.ToLowerInvariant() -replace '[^a-z0-9._-]+', '-'
    $slug = $slug.Trim('-', '.', '_')
    if ([string]::IsNullOrWhiteSpace($slug)) {
        $slug = 'windows'
    }
    return "codex/autosync-$slug"
}

function New-SnapshotTree {
    param(
        [Parameter(Mandatory = $true)][string]$ParentCommit,
        [Parameter(Mandatory = $true)][string]$IndexPath
    )

    if (Test-Path -LiteralPath $IndexPath) {
        Remove-Item -LiteralPath $IndexPath -Force
    }
    $env:GIT_INDEX_FILE = $IndexPath
    $null = Invoke-Git -Arguments @('read-tree', $ParentCommit)
    $null = Invoke-Git -Arguments @('add', '-A', '--', '.')
    return (Invoke-Git -Arguments @('write-tree')).Output.Trim()
}

function Assert-NoLikelySecrets {
    param([Parameter(Mandatory = $true)][string]$Tree)

    $blockedPathPatterns = @(
        '(^|/)\.env($|\.)',
        '(^|/)id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$',
        '\.(key|pem|p12|pfx)$',
        '(^|/)(credentials?|secrets?|tokens?)(\.(json|ya?ml|toml|ini|txt))?$'
    )

    $treePaths = (Invoke-Git -Arguments @('ls-tree', '-r', '--name-only', $Tree)).Output -split "`r?`n"
    $blockedPaths = New-Object System.Collections.Generic.List[string]
    foreach ($path in $treePaths) {
        if ([string]::IsNullOrWhiteSpace($path)) {
            continue
        }
        if ($path -match '(^|/)\.env\.example$') {
            continue
        }
        foreach ($pattern in $blockedPathPatterns) {
            if ($path -match $pattern) {
                $blockedPaths.Add($path)
                break
            }
        }
    }

    if ($blockedPaths.Count -gt 0) {
        $sample = ($blockedPaths | Select-Object -First 10) -join [Environment]::NewLine
        throw "Checkpoint stopped because secret-like file paths were found:`n$sample"
    }

    $highConfidenceSecretPatterns = @(
        'AKIA[0-9A-Z]{16}',
        'github_pat_[A-Za-z0-9_]{20,}',
        'gh[pousr]_[A-Za-z0-9]{30,}',
        'xox[baprs]-[A-Za-z0-9-]{20,}',
        '-----BEGIN (OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----'
    )

    foreach ($pattern in $highConfidenceSecretPatterns) {
        $grep = Invoke-Git -Arguments @('grep', '-I', '--name-only', '-E', '-e', $pattern, $Tree, '--') -AllowFailure
        if ($grep.ExitCode -eq 0) {
            $sample = (($grep.Output -split "`r?`n") | Select-Object -First 10) -join [Environment]::NewLine
            throw "Checkpoint stopped because likely credential content was found in:`n$sample"
        }
        if ($grep.ExitCode -ne 1) {
            throw "Secret scan failed for pattern '$pattern':`n$($grep.Output)"
        }
    }
}

try {
    if ([string]::IsNullOrWhiteSpace($RepositoryPath)) {
        $RepositoryPath = Join-Path $PSScriptRoot '..'
    }
    $candidatePath = [IO.Path]::GetFullPath($RepositoryPath)
    if (-not (Test-Path -LiteralPath $candidatePath -PathType Container)) {
        throw "Repository path does not exist: $candidatePath"
    }

    $script:RepositoryRoot = $candidatePath
    $topLevel = (Invoke-Git -Arguments @('rev-parse', '--show-toplevel')).Output.Trim()
    $topLevel = [IO.Path]::GetFullPath($topLevel)
    if (-not $candidatePath.Equals($topLevel, [StringComparison]::OrdinalIgnoreCase)) {
        throw "RepositoryPath must be the Git worktree root. Resolved root: $topLevel"
    }
    $script:RepositoryRoot = $topLevel

    if ([string]::IsNullOrWhiteSpace($BranchName)) {
        $BranchName = Get-DefaultSyncBranch
    }
    $branchCheck = Invoke-Git -Arguments @('check-ref-format', '--branch', $BranchName) -AllowFailure
    if ($branchCheck.ExitCode -ne 0) {
        throw "Invalid sync branch name: $BranchName"
    }

    $remoteCheck = Invoke-Git -Arguments @('remote', 'get-url', $Remote) -AllowFailure
    if ($remoteCheck.ExitCode -ne 0) {
        throw "Git remote '$Remote' is not configured."
    }

    $stateDirectory = Join-Path $script:RepositoryRoot '.git-sync'
    $null = New-Item -ItemType Directory -Path $stateDirectory -Force
    $script:LogPath = Join-Path $stateDirectory 'github-checkpoint.log'

    $lockPath = Join-Path $stateDirectory 'sync.lock'
    try {
        $lockStream = [IO.File]::Open(
            $lockPath,
            [IO.FileMode]::OpenOrCreate,
            [IO.FileAccess]::ReadWrite,
            [IO.FileShare]::None
        )
    }
    catch [IO.IOException] {
        Write-SyncLog -Level WARN -Message 'Another checkpoint process is already running; this run was skipped.'
        exit 0
    }

    $env:GIT_TERMINAL_PROMPT = '0'
    Write-SyncLog -Message "Checkpoint started for $($remoteCheck.Output) -> $BranchName."

    if (-not $DryRun) {
        Write-SyncLog -Message "Fetching $Remote without changing the working tree."
        $null = Invoke-Git -Arguments @('fetch', '--prune', $Remote)
    }

    $gitCommonDirectory = (Invoke-Git -Arguments @('rev-parse', '--git-common-dir')).Output.Trim()
    if (-not [IO.Path]::IsPathRooted($gitCommonDirectory)) {
        $gitCommonDirectory = Join-Path $script:RepositoryRoot $gitCommonDirectory
    }
    $gitCommonDirectory = [IO.Path]::GetFullPath($gitCommonDirectory)

    $remoteTrackingRef = "refs/remotes/$Remote/$BranchName"
    $remoteBranch = Invoke-Git -Arguments @('rev-parse', '--verify', '--quiet', "$remoteTrackingRef^{commit}") -AllowFailure
    if ($remoteBranch.ExitCode -eq 0) {
        $parentCommit = $remoteBranch.Output.Trim()
    }
    elseif ($remoteBranch.ExitCode -eq 1) {
        $parentCommit = (Invoke-Git -Arguments @('rev-parse', 'HEAD')).Output.Trim()
        Write-SyncLog -Message "Remote checkpoint branch does not exist yet; the first snapshot will start from current HEAD $parentCommit."
    }
    else {
        throw "Could not inspect $remoteTrackingRef.`n$($remoteBranch.Output)"
    }

    $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
    $temporaryDirectory = Join-Path $tempRoot ("rim-github-sync-{0}" -f [Guid]::NewGuid().ToString('N'))
    $temporaryDirectory = [IO.Path]::GetFullPath($temporaryDirectory)
    if (-not $temporaryDirectory.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to create a temporary index outside the system temporary directory.'
    }
    $null = New-Item -ItemType Directory -Path $temporaryDirectory
    $indexPath = Join-Path $temporaryDirectory 'index'
    $temporaryObjectDirectory = Join-Path $temporaryDirectory 'objects'
    $null = New-Item -ItemType Directory -Path $temporaryObjectDirectory
    $repositoryObjectDirectory = Join-Path $gitCommonDirectory 'objects'
    $alternateObjectDirectories = $repositoryObjectDirectory
    if (-not [string]::IsNullOrWhiteSpace($previousGitAlternateObjectDirectories)) {
        $alternateObjectDirectories += [IO.Path]::PathSeparator + $previousGitAlternateObjectDirectories
    }
    $env:GIT_OBJECT_DIRECTORY = $temporaryObjectDirectory
    $env:GIT_ALTERNATE_OBJECT_DIRECTORIES = $alternateObjectDirectories

    $firstTree = New-SnapshotTree -ParentCommit $parentCommit -IndexPath $indexPath
    if (-not $DryRun) {
        Start-Sleep -Milliseconds 1500
        $secondTree = New-SnapshotTree -ParentCommit $parentCommit -IndexPath $indexPath
        if ($firstTree -ne $secondTree) {
            throw 'The working tree changed while it was being captured. No checkpoint was pushed; the next scheduled run will retry.'
        }
    }
    else {
        $secondTree = $firstTree
    }

    Assert-NoLikelySecrets -Tree $secondTree
    $parentTree = (Invoke-Git -Arguments @('show', '-s', '--format=%T', $parentCommit)).Output.Trim()
    if ($parentTree -eq $secondTree) {
        Write-SyncLog -Message 'No file changes were found; the checkpoint branch is already current.'
        exit 0
    }

    $changedFiles = (Invoke-Git -Arguments @('diff', '--name-only', $parentTree, $secondTree, '--')).Output -split "`r?`n"
    $changedFiles = @($changedFiles | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    Write-SyncLog -Message ("Snapshot contains {0} changed path(s)." -f $changedFiles.Count)

    if ($DryRun -or $NoPush) {
        $mode = if ($DryRun) { 'Dry run' } else { 'NoPush run' }
        Write-SyncLog -Message "$mode completed. No commit or remote branch was changed."
        exit 0
    }

    $authorName = (Invoke-Git -Arguments @('config', '--get', 'user.name') -AllowFailure).Output.Trim()
    $authorEmail = (Invoke-Git -Arguments @('config', '--get', 'user.email') -AllowFailure).Output.Trim()
    if ([string]::IsNullOrWhiteSpace($authorName)) {
        $authorName = 'Codex GitHub Sync'
    }
    if ([string]::IsNullOrWhiteSpace($authorEmail)) {
        $authorEmail = 'codex-sync@localhost'
    }
    $env:GIT_AUTHOR_NAME = $authorName
    $env:GIT_AUTHOR_EMAIL = $authorEmail
    $env:GIT_COMMITTER_NAME = $authorName
    $env:GIT_COMMITTER_EMAIL = $authorEmail

    $machineLabel = $env:COMPUTERNAME
    if ([string]::IsNullOrWhiteSpace($machineLabel)) {
        $machineLabel = [Environment]::MachineName
    }
    if ([string]::IsNullOrWhiteSpace($machineLabel)) {
        $machineLabel = 'Windows'
    }
    $timestamp = [DateTimeOffset]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
    $message = "chore(sync): checkpoint $timestamp [$machineLabel]"
    $commit = (Invoke-Git -Arguments @('commit-tree', $secondTree, '-p', $parentCommit, '-m', $message)).Output.Trim()

    Write-SyncLog -Message "Pushing checkpoint commit $commit without force."
    $pushSpec = "${commit}:refs/heads/$BranchName"
    $null = Invoke-Git -Arguments @('push', '--porcelain', $Remote, $pushSpec)
    Write-SyncLog -Message "Checkpoint completed successfully on $Remote/$BranchName."
}
catch {
    Write-SyncLog -Level ERROR -Message $_.Exception.Message
    exit 1
}
finally {
    if ($null -ne $lockStream) {
        $lockStream.Dispose()
    }

    if (-not [string]::IsNullOrWhiteSpace($temporaryDirectory)) {
        $tempRootForCleanup = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
        $resolvedTemporaryDirectory = [IO.Path]::GetFullPath($temporaryDirectory)
        if (
            $resolvedTemporaryDirectory.StartsWith($tempRootForCleanup, [StringComparison]::OrdinalIgnoreCase) -and
            (Split-Path -Leaf $resolvedTemporaryDirectory).StartsWith('rim-github-sync-', [StringComparison]::OrdinalIgnoreCase) -and
            (Test-Path -LiteralPath $resolvedTemporaryDirectory)
        ) {
            Remove-Item -LiteralPath $resolvedTemporaryDirectory -Recurse -Force
        }
    }

    Set-ProcessEnvironmentValue -Name 'GIT_INDEX_FILE' -Value $previousGitIndex
    Set-ProcessEnvironmentValue -Name 'GIT_OBJECT_DIRECTORY' -Value $previousGitObjectDirectory
    Set-ProcessEnvironmentValue -Name 'GIT_ALTERNATE_OBJECT_DIRECTORIES' -Value $previousGitAlternateObjectDirectories
    Set-ProcessEnvironmentValue -Name 'GIT_TERMINAL_PROMPT' -Value $previousGitTerminalPrompt
    Set-ProcessEnvironmentValue -Name 'GIT_AUTHOR_NAME' -Value $previousAuthorName
    Set-ProcessEnvironmentValue -Name 'GIT_AUTHOR_EMAIL' -Value $previousAuthorEmail
    Set-ProcessEnvironmentValue -Name 'GIT_COMMITTER_NAME' -Value $previousCommitterName
    Set-ProcessEnvironmentValue -Name 'GIT_COMMITTER_EMAIL' -Value $previousCommitterEmail
}
