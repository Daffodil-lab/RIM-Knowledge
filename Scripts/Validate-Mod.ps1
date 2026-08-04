[CmdletBinding()]
param(
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw "Validation failed: $Message"
    }
}

if (-not $SkipBuild) {
    & dotnet build (Join-Path $repoRoot 'Shion.sln') -c Release --no-restore -m:1 --verbosity minimal
    Assert-True ($LASTEXITCODE -eq 0) 'Release build failed.'
}

$ignoredWork = Join-Path $repoRoot 'work'
$xmlFiles = Get-ChildItem -Path $repoRoot -Recurse -Filter '*.xml' -File |
    Where-Object { $_.FullName -notlike "$ignoredWork\*" }
foreach ($file in $xmlFiles) {
    try {
        [xml](Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8) | Out-Null
    }
    catch {
        throw "Validation failed: malformed XML at $($file.FullName): $($_.Exception.Message)"
    }
}

[xml]$about = Get-Content -LiteralPath (Join-Path $repoRoot 'About\About.xml') -Raw -Encoding UTF8
Assert-True ($about.ModMetaData.packageId -eq 'daffodil.shion.core') 'Unexpected packageId.'
Assert-True ($about.ModMetaData.supportedVersions.li -contains '1.6') 'RimWorld 1.6 support is missing.'

$requiredDependencies = @(
    'OskarPotocki.VanillaFactionsExpanded.Core',
    'Ludeon.RimWorld.Royalty',
    'Ludeon.RimWorld.Ideology',
    'Ludeon.RimWorld.Biotech',
    'Ludeon.RimWorld.Anomaly',
    'Ludeon.RimWorld.Odyssey'
)
$dependencies = @($about.ModMetaData.modDependencies.li | ForEach-Object { [string]$_.packageId })
foreach ($dependency in $requiredDependencies) {
    Assert-True ($dependencies -contains $dependency) "Missing dependency $dependency."
}
Assert-True ((($dependencies | Sort-Object) -join '|') -eq (($requiredDependencies | Sort-Object) -join '|')) 'Direct dependencies must be exactly VEF and the five official DLCs.'
Assert-True ($dependencies -notcontains 'erdelf.HumanoidAlienRaces') 'Humanoid Alien Races must not be a runtime dependency.'
Assert-True ($dependencies -notcontains 'brrainz.harmony') 'Harmony must not be a direct runtime dependency.'
Assert-True ($about.OuterXml -notmatch 'HumanoidAlienRaces|brrainz\.harmony') 'HAR or direct Harmony load-order metadata remains in About.xml.'

$assemblyNames = @(Get-ChildItem -Path (Join-Path $repoRoot '1.6\Assemblies') -Filter '*.dll' -File |
    Select-Object -ExpandProperty Name |
    Sort-Object)
$expectedAssemblies = @('Shion.Core.dll', 'Shion.Kombinat.dll', 'Shion.Storage.dll')
Assert-True (($assemblyNames -join '|') -eq ($expectedAssemblies -join '|')) 'Assemblies must contain exactly the three Shion DLLs.'

$projectText = (Get-ChildItem -Path (Join-Path $repoRoot 'Source') -Filter '*.csproj' -Recurse -File |
    ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 }) -join "`n"
Assert-True ($projectText -notmatch 'Private="true"') 'A framework reference is configured for local copying.'
Assert-True (($projectText | Select-String -Pattern 'Private="false"' -AllMatches).Matches.Count -ge 3) 'Framework references must use Private=false.'
Assert-True ($projectText -notmatch '0Harmony|AlienRace') 'A Shion project still references Harmony or HAR.'

$buildProps = Get-Content -LiteralPath (Join-Path $repoRoot 'Directory.Build.props') -Raw -Encoding UTF8
Assert-True ($buildProps -notmatch 'HarmonyAssemblyPath|HARAssemblyPath|AlienRace\.dll') 'Build properties still require Harmony or HAR.'

$defText = (Get-ChildItem -Path (Join-Path $repoRoot '1.6\Defs') -Filter '*.xml' -Recurse -File |
    ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 }) -join "`n"
