[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$')]
    [string]$RunId,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string[]]$ExpectedAgentIds,

    [string[]]$FingerprintAgentIds = @(),
    [string]$RepositoryPath,
    [switch]$AsJson
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

function ConvertTo-NormalizedRepositoryPath {
    param([object]$Value)

    if ($null -eq $Value -or [string]::IsNullOrWhiteSpace($Value.ToString())) {
        throw 'Ownership values cannot be empty.'
    }
    $normalized = $Value.ToString().Trim().Replace('\', '/')
    while ($normalized.StartsWith('./', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(2)
    }
    $segments = @($normalized.Split('/') | Where-Object { $_.Length -gt 0 })
    if (
        [IO.Path]::IsPathRooted($normalized) -or
        $segments.Count -eq 0 -or
        @($segments | Where-Object { $_ -eq '.' -or $_ -eq '..' }).Count -gt 0
    ) {
        throw "Invalid ownership value: $Value"
    }
    return ($segments -join '/')
}

function ConvertTo-NormalizedCanonicalOwner {
    param([object]$Value)

    if ($null -eq $Value -or [string]::IsNullOrWhiteSpace($Value.ToString())) {
        throw 'Canonical owners cannot be empty.'
    }
    $normalized = $Value.ToString().Trim().Replace('\', '/')
    while ($normalized.StartsWith('./', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(2)
    }
    if ($normalized.StartsWith('//', [StringComparison]::Ordinal) -or $normalized -match '^[A-Za-z]:') {
        throw "Canonical owners must be OKF logical paths: $Value"
    }
    if ($normalized.StartsWith('/', [StringComparison]::Ordinal)) {
        $normalized = $normalized.Substring(1)
    }
    $segments = @($normalized.Split('/') | Where-Object { $_.Length -gt 0 })
    if ($segments.Count -eq 0 -or @($segments | Where-Object { $_ -eq '.' -or $_ -eq '..' }).Count -gt 0) {
        throw "Invalid canonical owner: $Value"
    }
    return '/' + ($segments -join '/')
}

function Test-ContainsValue {
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

function Test-OwnershipOverlap {
    param(
        [string]$Left,
        [string]$Right
    )

    return (
        $Left.Equals($Right, [StringComparison]::OrdinalIgnoreCase) -or
        $Left.StartsWith($Right + '/', [StringComparison]::OrdinalIgnoreCase) -or
        $Right.StartsWith($Left + '/', [StringComparison]::OrdinalIgnoreCase)
    )
}

$repositoryRoot = Get-RepositoryRoot -Candidate $RepositoryPath
$runDirectory = Join-Path $repositoryRoot ('.git-sync\coordination\{0}' -f $RunId)
if (-not (Test-Path -LiteralPath $runDirectory -PathType Container)) {
    throw "Coordination run does not exist: $RunId"
}

$expectedAgents = [object[]]@(
    $ExpectedAgentIds |
        ForEach-Object {
            if ($_ -notmatch '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') {
                throw "Invalid expected agent id: $_"
            }
            $_
        } |
        Sort-Object -Unique
)
if ($expectedAgents.Count -eq 0) {
    throw 'At least one expected agent id is required.'
}
$fingerprintAgents = [object[]]@(
    $FingerprintAgentIds |
        ForEach-Object {
            if ($_ -notmatch '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') {
                throw "Invalid fingerprint agent id: $_"
            }
            $_
        } |
        Sort-Object -Unique
)
if ($fingerprintAgents.Count -eq 0) {
    $fingerprintAgents = [object[]]@($expectedAgents)
}
foreach ($fingerprintAgent in $fingerprintAgents) {
    if (-not (Test-ContainsValue -Values $expectedAgents -Candidate $fingerprintAgent.ToString())) {
        throw "Fingerprint agent is not in the expected claim set: $fingerprintAgent"
    }
}

$events = @(
    Get-ChildItem -LiteralPath $runDirectory -Filter '*.json' -File |
        Sort-Object Name |
        ForEach-Object { Get-Content -Raw -Encoding UTF8 -LiteralPath $_.FullName | ConvertFrom-Json }
)
$claimEvents = @($events | Where-Object { $_.event -eq 'claim' })
if ($claimEvents.Count -eq 0) {
    throw "No claim events found for run: $RunId"
}

$latestClaims = @{}
foreach ($claim in $claimEvents | Sort-Object recorded_at) {
    if ($claim.schema -ne 'rim-agent-coordination/v2') {
        throw "Unsupported coordination schema for claim by $($claim.agent_id): $($claim.schema)"
    }
    $latestClaims[$claim.agent_id.ToString()] = $claim
}

foreach ($expectedAgent in $expectedAgents) {
    if (-not $latestClaims.ContainsKey($expectedAgent.ToString())) {
        throw "Missing claim from expected agent: $expectedAgent"
    }
}
foreach ($actualAgent in $latestClaims.Keys) {
    if (-not (Test-ContainsValue -Values $expectedAgents -Candidate $actualAgent.ToString())) {
        throw "Unexpected claimant in run: $actualAgent"
    }
}

$claims = @($expectedAgents | ForEach-Object { $latestClaims[$_.ToString()] })
$baselineHeads = [object[]]@(
    $claims |
        ForEach-Object { $_.baseline_head } |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
        Sort-Object -Unique
)
if ($baselineHeads.Count -ne 1) {
    throw 'All claims must contain the same non-empty baseline HEAD.'
}
$baselineHead = $baselineHeads[0].ToString()
$currentHeadOutput = @(& git -C $repositoryRoot rev-parse HEAD 2>&1)
if ($LASTEXITCODE -ne 0 -or $currentHeadOutput.Count -eq 0) {
    throw "Could not verify current HEAD.`n$($currentHeadOutput -join [Environment]::NewLine)"
}
$currentHead = $currentHeadOutput[0].ToString().Trim()
if (-not $currentHead.Equals($baselineHead, [StringComparison]::OrdinalIgnoreCase)) {
    throw "HEAD changed after claims were recorded. Baseline: $baselineHead Current: $currentHead"
}

$claimSummaries = @()
foreach ($claim in $claims) {
    $agentId = $claim.agent_id.ToString()
    $verifyFingerprint = Test-ContainsValue -Values $fingerprintAgents -Candidate $agentId
    $ownedPaths = [object[]]@($claim.owned_paths | ForEach-Object { ConvertTo-NormalizedRepositoryPath -Value $_ } | Sort-Object -Unique)
    $ownedOwners = [object[]]@($claim.owned_canonical_owners | ForEach-Object { ConvertTo-NormalizedCanonicalOwner -Value $_ } | Sort-Object -Unique)
    $acceptedDirty = [object[]]@($claim.accepted_dirty_paths | ForEach-Object { ConvertTo-NormalizedRepositoryPath -Value $_ } | Sort-Object -Unique)
    $baselinePaths = [object[]]@($claim.baseline_paths)
    if ($ownedPaths.Count -eq 0 -or $ownedOwners.Count -eq 0) {
        throw "Claim must own at least one path and one canonical owner: $agentId"
    }
    if ($baselinePaths.Count -ne $ownedPaths.Count) {
        throw "Baseline path count does not match owned path count: $agentId"
    }

    $baselineByPath = @{}
    foreach ($baseline in $baselinePaths) {
        $path = ConvertTo-NormalizedRepositoryPath -Value $baseline.path
        if ($baselineByPath.ContainsKey($path)) {
            throw "Duplicate baseline path in claim by ${agentId}: $path"
        }
        $baselineByPath[$path] = $baseline
    }

    foreach ($acceptedPath in $acceptedDirty) {
        if (-not (Test-ContainsValue -Values $ownedPaths -Candidate $acceptedPath.ToString())) {
            throw "Accepted dirty path is not owned by ${agentId}: $acceptedPath"
        }
    }

    foreach ($ownedPathValue in $ownedPaths) {
        $ownedPath = $ownedPathValue.ToString()
        if (-not $baselineByPath.ContainsKey($ownedPath)) {
            throw "Missing baseline record for ${agentId}: $ownedPath"
        }
        $baseline = $baselineByPath[$ownedPath]
        $wasDirty = -not [string]::IsNullOrWhiteSpace($baseline.status)
        $wasAccepted = Test-ContainsValue -Values $acceptedDirty -Candidate $ownedPath
        if ($wasDirty -ne $wasAccepted) {
            throw "Dirty baseline acceptance mismatch for ${agentId}: $ownedPath"
        }

        if ($verifyFingerprint) {
            $statusOutput = @(& git -C $repositoryRoot status --short --untracked-files=all -- $ownedPath 2>&1)
            if ($LASTEXITCODE -ne 0) {
                throw "Could not recheck status for ${agentId}: $ownedPath"
            }
            $currentStatus = ($statusOutput -join "`n").Trim()
            $baselineStatus = if ($null -eq $baseline.status) { '' } else { $baseline.status.ToString().Trim() }
            if (-not $currentStatus.Equals($baselineStatus, [StringComparison]::Ordinal)) {
                throw "Owned path changed after claim by ${agentId}: $ownedPath"
            }

            $nativeRelativePath = $ownedPath.Replace('/', [IO.Path]::DirectorySeparatorChar)
            $absolutePath = [IO.Path]::GetFullPath((Join-Path $repositoryRoot $nativeRelativePath))
            $currentExists = Test-Path -LiteralPath $absolutePath -PathType Leaf
            if ([bool]$baseline.exists -ne [bool]$currentExists) {
                throw "Owned path existence changed after claim by ${agentId}: $ownedPath"
            }
            $currentSha256 = $null
            if ($currentExists) {
                $currentSha256 = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash.ToLowerInvariant()
            }
            $baselineSha256 = if ($null -eq $baseline.worktree_sha256) { $null } else { $baseline.worktree_sha256.ToString() }
            if (-not [object]::Equals($currentSha256, $baselineSha256)) {
                throw "Owned path content changed after claim by ${agentId}: $ownedPath"
            }
        }
    }

    $claimSummaries += [pscustomobject][ordered]@{
        agent_id = $agentId
        owned_paths = $ownedPaths
        owned_canonical_owners = $ownedOwners
    }
}

for ($leftIndex = 0; $leftIndex -lt $claimSummaries.Count; $leftIndex++) {
    for ($rightIndex = $leftIndex + 1; $rightIndex -lt $claimSummaries.Count; $rightIndex++) {
        $left = $claimSummaries[$leftIndex]
        $right = $claimSummaries[$rightIndex]
        foreach ($leftPath in $left.owned_paths) {
            foreach ($rightPath in $right.owned_paths) {
                if (Test-OwnershipOverlap -Left $leftPath.ToString() -Right $rightPath.ToString()) {
                    throw "Owned path overlap: $($left.agent_id) [$leftPath] and $($right.agent_id) [$rightPath]"
                }
            }
        }
        foreach ($leftOwner in $left.owned_canonical_owners) {
            foreach ($rightOwner in $right.owned_canonical_owners) {
                if (Test-OwnershipOverlap -Left $leftOwner.ToString() -Right $rightOwner.ToString()) {
                    throw "Canonical owner overlap: $($left.agent_id) [$leftOwner] and $($right.agent_id) [$rightOwner]"
                }
            }
        }
    }
}

$result = [pscustomobject][ordered]@{
    run_id = $RunId
    baseline_head = $baselineHead
    claims = $claimSummaries.Count
    agents = [object[]]@($claimSummaries | ForEach-Object { $_.agent_id })
    fingerprint_agents = $fingerprintAgents
    status = 'accepted'
}
if ($AsJson) {
    ConvertTo-Json -InputObject $result -Depth 6
}
else {
    Write-Output $result
}
