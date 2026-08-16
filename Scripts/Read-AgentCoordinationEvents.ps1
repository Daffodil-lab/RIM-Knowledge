[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$')]
    [string]$RunId,

    [string]$RepositoryPath,
    [switch]$AsJson
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepositoryPath)) {
    $RepositoryPath = Join-Path $PSScriptRoot '..'
}
$resolved = [IO.Path]::GetFullPath($RepositoryPath)
if (-not (Test-Path -LiteralPath $resolved -PathType Container)) {
    throw "Repository path does not exist: $resolved"
}

$rawRoot = & git -C $resolved rev-parse --show-toplevel 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "Could not resolve Git root from $resolved.`n$($rawRoot -join [Environment]::NewLine)"
}
$repositoryRoot = [IO.Path]::GetFullPath((@($rawRoot)[0]).ToString().Trim())
if (-not $resolved.Equals($repositoryRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "RepositoryPath must be the Git worktree root. Resolved root: $repositoryRoot"
}

$runDirectory = Join-Path $repositoryRoot ('.git-sync\coordination\{0}' -f $RunId)
$events = @()
if (Test-Path -LiteralPath $runDirectory -PathType Container) {
    $events = @(
        Get-ChildItem -LiteralPath $runDirectory -Filter '*.json' -File |
            Sort-Object Name |
            ForEach-Object { Get-Content -Raw -Encoding UTF8 -LiteralPath $_.FullName | ConvertFrom-Json }
    )
}

if ($AsJson) {
    ConvertTo-Json -InputObject ([object[]]$events) -Depth 8
    exit 0
}

$events | Select-Object recorded_at, event, agent_id, domain, summary
