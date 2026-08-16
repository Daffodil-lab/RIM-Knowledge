[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$')]
    [string]$RunId,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$')]
    [string]$AgentId,

    [Parameter(Mandatory = $true)]
    [ValidateSet('claim', 'shared-discovery', 'conflict', 'handoff', 'integration-handoff')]
    [string]$Event,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Domain,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Summary,

    [string[]]$OwnedPaths = @(),
    [string[]]$OwnedCanonicalOwners = @(),
    [string[]]$AcceptedDirtyPaths = @(),
    [string[]]$ChangedFacts = @(),
    [string[]]$SharedOwners = @(),
    [string[]]$AffectedDomains = @(),
    [string[]]$Dependencies = @(),
    [string[]]$EvidencePaths = @(),
    [string]$DecisionNeeded,
    [string]$RepositoryPath,
    [switch]$NoWrite
)

$ErrorActionPreference = 'Stop'

function Get-RepositoryRoot {
    param([string]$Candidate)

    if ([string]::IsNullOrWhiteSpace($Candidate)) {
        $Candidate = Join-Path $PSScriptRoot '..'
    }
    $resolved = [IO.Path]::GetFullPath($Candidate)
    if (-not (Test-Path -LiteralPath $resolved -PathType Container)) {
        throw "Repository path does not exist: $resolved"
    }

    $rawRoot = & git -C $resolved rev-parse --show-toplevel 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Could not resolve Git root from $resolved.`n$($rawRoot -join [Environment]::NewLine)"
    }
    $gitRoot = [IO.Path]::GetFullPath((@($rawRoot)[0]).ToString().Trim())
    if (-not $resolved.Equals($gitRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "RepositoryPath must be the Git worktree root. Resolved root: $gitRoot"
    }
    return $gitRoot
}

function ConvertTo-RepositoryRelativePath {
    param([string]$PathValue)

    if ([string]::IsNullOrWhiteSpace($PathValue)) {
        return $null
    }
    $normalized = $PathValue.Trim().Replace('\', '/')
    while ($normalized.StartsWith('./', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(2)
    }
    $segments = @($normalized.Split('/') | Where-Object { $_.Length -gt 0 })
    if (
        [IO.Path]::IsPathRooted($normalized) -or
        $segments.Count -eq 0 -or
        @($segments | Where-Object { $_ -eq '.' -or $_ -eq '..' }).Count -gt 0
    ) {
        throw "Coordination paths must be repository-relative and cannot contain dot segments: $PathValue"
    }
    return ($segments -join '/')
}

function Convert-PathList {
    param([string[]]$Values)

    return @(
        $Values |
            ForEach-Object { ConvertTo-RepositoryRelativePath -PathValue $_ } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Sort-Object -Unique
    )
}

function ConvertTo-CanonicalOwner {
    param([string]$OwnerValue)

    if ([string]::IsNullOrWhiteSpace($OwnerValue)) {
        return $null
    }
    $normalized = $OwnerValue.Trim().Replace('\', '/')
    while ($normalized.StartsWith('./', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(2)
    }
    if ($normalized.StartsWith('//', [StringComparison]::Ordinal) -or $normalized -match '^[A-Za-z]:') {
        throw "Canonical owners must be OKF logical paths, not filesystem paths: $OwnerValue"
    }
    if ($normalized.StartsWith('/', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(1)
    }
    $segments = @($normalized.Split('/') | Where-Object { $_.Length -gt 0 })
    if ($segments.Count -eq 0 -or @($segments | Where-Object { $_ -eq '.' -or $_ -eq '..' }).Count -gt 0) {
        throw "Invalid canonical owner: $OwnerValue"
    }
    return '/' + ($segments -join '/')
}

function Convert-CanonicalOwnerList {
    param([string[]]$Values)

    return @(
        $Values |
            ForEach-Object { ConvertTo-CanonicalOwner -OwnerValue $_ } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            Sort-Object -Unique
    )
}

function Test-ListContains {
    param(
        [object[]]$Values,
        [string]$Candidate
    )

    foreach ($value in $Values) {
        if ($value.ToString().Equals($Candidate, [StringComparison]::OrdinalIgnoreCase)) {
            return $true
        }
    }
    return $false
}

function Get-PathBaseline {
    param(
        [string]$RepositoryRoot,
        [string]$BaselineHead,
        [string]$RelativePath
    )

    $nativeRelativePath = $RelativePath.Replace('/', [IO.Path]::DirectorySeparatorChar)
    $absolutePath = [IO.Path]::GetFullPath((Join-Path $RepositoryRoot $nativeRelativePath))
    $rootPrefix = $RepositoryRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
    if (-not $absolutePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Owned path escapes the repository: $RelativePath"
    }
    if (Test-Path -LiteralPath $absolutePath -PathType Container) {
        throw "Owned paths must name files, not directories: $RelativePath"
    }

    $statusOutput = @(& git -C $RepositoryRoot status --short --untracked-files=all -- $RelativePath 2>&1)
    if ($LASTEXITCODE -ne 0) {
        throw "Could not inspect path status: $RelativePath`n$($statusOutput -join [Environment]::NewLine)"
    }
    $status = ($statusOutput -join "`n").Trim()

    $headBlob = $null
    $headSpec = '{0}:{1}' -f $BaselineHead, $RelativePath
    $blobOutput = @(& git -C $RepositoryRoot rev-parse --verify $headSpec 2>$null)
    if ($LASTEXITCODE -eq 0 -and $blobOutput.Count -gt 0) {
        $headBlob = $blobOutput[0].ToString().Trim()
    }

    $exists = Test-Path -LiteralPath $absolutePath -PathType Leaf
    $sha256 = $null
    if ($exists) {
        $sha256 = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash.ToLowerInvariant()
    }

    return [pscustomobject][ordered]@{
        path = $RelativePath
        status = if ([string]::IsNullOrWhiteSpace($status)) { $null } else { $status }
        exists = [bool]$exists
        head_blob = $headBlob
        worktree_sha256 = $sha256
    }
}