$requiredDefs = @(
    'Shion_Race',
    'ShionMechanical',
    'Shion_StandardBody',
    'Shion_Reactor',
    'Shion_ArtificialBrain',
    'Shion_FluidReprocessor',
    'Shion_FoxEar',
    'Shion_FoxTail',
    'Shion_ClockworkBody',
    'Shion_Xenotype',
    'Shion_FoxEars',
    'Shion_CellLoss',
    'Shion_FluidReprocessingOffline',
    'Shion_FluidReprocessing',
    'Shion_MoreHumanThanHuman',
    'Shion_Enslaved',
    'Sterile',
    'TotalHealing',
    'Shion_Cell',
    'Shion_CellFilth',
    'Shion_EnergyCrystal',
    'Shion_StructuralMaterial',
    'Shion_MaintenanceMaterial',
    'Shion_AmmunitionCrystal',
    'Shion_CoreStorage',
    'Shion_KombinatFactory',
    'Shion_FacilityProfile_Clockwork',
    'Shion_MassProductionPolicy_Official',
    'Shion_Ledger_Default',
    'Shion_KombinatPage_Overview',
    'Shion_KombinatPage_Finance',
    'Shion_IndependentExpedition',
    'VEF.Graphics.GraphicData_Animated',
    'CustomOverlayDef'
)
foreach ($defName in $requiredDefs) {
    Assert-True ($defText.Contains($defName)) "Required Def or VEF feature is missing: $defName."
}
Assert-True ($defText.Contains('<ThingDef ParentName="Human">')) 'Shion race must inherit the vanilla Human ThingDef.'
Assert-True ($defText.Contains('<disablesNeeds>') -and $defText.Contains('<li>Food</li>')) 'Shion food suppression must use the vanilla GeneDef need mechanism.'
Assert-True ($defText -notmatch 'AlienRace|alienRace') 'HAR race classes or XML blocks remain in runtime Defs.'
Assert-True ($defText -notmatch 'inputCapacity|outputCapacity') 'Factory-local production capacities remain in runtime Defs.'

[xml]$raceDefs = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\ThingDefs_Races\Shion_Race.xml') -Raw -Encoding UTF8
$race = $raceDefs.SelectSingleNode('/Defs/ThingDef[defName="Shion_Race"]')
Assert-True ($null -ne $race) 'Shion_Race ThingDef is missing.'
Assert-True ([string]$race.thingClass -eq 'Shion.Core.Pawn_Shion') 'Shion_Race must use the minimal public duplication-notification adapter.'
Assert-True ([string]$race.race.fleshType -eq 'ShionMechanical') 'Shion_Race must use the Core-owned ShionMechanical FleshType.'
Assert-True ([string]$race.race.body -eq 'Shion_StandardBody') 'Shion_Race must use the Core-owned physical body topology.'
Assert-True ($null -eq $race.race.lifeStageAges) 'Shion_Race must inherit Human life stages so pawn trackers initialize in vanilla order.'
Assert-True ([double]$race.race.baseHealthScale -eq 1.5) 'Shion body durability must be 150 percent of Human.'
Assert-True ([string]$race.race.canBecomeShambler -eq 'false') 'Shion must not become a Shambler.'
Assert-True ([string]$race.race.isImmuneToInfections -eq 'true') 'Shion must reject ordinary infections.'
$expectedRaceStats = @{
    MarketValue = 3000
    Mass = 30
    MoveSpeed = 5
    CrawlSpeed = 1
    FilthRate = 0
    Flammability = 0
    WorkSpeedGlobal = 1.5
    SocialImpact = 1.5
    RangedCooldownFactor = 0.75
    AimingDelayFactor = 0.75
    ImmunityGainSpeed = 25
    CarryingCapacity = 100
    PawnBeauty = 3
    RoyalFavorValue = 20
    SocialIdeoSpreadFrequencyFactor = 5
    CertaintyLossFactor = 0.5
}
foreach ($entry in $expectedRaceStats.GetEnumerator()) {
    $node = $race.SelectSingleNode("statBases/$($entry.Key)")
    Assert-True ($null -ne $node -and [double]$node.InnerText -eq [double]$entry.Value) "Unexpected Shion stat $($entry.Key)."
}
$raceExtension = $race.SelectSingleNode('modExtensions/li[@Class="Shion.Core.ShionRaceExtension"]')
Assert-True ($null -ne $raceExtension) 'ShionRaceExtension is missing.'
Assert-True ([double]$raceExtension.restFloor -gt 0) 'Rest protection floor must be positive.'
Assert-True ([double]$raceExtension.tailMoveFactor -eq 0.85) 'Tail loss must reduce movement to 85 percent.'
Assert-True ([int]$raceExtension.requiredRecreationTypesOffset -eq 3) 'The future recreation requirement must retain its Def-driven +3 offset.'

