[CmdletBinding()]
param(
    [ValidateRange(1, 1439)][int]$IntervalMinutes = 5,
    [string]$TaskName,
    [string]$BranchName,
    [switch]$ValidateOnly,
    [switch]$Uninstall,
    [switch]$StartNow
)

$ErrorActionPreference = 'Stop'

function Get-MachineSlug {
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
    return $slug
}

$machineSlug = Get-MachineSlug
if ([string]::IsNullOrWhiteSpace($TaskName)) {
    $TaskName = "RIM GitHub Checkpoint ($machineSlug)"
}
if ([string]::IsNullOrWhiteSpace($BranchName)) {
    $BranchName = "codex/autosync-$machineSlug"
}

if ($Uninstall) {
    & schtasks.exe /Delete /TN $TaskName /F
    if ($LASTEXITCODE -ne 0) {
        throw "Could not remove scheduled task '$TaskName'."
    }
    Write-Host "Removed scheduled task '$TaskName'. The GitHub checkpoint branch was not deleted."
    exit 0
}

$repositoryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$syncScript = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'Sync-GitHubCheckpoint.ps1'))
if (-not (Test-Path -LiteralPath $syncScript -PathType Leaf)) {
    throw "Sync script was not found: $syncScript"
}

Write-Host 'Running a local safety check before task registration.'
& $syncScript -RepositoryPath $repositoryRoot -BranchName $BranchName -DryRun
if ($LASTEXITCODE -ne 0) {
    throw 'The sync safety check failed. No scheduled task was registered.'
}

$powershellExecutable = Join-Path $PSHOME 'powershell.exe'
if (-not (Test-Path -LiteralPath $powershellExecutable -PathType Leaf)) {
    $powershellExecutable = (Get-Process -Id $PID).Path
}

$taskRun = '"{0}" -NoLogo -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "{1}"' -f $powershellExecutable, $syncScript
if ($BranchName -ne "codex/autosync-$machineSlug") {
    $taskRun += ' -BranchName "{0}"' -f $BranchName
}

if ($ValidateOnly) {
    Write-Host "Task validation completed. No task was registered."
    Write-Host "Task name: $TaskName"
    Write-Host "Interval: $IntervalMinutes minute(s)"
    Write-Host "GitHub checkpoint branch: $BranchName"
    exit 0
}

& schtasks.exe /Create /TN $TaskName /SC MINUTE /MO $IntervalMinutes /TR $taskRun /RL LIMITED /F
if ($LASTEXITCODE -ne 0) {
    throw "Could not register scheduled task '$TaskName'."
}

if ($StartNow) {
    & schtasks.exe /Run /TN $TaskName
    if ($LASTEXITCODE -ne 0) {
        throw "The task was registered, but its first run could not be started."
    }
}

Write-Host "Registered '$TaskName' to run every $IntervalMinutes minute(s)."
Write-Host "GitHub checkpoint branch: $BranchName"
& schtasks.exe /Query /TN $TaskName /FO LIST
