[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Start', 'TurnEnd', 'End')]
    [string]$Mode
)

$ErrorActionPreference = 'Stop'

function Write-HookLog {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Message
    )

    $line = '{0} {1}' -f ([DateTimeOffset]::Now.ToString('o')), $Message
    Add-Content -LiteralPath $Path -Value $line -Encoding UTF8
}

try {
    $rawInput = [Console]::In.ReadToEnd()
    $event = $null
    if (-not [string]::IsNullOrWhiteSpace($rawInput)) {
        try {
            $event = $rawInput | ConvertFrom-Json
        }
        catch {
            $event = $null
        }
    }

    $workingDirectory = $null
    if (($null -ne $event) -and (-not [string]::IsNullOrWhiteSpace($event.cwd))) {
        $workingDirectory = $event.cwd
    }
    if ([string]::IsNullOrWhiteSpace($workingDirectory)) {
        $workingDirectory = (Get-Location).Path
    }

    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $gitRootOutput = & git -C $workingDirectory rev-parse --show-toplevel 2>&1
        $gitExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($gitExitCode -ne 0) {
        exit 0
    }

    $repositoryRoot = [IO.Path]::GetFullPath((@($gitRootOutput)[0]).ToString().Trim())
    $syncScript = Join-Path $repositoryRoot 'Scripts\Sync-GitHubCheckpoint.ps1'
    if (-not (Test-Path -LiteralPath $syncScript -PathType Leaf)) {
        exit 0
    }

    $stateDirectory = Join-Path $repositoryRoot '.git-sync'
    $null = New-Item -ItemType Directory -Path $stateDirectory -Force
    $hookLog = Join-Path $stateDirectory 'hook-events.log'

    $sessionId = 'unknown'
    if (($null -ne $event) -and (-not [string]::IsNullOrWhiteSpace($event.session_id))) {
        $sessionId = $event.session_id
    }

    $powershellExecutable = Join-Path $PSHOME 'powershell.exe'
    if (-not (Test-Path -LiteralPath $powershellExecutable -PathType Leaf)) {
        $powershellExecutable = (Get-Process -Id $PID).Path
    }

    $arguments = '-NoLogo -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "{0}" -RepositoryPath "{1}"' -f $syncScript, $repositoryRoot
    $process = Start-Process -FilePath $powershellExecutable -ArgumentList $arguments -WindowStyle Hidden -PassThru
    Write-HookLog -Path $hookLog -Message ("mode={0} session={1} sync_pid={2}" -f $Mode, $sessionId, $process.Id)
}
catch {
    try {
        if (-not [string]::IsNullOrWhiteSpace($stateDirectory)) {
            $hookLog = Join-Path $stateDirectory 'hook-events.log'
            Write-HookLog -Path $hookLog -Message ("mode={0} error={1}" -f $Mode, $_.Exception.Message)
        }
    }
    catch {
    }
    exit 1
}
