[CmdletBinding()]
param(
    [switch]$OpenBrowser
)

$ErrorActionPreference = 'Stop'
$harnessRoot = $PSScriptRoot
$repoRoot = [IO.Path]::GetFullPath((Join-Path $harnessRoot '..\..'))
$serverPath = Join-Path $harnessRoot 'server.mjs'
$node = Get-Command node -ErrorAction Stop

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
    throw "Git repository root was not found: $repoRoot"
}

if (-not $OpenBrowser) {
    & $node.Source $serverPath
    exit $LASTEXITCODE
}

$runtimeDir = Join-Path $repoRoot '.git-sync\harness\launcher'
New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
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

if (-not $launch.url) {
    if (-not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force
    }
    $stderrText = if (Test-Path -LiteralPath $stderrPath) { Get-Content -Raw -LiteralPath $stderrPath } else { '' }
    throw "Harness startup failed. $stderrText"
}

Start-Process -FilePath $launch.url
Write-Output "RIM Dev Harness PID: $($serverProcess.Id)"
Write-Output "URL: $($launch.url)"
Write-Output "Stop: Stop-Process -Id $($serverProcess.Id)"
