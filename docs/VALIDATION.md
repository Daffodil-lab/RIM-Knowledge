# Alpha validation record

Validation date: 2026-07-31.

## Automated gate

Commands:

```powershell
dotnet restore Source\Shion.Core\Shion.Core.csproj --ignore-failed-sources
dotnet restore Source\Shion.Storage\Shion.Storage.csproj --ignore-failed-sources
dotnet restore Source\Shion.Kombinat\Shion.Kombinat.csproj --ignore-failed-sources
dotnet build Shion.sln -c Release --no-restore -m:1 --verbosity minimal
powershell -NoProfile -ExecutionPolicy Bypass -File .\Scripts\Validate-Mod.ps1 -SkipBuild
git diff --check
```

Result:

- `Shion.Core.dll`, `Shion.Storage.dll`, `Shion.Kombinat.dll`: Release build succeeded with 0 errors.
- Restore/build emitted `NU1900` because the sandbox could not reach NuGet vulnerability data; package restore completed from the available cache.
- 26 XML files parsed.
- Exactly three Shion assemblies were present; no framework DLL was bundled.
- English and Japanese contained the same 61 Keyed entries.
- All six direct dependencies were present. HAR and Harmony were absent from direct dependencies.
- Runtime Defs contained vanilla `ThingDef ParentName="Human"`, `Shion_Xenotype`, `Shion_ClockworkBody`, built-in ears/tail/sterility references, and no AlienRace type or block.
- Source contained no `HarmonyLib` or `HarmonyPatch`.
- Physical ownership, transfer, Plan/Job/Batch, textures and KX/S2 static assignments passed.
- Six management Page Defs, distinct worker classes, Facility Profile, official mass-production policy, Ledger policy, public production reservation/commit contracts, incremental reservation indexes, Stuff/quality-aware output specifications, and absence of active Factory Buffer endpoints passed.
- `git diff --check` reported no whitespace errors.

## Local official-schema inspection

The implementation fields were checked against the installed RimWorld 1.6 data and managed types:

- `Verse.PawnKindDef.xenotypeSet` and `useFactionXenotypes`
- `RimWorld.FactionDef.xenotypeSet`
- `Verse.GeneDef.disablesNeeds` and `biologicalAgeTickFactorFromAgeCurve`
- built-in `Sterile`, `ToxicEnvironmentResistance_Total`, `Ears_Cat`, `Tail_Furry` and `Beard_NoBeardOnly`
- vanilla Biotech render-node definitions for head and body attachments

VEF `1.1.9.0` remained the sole direct external framework assembly. Its verified SHA-256 was `AEBBF063BE18F314FA7040FA0FA3CC011CA413BF62641E84861A630E279C42FF`. VEF's own metadata declares Harmony as a dependency.

## RimWorld loader Quick Test

The isolated headless Quick Test enabled RimWorld 1.6, all five official DLC, VEF, VEF's Harmony dependency, and the changed Shion build. HAR was absent from the active mod list. An existing inactive test copy used the production package ID, so this checkout used a temporary package ID only for the run; `About.xml` was restored afterward.

Observed result:

- The log emitted the new vanilla/Biotech initialization message.
- No Shion XML error, unresolved Shion cross-reference, AlienRace type lookup, config error or Shion exception occurred.
- Quick Test reached `Initializing new game` with the intended active mod list.
- The process was stopped after 45 seconds.
- `-nographics` produced unsupported shader, 0×0 resolution and atlas-related errors, so this run does not prove visual correctness.
- RimWorld's discovery scan reported a HAR metadata warning from an unrelated inactive local mod; that mod and HAR were not active.

## Graphical runtime smoke

A normal graphical RimWorld `1.6.4871 rev591` client ran an isolated, non-shipping smoke harness with the official content, VEF and the changed Shion build. HAR was absent from the active mod list. A vanilla Colonist generation control passed in the same process.

The first Shion generation attempt exposed two vanilla integration defects in the PR head:

- Replacing Human life stages with an adult-only stage invoked the adult life-stage worker before the pawn story tracker existed.
- Using the vanilla `Mechanoid` FleshType prevented RimWorld from installing the relations tracker required by humanlike pawn generation.

The corrected build inherits Human life stages and uses the Core-owned `ShionMechanical` FleshType. Its `isOrganic` value is retained strictly as RimWorld's humanlike-tracker compatibility flag; Shion sterility, genderlessness, zero pregnancy chance and mechanical presentation remain separately specified.

The corrected build passed:

- vanilla/Biotech Def identity and three configured scenario pawns;
- vanilla Colonist control generation;
- Shion pawn generation with `Shion_Xenotype`;
- absent Food Need and zero biological-aging factor at generation;
- Ledger reserve/commit/release idempotency and insufficient-funds rejection;
- creation of the three-stage production plan and its job/batch records;
- partial/full Storage transfer count conservation;
- duplicate transfer operation ID idempotency.

## No-buffer production and extensible-UI runtime smoke

A second normal graphical RimWorld `1.6.4871 rev591` Quick Test used the updated Shion build and an updated non-shipping smoke harness. The active list contained the official game, all five DLCs, VEF, `daffodil.shion.pr1current`, and `daffodil.shion.pr1smoke`.

The updated build passed:

