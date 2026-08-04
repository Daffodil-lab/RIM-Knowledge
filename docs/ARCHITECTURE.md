# Shion Core α architecture

## Canonical ownership

Shion keeps gameplay truth in Shion-owned state. Vanilla RimWorld and official DLC own standard pawn behavior and rendering; VEF remains a visual projection.

| State | Canonical owner | Persistence |
| --- | --- | --- |
| Shion race identity and mechanical body properties | Vanilla `ThingDef` and `RaceProperties` in `Shion_Race` | Def-driven |
| Shion body topology and physical fox parts | Core `Shion_StandardBody`, `BodyPartDef` and race extension | Def-driven topology plus missing-part Hediffs |
| Need suppression, aging, anomaly guards and physical-part-aware render attachments | Biotech `XenotypeDef`, `GeneDef` and public Pawn render nodes | Pawn gene tracker |
| Physical resources, intermediates and products | `ThingOwner<Thing>` in Core Storage | Deep-scribed by the Storage Comp |
| Endpoint identity and connectivity | `MapComponent_ShionEndpointRegistry` plus spawned endpoint Comps | Stable endpoint IDs; rebuilt registration after load |
| Idempotent transfer outcomes | `MapComponent_ShionEndpointRegistry` | Last 2,048 operation results |
| Production input and output-capacity reservations | `MapComponent_ShionEndpointRegistry` | Stable operation records; `dataVersion = 3` |
| Alliance currency, requests, facility assignment and progress | `WorldComponent_KombinatLedger` | `dataVersion = 2` |
| Factory capability | `KombinatFacilityProfileDef`, `KombinatMassProductionPolicyDef` and `CompKombinatFactory` | Def-driven capability; Comp holds no production Things |
| Management pages | `KombinatManagementPageDef` plus page workers | Def-driven catalog; six alpha pages |
| Factory animation, completion Fleck and endpoint overlay | VEF | Projection only; never advances production or changes ownership |

Every physical Thing has exactly one current owner. A transfer uses `ThingOwner.TryTransferToContainer` directly and never drops the Thing on the map as an intermediate transport step. If a destination rejects a transfer, the source keeps ownership.

## Vanilla-first pawn boundary

`Shion_Race` is a normal Verse `ThingDef` inheriting `Human`. The inherited vanilla renderer, apparel handling, health tracker, jobs and UI remain authoritative. Core supplies `Shion_StandardBody` because the reactor, artificial brain, two fluid reprocessors, physical fox ears and physical tail must be real injury and restoration targets. Its exterior anatomy, limbs, skeleton, jaw and tongue retain the Human topology; biological heart, brain, kidneys, lungs, stomach and liver are absent.

`ShionMechanical` is a Core-owned `FleshTypeDef`. It supplies mechanical hit and wound effects while keeping RimWorld's `isOrganic` tracker flag so a humanlike pawn receives the standard relations and psychic trackers. This engine-compatibility flag does not grant biological reproduction: Shion remain genderless, use the built-in `Sterile` gene and have zero human-pregnancy chance. Shion inherit the vanilla Human life stages so tracker construction follows vanilla order; `Shion_Colonist` enforces an adult generation age, while `Shion_ClockworkBody` freezes biological aging.

`Shion_Xenotype` uses Biotech's normal pawn gene tracker. `Shion_ClockworkBody` uses the official `disablesNeeds`, immunity, wound and biological-age fields, plus one Shion-owned Gene class for state that has no Def-only hook. That class clamps Rest above the extreme-fatigue collapse boundary, converts vanilla BloodLoss into nonlethal `Shion_CellLoss`, rejects the Hediffs listed by its own Gene Def, rejects organic added-body-part mutations and derives complete fluid-reprocessor failure. It operates only on the owning Shion pawn; it does not scan maps or pawn lists.

The race keeps `Human` inheritance and uses the minimal `Pawn_Shion` subclass only for the public `Notify_DuplicatedFrom` and `SpawnSetup` lifecycle hooks. Anomaly may construct a candidate clone before it reports success; the clone is removed immediately after its attempted spawn and never becomes a playable duplicate. No Anomaly method is patched or reflected.

`Shion_FoxEars` and `Shion_FoxTail` reuse official Biotech textures through public render nodes. Their Core workers only suppress a node when the matching physical part is absent. Tail loss applies a Def-driven 85% MoveSpeed factor. One missing fluid reprocessor exposes 50% custom capacity and reduces ImmunityGainSpeed; losing both adds a nonlethal movement failure. Reactor and artificial-brain destruction remain fatal through standard vital-source tags.

The race stat block owns the adopted base values, including 150% body durability, work speed and social impact; MoveSpeed 5; mass 30 kg; 0% flammability; 0 filth; 75% cooldown and aim time; 2,500% immunity gain; beauty 3; carrying capacity 100; 500% Ideoligion spread chance; and 50% certainty loss. `Shion_MoreHumanThanHuman` supplies a constant +8 situational mood and `Shion_Enslaved` adds -46 while enslaved. The `driveWorkSpeedByMood` curve is connected to WorkSpeedGlobal but remains neutral until its dedicated thought stages are specified.

There is no `AlienRace.ThingDef_AlienRace`, HAR body addon, HAR DLL reference, or Shion Harmony patch. Runtime Shion checks compare the pawn's race Def directly with `Shion_Race`; they do not scan maps or gene lists.

## Runtime boundaries

`Shion.Core.dll` owns the expedition scenario and shared Def identities. It does not patch Verse/RimWorld methods.

`Shion.Storage.dll` owns `IStorageQueryService`, `IStorageTransactionService`, `IStorageProductionService`, `IEndpointRegistry`, endpoint registration, direct transfers, stored Thing identity, input reservations, output-capacity reservations, idempotent production commit and recovery ejection. Reservation counts use incrementally maintained indexes; there is no per-tick map or storage scan.