[xml]$bodyDefs = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\BodyDefs\Shion_Body.xml') -Raw -Encoding UTF8
$shionBody = $bodyDefs.SelectSingleNode('/Defs/BodyDef[defName="Shion_StandardBody"]')
Assert-True ($null -ne $shionBody) 'Shion_StandardBody is missing.'
Assert-True ($shionBody.SelectNodes('.//li[def="Shion_FluidReprocessor"]').Count -eq 2) 'Shion body must contain exactly two fluid reprocessors.'
Assert-True ($shionBody.SelectNodes('.//li[def="Shion_FoxEar"]').Count -eq 2) 'Shion body must contain exactly two physical fox ears.'
foreach ($requiredPart in @('Shion_Reactor', 'Shion_ArtificialBrain', 'Shion_FoxTail', 'Jaw', 'Tongue')) {
    Assert-True ($shionBody.SelectNodes(".//li[def=`"$requiredPart`"]").Count -ge 1) "Shion body part is missing: $requiredPart."
}
foreach ($forbiddenPart in @('Heart', 'Brain', 'Kidney', 'Lung', 'Stomach', 'Liver', 'Ear')) {
    Assert-True ($shionBody.SelectNodes(".//li[def=`"$forbiddenPart`"]").Count -eq 0) "Biological internal part remains in the Shion body: $forbiddenPart."
}

[xml]$geneDefs = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\GeneDefs\Shion_Xenotype.xml') -Raw -Encoding UTF8
$clockworkGene = $geneDefs.SelectSingleNode('/Defs/GeneDef[defName="Shion_ClockworkBody"]')
Assert-True ([string]$clockworkGene.geneClass -eq 'Shion.Core.Gene_ShionManufacturedBody') 'Clockwork body runtime state worker is missing.'
Assert-True ([double]$clockworkGene.painFactor -eq 1) 'Shion pain strength must remain 100 percent.'
Assert-True ([string]$clockworkGene.preventPermanentWounds -eq 'true') 'Shion wounds must not form permanent scars.'
$xenotype = $geneDefs.SelectSingleNode('/Defs/XenotypeDef[defName="Shion_Xenotype"]')
$xenotypeGenes = @($xenotype.genes.li | ForEach-Object { [string]$_ })
foreach ($requiredGene in @('Shion_ClockworkBody', 'Sterile', 'TotalHealing', 'Shion_FoxEars', 'Shion_FoxTail')) {
    Assert-True ($xenotypeGenes -contains $requiredGene) "Shion Xenotype gene is missing: $requiredGene."
}
Assert-True ($xenotypeGenes -notcontains 'Ears_Cat' -and $xenotypeGenes -notcontains 'Tail_Furry') 'Decorative vanilla ear or tail genes must not replace physical body parts.'

[xml]$fleshDefs = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\FleshTypeDefs\Shion_FleshType.xml') -Raw -Encoding UTF8
$flesh = $fleshDefs.SelectSingleNode('/Defs/FleshTypeDef[defName="ShionMechanical"]')
Assert-True ($null -ne $flesh) 'ShionMechanical FleshTypeDef is missing.'
Assert-True ([string]$flesh.isOrganic -eq 'true') 'ShionMechanical must retain the vanilla humanlike tracker flag.'
Assert-True ([string]$flesh.damageEffecter -eq 'Damage_HitMechanoid') 'ShionMechanical must use the mechanical damage effect.'
Assert-True ([string]$flesh.corpseCategory -eq 'CorpsesHumanlike') 'ShionMechanical corpses must remain in the humanlike category.'

[xml]$scenario = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\ScenarioDefs\Shion_Scenario.xml') -Raw -Encoding UTF8
$pawnPart = @($scenario.Defs.ScenarioDef.scenario.parts.li | Where-Object { $_.Class -eq 'ScenPart_ConfigPage_ConfigureStartingPawns' })[0]
Assert-True ([int]$pawnPart.pawnCount -eq 3) 'Independent Expedition must start with three pawns.'
Assert-True ($defText.Contains('ScenPart_EnsureShionExpeditionSkills')) 'Expedition skill guarantee is missing.'

[xml]$patterns = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\KombinatPatternDefs\Shion_Patterns.xml') -Raw -Encoding UTF8
$pattern = $patterns.SelectSingleNode('/Defs/Shion.Kombinat.KombinatPatternDef')
Assert-True ($null -ne $pattern -and $pattern.SelectNodes('stages/li').Count -eq 3) 'Alpha production pattern must contain exactly three stages.'

[xml]$facilityProfiles = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\KombinatFacilityProfileDefs\Shion_FacilityProfiles.xml') -Raw -Encoding UTF8
$profile = $facilityProfiles.SelectSingleNode('/Defs/Shion.Kombinat.KombinatFacilityProfileDef[defName="Shion_FacilityProfile_Clockwork"]')
Assert-True ($null -ne $profile) 'Alpha facility profile is missing.'
Assert-True ([int]$profile.processIntervalTicks -gt 0 -and [double]$profile.workSpeedFactor -gt 0) 'Facility profile timing must be Def-driven and positive.'
Assert-True ([int]$profile.minimumOrderAmount -eq 1 -and [int]$profile.maximumOrderAmount -eq 10000) 'Facility profile must own the 1 through 10,000 order bounds.'
Assert-True ([int]$profile.overviewQuickOrderCount -ge 0) 'Facility profile quick-order count is invalid.'
Assert-True ($profile.patterns.li -contains 'Shion_Pattern_ClockworkRelay') 'Facility profile does not declare the alpha production pattern.'
Assert-True ([string]$profile.massProductionPolicy -eq 'Shion_MassProductionPolicy_Official') 'Facility profile does not declare the official mass-production policy.'
$ledgerDef = $facilityProfiles.SelectSingleNode('/Defs/Shion.Kombinat.KombinatLedgerDef[isDefault="true"]')
Assert-True ($null -ne $ledgerDef -and [int]$ledgerDef.openingBalance -ge 0) 'Default ledger policy is missing or invalid.'

[xml]$massProductionPolicies = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\KombinatMassProductionPolicyDefs\Shion_MassProductionPolicies.xml') -Raw -Encoding UTF8
$policyDefs = @($massProductionPolicies.SelectNodes('/Defs/Shion.Kombinat.KombinatMassProductionPolicyDef'))
Assert-True ($policyDefs.Count -eq 1) 'The alpha build must declare exactly one official mass-production policy.'
$massProductionPolicy = $policyDefs[0]
Assert-True ([string]$massProductionPolicy.defName -eq 'Shion_MassProductionPolicy_Official') 'Unexpected official mass-production policy Def name.'
$expectedOfficialPackages = @(
    'Ludeon.RimWorld',
    'Ludeon.RimWorld.Royalty',
    'Ludeon.RimWorld.Ideology',
    'Ludeon.RimWorld.Biotech',
    'Ludeon.RimWorld.Anomaly',
    'Ludeon.RimWorld.Odyssey'
)
$allowedOfficialPackages = @($massProductionPolicy.allowedPackageIds.li | ForEach-Object { [string]$_ })
Assert-True ((($allowedOfficialPackages | Sort-Object) -join '|') -eq (($expectedOfficialPackages | Sort-Object) -join '|')) 'Mass-production packages must be exactly Core and the five official DLCs.'
Assert-True (@($massProductionPolicy.excludedTechLevels.li | ForEach-Object { [string]$_ }) -contains 'Archotech') 'Archotech output must be excluded by the mass-production policy.'
Assert-True ([string]$massProductionPolicy.requirePlayerAcquirable -eq 'true') 'Mass-production output must be player-acquirable.'
Assert-True ([string]$massProductionPolicy.requireItemCategory -eq 'true') 'Mass-production output must be a physical Item.'
Assert-True ([string]$massProductionPolicy.requireRecipeUsers -eq 'true') 'Mass-production recipes must declare a real recipe user.'
Assert-True ([string]$massProductionPolicy.requireIngredients -eq 'true') 'Mass-production recipes must consume physical ingredients.'
Assert-True ([string]$massProductionPolicy.requireDefaultRecipeWorker -eq 'true') 'Mass-production recipes must use the deterministic default worker.'
Assert-True ([string]$massProductionPolicy.requireContextFreeRecipe -eq 'true') 'Mass-production recipes must reject special context.'
Assert-True ([string]$massProductionPolicy.requireResearchFinished -eq 'true') 'Mass production must enforce research completion.'
Assert-True ([string]$massProductionPolicy.excludeSpecialProducts -eq 'true') 'Special recipe products must be excluded.'
Assert-True ([string]$massProductionPolicy.outputQuality -eq 'Normal') 'Mass-produced quality must be policy-owned and Normal.'
Assert-True ([double]$massProductionPolicy.workTicksFactor -gt 0 -and [int]$massProductionPolicy.minimumWorkTicks -gt 0) 'Mass-production work timing must be positive.'

[xml]$managementPages = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Defs\KombinatManagementPageDefs\Shion_ManagementPages.xml') -Raw -Encoding UTF8
$pageDefs = @($managementPages.SelectNodes('/Defs/Shion.Kombinat.KombinatManagementPageDef'))
Assert-True ($pageDefs.Count -eq 6) 'The alpha management UI must declare exactly six pages.'
$pageNames = @($pageDefs | ForEach-Object { [string]$_.defName })
foreach ($pageName in @(
    'Shion_KombinatPage_Overview',
    'Shion_KombinatPage_Inventory',
    'Shion_KombinatPage_Production',
    'Shion_KombinatPage_Facilities',
    'Shion_KombinatPage_Logistics',
    'Shion_KombinatPage_Finance'
)) {
    Assert-True ($pageNames -contains $pageName) "Missing management page $pageName."
}
Assert-True ((@($pageDefs | ForEach-Object { [string]$_.workerClass } | Sort-Object -Unique)).Count -eq 6) 'Management pages must declare six distinct worker classes.'

[xml]$english = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Languages\English\Keyed\Shion.xml') -Raw -Encoding UTF8
[xml]$japanese = Get-Content -LiteralPath (Join-Path $repoRoot '1.6\Languages\Japanese\Keyed\Shion.xml') -Raw -Encoding UTF8
$englishKeys = @($english.LanguageData.ChildNodes | Where-Object NodeType -eq Element | Select-Object -ExpandProperty Name | Sort-Object)
$japaneseKeys = @($japanese.LanguageData.ChildNodes | Where-Object NodeType -eq Element | Select-Object -ExpandProperty Name | Sort-Object)
Assert-True (($englishKeys -join '|') -eq ($japaneseKeys -join '|')) 'English and Japanese Keyed translation sets differ.'

$sourceText = (Get-ChildItem -Path (Join-Path $repoRoot 'Source') -Filter '*.cs' -Recurse -File |
    ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 }) -join "`n"
