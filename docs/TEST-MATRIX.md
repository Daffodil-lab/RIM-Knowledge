# Shion Core α test matrix

`Scripts/Validate-Mod.ps1` covers the static gate. Tests marked manual require a clean RimWorld client with VEF and all five official DLC enabled. HAR must be disabled.

## Kombinat KX

| ID | Verification | Type |
| --- | --- | --- |
| KX-001 | Reserve exact input Thing slices and output capacity once for a production operation ID | Runtime smoke + manual save/load |
| KX-002 | Repeat production reserve/commit/release operation IDs without input or output drift | Runtime smoke + manual save/load |
| KX-003 | Reject insufficient funds while preserving balance and history | Recorded runtime smoke |
| KX-004 | Refuse a stage before work when full output capacity cannot be reserved | Runtime smoke + manual |
| KX-005 | Produce Relay Blank, Calibrated Core and Clockwork Relay directly in Storage as real Things | Manual |
| KX-006 | Stop with explicit material, power and output-capacity reasons; resume after the event changes | Manual |
| KX-007 | Cancel an active request and release currency/input/capacity reservations without moving Things | Manual |
| KX-008 | Save/load during reservation, work and commit; no duplicate completion or currency debit | Manual |
| KX-009 | Build the catalog from actual Core plus five-DLC Recipe Defs and all six policy-owned package IDs | Static + recorded runtime smoke |
| KX-010 | Include industrial components, simple meals, stone blocks, stuffable apparel and a spacer weapon | Recorded runtime smoke |
| KX-011 | Exclude Archotech outputs, special/context recipes and products without a repeatable recipe such as the orbital bombardment targeter | Static + recorded runtime smoke |
| KX-012 | Keep research-locked entries visible but refuse stage resolution until their research is complete | Runtime smoke + manual |
| KX-013 | Resolve recipe ingredient filters from available Storage Things and preserve selected stuff plus Normal output quality | Recorded runtime smoke |
| KX-014 | Accept Def-driven order quantities from 1 through 10,000 without adding product-name branches to the UI or factory | Static + manual |

## Storage and vertical slice S2

| ID | Verification | Type |
| --- | --- | --- |
| S2-001 | About package ID, supported version and all six direct dependencies | Static |
| S2-002 | Exactly three Shion DLLs; no framework DLL bundled | Static |
| S2-003 | All XML parses and required Def names resolve textually | Static |
| S2-004 | English and Japanese Keyed sets are identical | Static |
| S2-005 | Independent Expedition produces exactly three `Shion_Race` pawns with `Shion_Xenotype` | Manual |
| S2-006 | Expedition skill guarantees cover construction/crafting, medicine/plants and research/social | Manual |
| S2-007 | `Shion_ClockworkBody` removes Food Need at generation and after load | Recorded runtime smoke + manual save/load |
| S2-008 | Built-in `Sterile` plus genderless race properties prevent pregnancy and fertilization | Manual |
| S2-009 | Biological age factor stays zero; Rest remains present and functional | Recorded runtime smoke + manual |
| S2-010 | Vanilla human renderer draws clothes and the physical-part-aware fox ears/tail in all directions and portraits without errors | Manual |
| S2-011 | Nearby import preserves Thing ID, quality, hit points, Comps and stack count | Manual |
| S2-012 | Partial and full direct transfer conserve the total physical count | Recorded runtime smoke |
| S2-013 | Duplicate transfer operation ID returns its prior result without moving again | Recorded runtime smoke |
| S2-014 | No output cell leaves every Thing in Storage; later recovery succeeds | Manual |
| S2-015 | Disconnect, despawn and destroyed-building paths unregister and safely drop contents | Manual |
| S2-016 | Save immediately after transfer, reload and repeat; ownership and totals remain stable | Manual |
| S2-017 | Storage search/list, capacity, endpoint ID and selected ejection remain usable | Manual |
| S2-018 | VEF Factory animation, completion Fleck and endpoint Overlay render | Manual |
| S2-019 | Visual features hidden/disabled do not change transfer, production or save results | Manual |
| S2-020 | 60,000-tick soak plus 500 requests/2,000 history/10,000 Storage Things records time, file and GC data | Manual release gate |
| S2-021 | Exactly six visible management Page Defs load in declared order and every worker constructs | Static + runtime smoke |
| S2-022 | Version-1 factory buffer contents migrate to Storage or a safe map drop; version-2 factory owns no production Thing | Manual save migration |
| S2-023 | Custom body contains Human exterior anatomy and skeleton, two fox ears, one tail, one reactor, one artificial brain and two fluid reprocessors, but no biological heart/brain/kidneys/lungs/stomach/liver | Static + runtime smoke |
| S2-024 | Base body durability is 150%; mass 30 kg, movement 5, crawling 1, filth 0 and flammability 0 resolve on a generated Shion | Static + runtime smoke |
| S2-025 | Work and social factors resolve to 150%; ranged cooldown and aiming delay to 75%; beauty 3, carrying capacity 100, royal favor 20 and market value 3,000 | Static + runtime smoke |
| S2-026 | Reactor or artificial-brain destruction kills; complete Cell loss immobilizes without death and then recovers naturally | Runtime smoke + manual |
| S2-027 | One fluid reprocessor lost reports 50% capacity and lowers immunity gain; both lost immobilize without death; restoration clears the failure state | Runtime smoke + manual |
| S2-028 | Tail loss changes MoveSpeed by the Def-driven 85% factor and suppresses the tail render node; complete fox-ear loss suppresses the ear node | Runtime smoke + manual visual |
| S2-029 | Rest Need remains present, sleep works, and the Def-driven rest floor prevents extreme-fatigue collapse without suppressing ordinary tiredness | Runtime smoke + manual |
| S2-030 | Shion cannot become a Shambler, receive Inhumanized or supported organic mutations, or pass Anomaly duplication eligibility | Static + runtime smoke |
| S2-031 | Permanent scars do not form, wounds heal through standard health behavior, infection immunity remains active and pain factor remains 100% | Static + manual |
| S2-032 | `more human than human` contributes constant mood +8; slavery adds the Shion-specific mood -46 | Static + runtime smoke |
| S2-033 | Ideoligion spread resolves to 500%, certainty loss to 50%, immunity gain to 2,500%, and meat/leather yield remains zero pending the explicit harvest decision | Static + runtime smoke |
| S2-034 | Save/load preserves custom body parts, missing-part effects, Cell loss, anomaly guards, thoughts and the neutral drive curve without duplicate state | Manual save/load |
| S2-035 | Health maintenance runs only on Shion gene ticks, performs no map/Pawn scan, and a 60,000-tick profile shows no unexpected allocation or health-state churn | Static + manual release gate |

## Performance release gates

- Race identity checks are direct Def comparisons and perform no per-tick map or pawn-list scan.
- A future general planner must process at most 200 nodes in 100 ms total or slices of at most 4 ms/frame.
- The production runtime is event/interval driven and must not scan all map Things, recipes or jobs every tick.
- S2-020 must report zero Storage count drift, leaked reservation, double completion and unrecovered terminal transaction.
- Error and performance evidence must follow `docs/DIAGNOSTICS.md`, including an immediate log and an uncropped Analyzer capture with the active tab, columns, FPS/TPS and details panel.