$repositoryRoot = Get-RepositoryRoot -Candidate $RepositoryPath
$ownedPathsNormalized = [object[]]@(Convert-PathList -Values $OwnedPaths)
$ownedCanonicalOwnersNormalized = [object[]]@(Convert-CanonicalOwnerList -Values $OwnedCanonicalOwners)
$acceptedDirtyPathsNormalized = [object[]]@(Convert-PathList -Values $AcceptedDirtyPaths)
$sharedOwnersNormalized = [object[]]@(Convert-CanonicalOwnerList -Values $SharedOwners)
$evidencePathsNormalized = [object[]]@(Convert-PathList -Values $EvidencePaths)
$changedFactsNormalized = [object[]]@($ChangedFacts | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
$affectedDomainsNormalized = [object[]]@($AffectedDomains | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
$dependenciesNormalized = [object[]]@($Dependencies | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

$baselineHead = $null
$baselinePaths = [object[]]@()
if ($Event -eq 'claim') {
    if ($ownedPathsNormalized.Count -eq 0) {
        throw 'A claim must include at least one owned path.'
    }
    if ($ownedCanonicalOwnersNormalized.Count -eq 0) {
        throw 'A claim must include at least one owned canonical owner.'
    }
    foreach ($acceptedPath in $acceptedDirtyPathsNormalized) {
        if (-not (Test-ListContains -Values $ownedPathsNormalized -Candidate $acceptedPath.ToString())) {
            throw "Accepted dirty path is not owned by this claim: $acceptedPath"
        }
    }

    $headOutput = @(& git -C $repositoryRoot rev-parse HEAD 2>&1)
    if ($LASTEXITCODE -ne 0 -or $headOutput.Count -eq 0) {
        throw "Could not capture baseline HEAD.`n$($headOutput -join [Environment]::NewLine)"
    }
    $baselineHead = $headOutput[0].ToString().Trim()

    $baselinePathItems = @()
    foreach ($ownedPath in $ownedPathsNormalized) {
        $baseline = Get-PathBaseline -RepositoryRoot $repositoryRoot -BaselineHead $baselineHead -RelativePath $ownedPath.ToString()
        $isDirty = -not [string]::IsNullOrWhiteSpace($baseline.status)
        $isAccepted = Test-ListContains -Values $acceptedDirtyPathsNormalized -Candidate $ownedPath.ToString()
        if ($isDirty -and -not $isAccepted) {
            throw "Owned path is already dirty and was not explicitly accepted: $ownedPath ($($baseline.status))"
        }
        if (-not $isDirty -and $isAccepted) {
            throw "Accepted dirty path is currently clean: $ownedPath"
        }
        $baselinePathItems += $baseline
    }
    $baselinePaths = [object[]]@($baselinePathItems)
}

if ($Event -eq 'shared-discovery') {
    if (
        $sharedOwnersNormalized.Count -eq 0 -or
        $affectedDomainsNormalized.Count -eq 0 -or
        $evidencePathsNormalized.Count -eq 0 -or
        [string]::IsNullOrWhiteSpace($DecisionNeeded)
    ) {
        throw 'A shared-discovery requires shared owners, affected domains, evidence paths, and a decision.'
    }
}

$recordedAt = [DateTimeOffset]::UtcNow
$record = [ordered]@{
    schema = 'rim-agent-coordination/v2'
    run_id = $RunId
    agent_id = $AgentId
    event = $Event
    domain = $Domain
    recorded_at = $recordedAt.ToString('o')
    owned_paths = $ownedPathsNormalized
    owned_canonical_owners = $ownedCanonicalOwnersNormalized
    accepted_dirty_paths = $acceptedDirtyPathsNormalized
    baseline_head = $baselineHead
    baseline_paths = $baselinePaths
    changed_facts = $changedFactsNormalized
    shared_owners = $sharedOwnersNormalized
    affected_domains = $affectedDomainsNormalized
    dependencies = $dependenciesNormalized
    evidence_paths = $evidencePathsNormalized
    decision_needed = if ([string]::IsNullOrWhiteSpace($DecisionNeeded)) { $null } else { $DecisionNeeded }
    summary = $Summary
}
$json = ConvertTo-Json -InputObject $record -Depth 8

if ($NoWrite) {
    Write-Output $json
    exit 0
}

$coordinationRoot = Join-Path $repositoryRoot '.git-sync\coordination'
$runDirectory = Join-Path $coordinationRoot $RunId
$null = New-Item -ItemType Directory -Path $runDirectory -Force

$timestamp = $recordedAt.UtcDateTime.ToString('yyyyMMddTHHmmssfffffffZ')
$fileName = '{0}-{1}-{2}.json' -f $timestamp, $AgentId, [Guid]::NewGuid().ToString('N')
$destination = Join-Path $runDirectory $fileName
$temporary = Join-Path $runDirectory ('.{0}.tmp' -f [Guid]::NewGuid().ToString('N'))

try {
    [IO.File]::WriteAllText($temporary, $json, (New-Object Text.UTF8Encoding($false)))
    Move-Item -LiteralPath $temporary -Destination $destination
}
finally {
    if (Test-Path -LiteralPath $temporary) {
        Remove-Item -LiteralPath $temporary -Force
    }
}

Write-Output $destination