Assert-True ($sourceText.Contains('ThingOwner<Thing>')) 'Authoritative ThingOwner storage is missing.'
Assert-True ($sourceText.Contains('TryTransferToContainer')) 'Direct container transfer is missing.'
Assert-True ($sourceText.Contains('TryDeposit(DepositRequest')) 'Public idempotent deposit contract is missing.'
Assert-True ($sourceText.Contains('IStorageProductionService')) 'Public storage production contract is missing.'
Assert-True ($sourceText.Contains('ReserveProduction(ProductionReservationRequest')) 'Input and output-capacity reservation is missing.'
Assert-True ($sourceText.Contains('CommitProduction(string operationId)')) 'Idempotent storage production commit is missing.'
Assert-True ($sourceText.Contains('reservedInputIndex') -and $sourceText.Contains('reservedOutputIndex')) 'Incremental production reservation indexes are missing.'
Assert-True ($sourceText.Contains('ProductionPlanRecord') -and $sourceText.Contains('ProductionJobRecord') -and $sourceText.Contains('ProductionBatchRecord')) 'Kombinat plan/job/batch records are missing.'
Assert-True ($sourceText.Contains('KombinatManagementPageDef') -and $sourceText.Contains('Activator.CreateInstance')) 'Def-driven management page discovery is missing.'
Assert-True ($sourceText.Contains('KombinatFacilityProfileDef') -and $sourceText.Contains('KombinatLedgerDef')) 'Def-driven facility or ledger policy is missing.'
Assert-True ($sourceText.Contains('KombinatMassProductionPolicyDef') -and $sourceText.Contains('DefDatabase<RecipeDef>.AllDefsListForReading')) 'The Def-driven official recipe catalog is missing.'
Assert-True ($sourceText.Contains('StorageProductSpec') -and $sourceText.Contains('ThingMaker.MakeThing(thingDef, stuffDef)')) 'Stuff-aware production output is missing.'
Assert-True ($sourceText.Contains('SetQuality(slice.Quality') -and $sourceText.Contains('QualityCategory.Normal')) 'Deterministic production quality handling is missing.'
Assert-True ($sourceText.Contains('Widgets.TextFieldNumeric') -and $sourceText.Contains('minimumOrderAmount') -and $sourceText.Contains('maximumOrderAmount')) 'The Def-driven large-order quantity control is missing.'
Assert-True ($sourceText -notmatch 'ComponentIndustrial|OrbitalTargeterBombardment|Apparel_Parka|Gun_ChargeRifle') 'Product-name branches must not replace the Def-driven mass-production policy.'
Assert-True ($sourceText.Contains('RegisterIntegratedLauncher') -and $sourceText.Contains('KombinatStorageUiBridge')) 'Storage Gizmo is not bridged to the integrated management UI.'
Assert-True ($sourceText.Contains('Gene_ShionManufacturedBody') -and $sourceText.Contains('PawnCapacityWorker_ShionFluidReprocessing')) 'Shion physical-body state handling is missing.'
Assert-True ($sourceText.Contains('PawnRenderNodeWorker_ShionFoxEars') -and $sourceText.Contains('PawnRenderNodeWorker_ShionFoxTail')) 'Physical ear or tail rendering is not linked to body-part integrity.'
Assert-True ($sourceText.Contains('ThoughtWorker_ShionMoreHumanThanHuman') -and $sourceText.Contains('ThoughtWorker_ShionEnslaved')) 'Shion identity or enslavement thought handling is missing.'
Assert-True ($sourceText.Contains('override void Notify_DuplicatedFrom') -and $sourceText.Contains('override void SpawnSetup')) 'Shion anomaly duplication rejection is not connected to public Pawn hooks.'
Assert-True ($sourceText -notmatch 'FactoryBufferEndpoint|DispatchOutputToStorage|public ThingOwner InputBuffer|public ThingOwner OutputBuffer') 'Active factory production buffers remain in source.'
Assert-True ($sourceText -notmatch 'Matter.?Network|AhHanie|BindingFlags|GetField\(|FieldInfo') 'Forbidden Matter Network or private-field reflection coupling detected.'
Assert-True ($sourceText -notmatch 'HarmonyLib|HarmonyPatch') 'Shion source must use vanilla race and gene behavior instead of Harmony patches.'

