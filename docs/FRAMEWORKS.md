# Framework usage and verification

Verification target: 2026-07-30, RimWorld `1.6.4871`, local Steam Workshop 1.6 installation.

## Direct external framework

| Framework | Required package ID | Referenced assembly | Purpose |
| --- | --- | --- | --- |
| Vanilla Expanded Framework | `OskarPotocki.VanillaFactionsExpanded.Core` | `1.6/Assemblies/VEF.dll` | DLL `1.1.9.0`, SHA-256 `AEBBF063BE18F314FA7040FA0FA3CC011CA413BF62641E84861A630E279C42FF`; Factory animation, completion Fleck and endpoint overlay |

CI may set `VEFAssemblyPath` to a pinned official checkout. The VEF reference uses `Private=false`; its DLL is not shipped in `1.6/Assemblies`.

## Official implementation used for Shion pawns

| Behavior | Official surface |
| --- | --- |
| Humanlike renderer, apparel, jobs, UI and health baseline | Verse `ThingDef ParentName="Human"` |
| Mechanical race properties | Verse `RaceProperties` |
| Stable body profile | Biotech `XenotypeDef` |
| Food Need suppression and zero biological-age factor | Biotech `GeneDef` fields |
| Sterility, toxic resistance, ears, tail and beard restriction | Built-in Biotech genes |

Humanoid Alien Races is neither a package dependency nor an assembly/XML surface. Shion also has no direct Harmony dependency and contains no Harmony patches. The verified VEF metadata declares Harmony as its own dependency; that transitive relationship is not a Shion code surface.

## External non-HAR reference

[Vivi Race](https://steamcommunity.com/sharedfiles/filedetails/?id=3241577976) is used only as an architectural reference showing that a humanlike race can combine vanilla `RaceProperties`, Biotech genes and xenotypes, a custom `BodyDef`, and a `PawnRenderTreeDef` without making HAR the required race owner. Its [public source](https://github.com/gguake/RWMod-Vivi) also demonstrates importing selected vanilla Human health and recipe behavior while keeping custom race mechanics in mod-owned Defs and code.

Shion remains one tier closer to vanilla: `Human` inheritance and built-in genes are the adopted alpha implementation. Vivi Defs, C#, DLLs, textures, names and tuned values are not copied. Any future custom Shion render node or body definition requires a Shion-owned specification, verified public RimWorld surface, license or permission review for any reused external material, save/load tests, apparel and portrait tests, and a measured performance comparison.

## Deliberate non-use

- VEF does not own the Shion pawn race, pawn rendering, item storage, production reservations, facility profiles, currency or production progress.
- VEF PipeSystem does not own Storage or transport.
- VEF ItemProcessor does not replace the Kombinat three-stage state machine.
- Matter Network is not referenced through DLLs, Defs, Harmony, reflection, private fields or Stasis.
- No compatibility layer for HAR, old VEF namespaces or prerelease HAR saves is included.