- all six visible `KombinatManagementPageDef` records loaded in declared order;
- all six `KombinatManagementPageWorker` classes constructed inside RimWorld;
- the Storage-to-Kombinat integrated UI launcher registered before gameplay;
- `KombinatFacilityProfileDef` supplied supported patterns, interval, and speed;
- the factory exposed no active Input/Output Buffer properties;
- exact input Thing slices and output capacity were reserved once;
- a normal transfer requesting six units from a stack with four reserved moved only the two unreserved units;
- a second production operation could not promise already-reserved output capacity;
- production commit consumed four reserved inputs and created two outputs directly in Storage;
- repeating the same commit operation changed no physical count;
- release changed no Thing count and left no output-capacity reservation.
- a full six-unit Storage reserved a four-unit input/two-unit output transform and committed to a valid four-unit total by accounting for capacity released in the same transaction.

The final smoke log contained both PASS lines and no smoke failure, Shion exception, XML/config error, cross-reference error, or unresolved Shion Def. The temporary RimWorld `Mods` junctions and test process were removed after the run.

The smoke harness was an isolated validation tool and is not included in the shipped mod. Its passing result does not replace the scenario, save/load, visual, destructive-path or soak gates below.

## Core plus five-DLC mass-production runtime smoke

A third normal graphical Quick Test loaded the current assemblies under an isolated package ID with Core, Royalty, Ideology, Biotech, Anomaly, Odyssey, VEF and the non-shipping smoke harness. The catalog was generated from loaded public `RecipeDef` records under `Shion_MassProductionPolicy_Official`; it did not use a product-name allowlist.

The corrected build passed:

- 247 eligible recipe patterns across all six allowed official package IDs;
- inclusion of industrial components, simple meals, granite blocks, stuffable parkas and charge rifles;
- exclusion of every Archotech-tech output, the orbital bombardment targeter and the Archotech shard lance;
- exclusion of special/context-dependent and non-default-worker recipes;
- Def-driven catalog ordering, search source data and all six extensible management pages;
- recipe ingredient resolution against available Storage inventory;
- direct component input reservation, commit and output creation without a factory buffer;
- Stuff Def preservation and deterministic Normal quality on a produced parka;
- repeated production commit without count or output drift.

The first diagnostic run exposed two invalid assumptions before this passing run: normal crafting recipes have `targetsBodyPart` enabled in RimWorld 1.6, and ordinary quality-capable weapons can contain `CompArt`. The final eligibility rule uses `RecipeDef.IsSurgery` and explicit special-context fields for context rejection, while output quality remains policy-owned. The final smoke log contained the pregame and game-runtime PASS lines with no Shion failure.

## Physical Shion body runtime smoke

A normal graphical RimWorld `1.6.4871 rev591` Quick Test loaded Core, all five official DLCs, VEF, the current Shion build and the non-shipping smoke harness. HAR was absent from the active list. The final run passed:

- `Shion_StandardBody` topology: Human exterior/skeleton plus one reactor, one artificial brain, two fluid reprocessors, two physical fox ears and one physical tail, with no biological heart, brain, kidneys, lungs, stomach, liver or ears;
- adopted abstract stats, including MoveSpeed 5, mass 30 kg, WorkSpeedGlobal/SocialImpact 150%, and zero filth/flammability;
- Shion generation, Xenotype, absent Food Need, present Rest Need and zero biological aging;
- the 0.02 Rest floor without immediate downing or death;
- tail-loss MoveSpeed at the Def-driven 85% factor;
- one fluid reprocessor at 50% capacity and immunity gain, two lost as nonlethal immobilization, and recovery after restoration;
- incremental vanilla BloodLoss conversion into complete, nonlethal `Shion_CellLoss`;
- Anomaly duplication leaving no live duplicate through the public Pawn duplication/spawn lifecycle;
- direct Inhumanized application removed by the Gene Def's immune-Hediff list;
- active constant identity mood +8 and declared Shion slavery mood -46;
- reactor and artificial-brain loss as fatal outcomes;
- all earlier Storage, Kombinat, six-page UI and 247-pattern official catalog checks.

The test corrected two initial assumptions. `HediffDef.duplicationAllowed=false` controls Hediff duplication and does not exclude a Pawn from `AnomalyUtility.TryDuplicatePawn`; the unused marker was removed and the final implementation uses the public `Pawn.Notify_DuplicatedFrom`/`SpawnSetup` lifecycle without patching Anomaly. Also, Gene immunity protects ordinary application paths but a direct health-tracker insertion can bypass it, so the interval body-state pass removes every Hediff named in the Gene Def's `makeImmuneTo` list without hard-coded Hediff branches.

The final log contained the pregame, body-runtime and game-runtime PASS lines with no Shion XML error, unresolved cross-reference, config exception, renderer exception or smoke failure. The non-shipping harness is not included in the mod.

## Remaining in-game gates

A normal graphical client with HAR disabled must still verify:

- Independent Expedition enters the map with exactly three `Shion_Race` pawns, the intended skill coverage and `Shion_Xenotype`.
- Food Need remains absent, biological age remains fixed, Rest remains functional, and biological reproduction is unavailable across save/load.
- Vanilla apparel and physical-part-aware fox ears/tail render in every direction and in portraits, including their missing-part states.
- The new health states and duplicate rejection remain stable across save/load and normal player-driven Anomaly interactions.
- No Shion XML, cross-reference, texture, config, renderer or VEF exception appears in `Player.log`.
- Storage/Kombinat save migration, transactional save/load and the 60,000-tick performance soak pass the manual matrix.

The prerelease HAR race representation is not included in the save-migration guarantee.

Future error and performance evidence must follow `docs/DIAGNOSTICS.md`.
