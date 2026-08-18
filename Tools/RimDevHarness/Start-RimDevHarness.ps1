[CmdletBinding()]
param(
    [switch]$OpenBrowser,
    [switch]$Background,
    [switch]$Stop
)

$ErrorActionPreference = 'Stop'
$harnessRoot = $PSScriptRoot
$repoRoot = [IO.Path]::GetFullPath((Join-Path $harnessRoot '..\..'))
$serverPath = Join-Path $harnessRoot 'server.mjs'
$node = Get-Command node -ErrorAction Stop

function Read-LauncherState {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    try { return Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json } catch { return $null }
}

function Test-HarnessState {
    param($State, [string]$ExpectedRepoRoot)
    if (-not $State.pid -or -not $State.url -or -not $State.instanceId) { return $false }
    if (-not (Get-Process -Id ([int]$State.pid) -ErrorAction SilentlyContinue)) { return $false }
    try {
        $baseUrl = ([string]$State.url -split '#', 2)[0].TrimEnd('/')
        $context = Invoke-RestMethod -Uri "$baseUrl/api/context" -TimeoutSec 2
        return [IO.Path]::GetFullPath([string]$context.repoRoot) -eq $ExpectedRepoRoot `
            -and [string]$context.instanceId -eq [string]$State.instanceId `
            -and [int]$context.pid -eq [int]$State.pid
    } catch {
        return $false
    }
}

function Get-SessionToken {
    param([string]$Url)
    $fragment = ([Uri]$Url).Fragment.TrimStart('#')
    $match = [regex]::Match($fragment, '(?:^|&)token=([^&]+)')
    if (-not $match.Success) { throw 'Harness state does not contain a session token.' }
    return [Uri]::UnescapeDataString($match.Groups[1].Value)
}

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
    throw "Git repository root was not found: $repoRoot"
}

if (-not ($OpenBrowser -or $Background -or $Stop)) {
    & $node.Source $serverPath
    exit $LASTEXITCODE
}

$runtimeDir = Join-Path $repoRoot '.git-sync\harness\launcher'
$statePath = Join-Path $runtimeDir 'current.json'
$lockPath = Join-Path $runtimeDir 'launcher.lock'
New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
$lock = $null
$lockDeadline = (Get-Date).AddSeconds(5)
while (-not $lock) {
    try {
        $lock = [IO.File]::Open($lockPath, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    } catch [IO.IOException] {
        if ((Get-Date) -ge $lockDeadline) { throw }
        Start-Sleep -Milliseconds 100
    }
}

try {
    $existing = Read-LauncherState -Path $statePath
    $existingIsLive = Test-HarnessState -State $existing -ExpectedRepoRoot $repoRoot

    if ($Stop) {
        if ($existingIsLive) {
            $baseUrl = ([string]$existing.url -split '#', 2)[0].TrimEnd('/')
            $headers = @{ 'X-Rim-Harness-Token' = Get-SessionToken -Url $existing.url }
            $result = Invoke-RestMethod -Uri "$baseUrl/api/shutdown" -Method Post -Headers $headers -ContentType 'application/json' -Body '{}' -TimeoutSec 5
            if ([string]$result.instanceId -ne [string]$existing.instanceId) {
                throw 'Harness shutdown response did not match the saved instance.'
            }
            Write-Output "RIM Dev Harness stopping: instance $($existing.instanceId)"
        } else {
            Write-Output 'RIM Dev Harness is not running.'
        }
        Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
        exit 0
    }

    if ($existingIsLive) {
        if ($OpenBrowser) { Start-Process -FilePath $existing.url }
        Write-Output "RIM Dev Harness already running: PID $($existing.pid)"
        Write-Output "URL: $($existing.url)"
        Write-Output "Stop: & '$PSCommandPath' -Stop"
        exit 0
    }

    Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $stdoutPath = Join-Path $runtimeDir "$stamp.stdout.jsonl"
    $stderrPath = Join-Path $runtimeDir "$stamp.stderr.log"
    $serverProcess = Start-Process -FilePath $node.Source `
        -ArgumentList @($serverPath) `
        -WorkingDirectory $harnessRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath `
        -PassThru

    $deadline = (Get-Date).AddSeconds(10)
    $launch = $null
    while ((Get-Date) -lt $deadline -and -not $serverProcess.HasExited) {
        if (Test-Path -LiteralPath $stdoutPath) {
            $line = Get-Content -LiteralPath $stdoutPath -TotalCount 1 -ErrorAction SilentlyContinue
            if ($line) {
                $launch = $line | ConvertFrom-Json
                break
            }
        }
        Start-Sleep -Milliseconds 100
    }

    if (-not $launch.url -or -not $launch.instanceId -or -not $launch.pid) {
        if (-not $serverProcess.HasExited) {
            Stop-Process -Id $serverProcess.Id -Force
        }
        $stderrText = if (Test-Path -LiteralPath $stderrPath) { Get-Content -Raw -LiteralPath $stderrPath } else { '' }
        throw "Harness startup failed. $stderrText"
    }
    if ([int]$launch.pid -ne $serverProcess.Id) {
        Stop-Process -Id $serverProcess.Id -Force
        throw 'Harness startup PID did not match the launched process.'
    }

    $state = [ordered]@{
        pid = $serverProcess.Id
        url = $launch.url
        instanceId = $launch.instanceId
        repoRoot = $repoRoot
        stdoutPath = $stdoutPath
        stderrPath = $stderrPath
        startedAt = (Get-Date).ToString('o')
    }
    $state | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding utf8
    if ($OpenBrowser) { Start-Process -FilePath $launch.url }
    Write-Output "RIM Dev Harness PID: $($serverProcess.Id)"
    Write-Output "URL: $($launch.url)"
    Write-Output "Stop: & '$PSCommandPath' -Stop"
} finally {
    $lock.Dispose()
}