`Shion.Kombinat.dll` owns `IAccountService`, `IProductionApplicationService`, the World ledger, production requests, facility profiles, facility assignment/progress, native multi-stage orchestration, official-recipe catalog policy and the management page extension surface. It reaches Core Storage only through public storage contracts and never owns active production inventory.

Matter Network is not a dependency, migration source or implementation surface. There is no Harmony, reflection, private-field, Stasis, Def or DLL coupling to it.

## State transitions

Account transactions:

`new → reserved → committed`

`new → reserved → released`

`new → rejected`

Repeating an operation ID returns the already recorded result and does not debit twice.

Production requests:

`planned → material waiting/output-capacity waiting → working → committing/completed`

At any nonterminal state a request may become `cancelled`. Missing power, pattern, material, capacity or commit integrity produces an explicit reason. Cancellation releases live currency, input and output-capacity reservations. Physical input never leaves Storage before commit.

Each completed native Clockwork Relay unit runs all three stages with real intermediate Things:

`raw resources → Shion_RelayBlank → Shion_CalibratedCore → Shion_ClockworkRelay`

For every stage, Storage first reserves exact input Thing IDs/counts and enough destination capacity. Work begins only after both reservations exist. Completion consumes the reserved inputs and creates outputs directly in the reserved Storage endpoints under one operation ID. Repeating a committed operation returns its prior result.

## Core and official DLC mass-production catalog

`KombinatMassProductionPolicyDef` owns the allowed package IDs, excluded tech levels and products, research rule, output quality, work conversion and currency conversion. The alpha policy admits Core, Royalty, Ideology, Biotech, Anomaly and Odyssey. `KombinatProductionCatalog` derives entries once from loaded `RecipeDef` records; product Def names are not copied into a shipping allowlist.

An entry is eligible only when its recipe and every output belong to the allowed packages, a real recipe user and material list exist, the default deterministic `RecipeWorker` is used, and every output is a player-acquirable physical Item. Surgery, Hediff mutation, Mechanitor-only, Ideology-building-only, faction, meme, mutant, special-product and Archotech contexts are rejected. Products without a repeatable public recipe—such as the orbital bombardment targeter—never enter the catalog.

Research-locked entries remain visible but cannot begin. At execution, the pattern resolves each `IngredientCount` against currently available Storage inventory and the recipe filters. Input Thing slices and output capacity are then reserved by the same Storage transaction used by native production. Stuffable products preserve the selected stuff Def, and the alpha policy creates deterministic Normal-quality output. The policy list is cached; the Production page searches a cached view and draws only visible rows.

## Extensible management UI

The window discovers all visible `KombinatManagementPageDef` instances, sorts them by `order`, and constructs their `workerClass` once per window. It contains no fixed page enum or switch. The alpha Def set supplies Overview, Inventory, Production, Facilities, Logistics and Finance. Facilities and Logistics intentionally expose safe extension surfaces before remote facility and transit-cargo ownership are implemented.

Factory native-pattern support, mass-production policy, processing interval, work-speed factor, order bounds and overview quick-order count come from `KombinatFacilityProfileDef`. The opening account balance comes from the default `KombinatLedgerDef`. Adding another pattern, policy, facility profile, ledger policy or page does not require editing the terminal window.

The factory Gizmo deep-links to Facilities and a Storage Gizmo deep-links to Inventory through the public `StorageManagementUi` launcher delegate. Storage has no reverse assembly reference to Kombinat; if no integrated launcher is registered, its original contents window remains the safe fallback.

## Save and recovery

- Storage containers, transfer operations, production reservations, Account transactions, requests and active operation IDs are deep-scribed.
- Storage Registry uses `dataVersion = 3`; Kombinat Ledger and Factory migration state use `dataVersion = 2`.
- Version-2 production output records load through the compatibility output list. Version-3 records additionally persist the selected stuff Def and output quality.
- Endpoint registration is reconstructed from spawned Comps after load.
- Ledger indexes, currency totals and Storage reservation indexes are rebuilt after load.
- Version-1 factory `inputBuffer` and `outputBuffer` fields are read only for migration. Their Things move to available Core Storage or drop near the factory; new version-2 saves do not write empty legacy buffers.
- Building destruction drops every owned Thing near the former building.
- Failed manual ejection leaves the Thing in its original owner and reports the blocked output.
- Visual effects are outside the transaction path; disabling them cannot change a save result.
- Saves created with the prerelease HAR race representation are outside the migration guarantee.

## Accepted α limitations

- Official cat-ear and furry-tail textures remain temporary art; their visibility now follows Core-owned physical body parts.
- Human life stages, health tracker, surgery framework and exterior topology remain inherited, while Core owns the internal organ topology.
- The Def-driven recreation requirement offset is recorded as +3, but no per-pawn vanilla recreation-kind requirement exists; active enforcement is deferred to the dedicated enthusiasm/need design.
- A doubled malnutrition mood has no valid trigger while Food Need and malnutrition are absent; it is reserved for a future Cell or maintenance-deficit state rather than attached to an unreachable vanilla condition.
- Storage filter editing, alternative output selection and a dedicated recovery queue are represented by safe retention/manual ejection, but their richer UI is deferred.
- The current planner executes one Def-declared three-stage native pattern plus eligible single-stage official recipes; it does not yet expose a general 200-node graph editor.
- Remote facilities, supply claims, remote inventory and transit cargo are represented by disabled extension pages, not by local available stock.
- Performance soak measurements and the full clean-environment in-game matrix remain release-gate tests rather than automated unit tests.