$textureFiles = @(
    '1.6\Textures\Things\Item\ShionResources\ShionResource.png',
    '1.6\Textures\Things\Building\ShionMachine\Factory\Frame0.png',
    '1.6\Textures\Things\Building\ShionMachine\Factory\Frame1.png',
    '1.6\Textures\UI\Overlays\ShionEndpoint.png'
)
foreach ($relativePath in $textureFiles) {
    Assert-True (Test-Path -LiteralPath (Join-Path $repoRoot $relativePath)) "Missing texture $relativePath."
}

$legacyHarTextures = @(
    '1.6\Textures\Things\Pawn\Shion\Addon\ShionFoxAssembly_south.png',
    '1.6\Textures\Things\Pawn\Shion\Addon\ShionFoxAssembly_east.png',
    '1.6\Textures\Things\Pawn\Shion\Addon\ShionFoxAssembly_north.png'
)
foreach ($relativePath in $legacyHarTextures) {
    Assert-True (-not (Test-Path -LiteralPath (Join-Path $repoRoot $relativePath))) "Legacy HAR body-addon texture remains: $relativePath."
}

$testMatrix = Get-Content -LiteralPath (Join-Path $repoRoot 'docs\TEST-MATRIX.md') -Raw -Encoding UTF8
foreach ($id in 1..14) {
    Assert-True ($testMatrix.Contains(('KX-{0:D3}' -f $id))) "Missing KX test assignment $id."
}
foreach ($id in 1..35) {
    Assert-True ($testMatrix.Contains(('S2-{0:D3}' -f $id))) "Missing S2 test assignment $id."
}

Write-Host "Shion validation passed: $($xmlFiles.Count) XML files, $($assemblyNames.Count) assemblies, $($englishKeys.Count) bilingual keys."
