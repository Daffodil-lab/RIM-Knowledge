---
type: "Research Reference"
title: "Adopted and ported"
description: "Adopted and portedは、Source：Reused idea：Kombinat resultとMeikoNexus.csproj：net472, Krafs.Rimworld.Ref, direct Assemblies…。"
tags:
  - "kombinat"
  - "implementation"
  - "code-reference"
organization_groups:
  - "kombinat-communities"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "Adopted and ported"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md"
    title: "Known-code extraction record"
---

# Adopted and ported

| Source | Reused idea | Kombinat result |
|---|---|---|
| `MeikoNexus.csproj` | net472, `Krafs.Rimworld.Ref`, direct Assemblies output | `Kombinat.csproj` |
| `NexusPersonaRecord` / `MeikoUnitDesign` | small `IExposable` records with safe collection reinitialization | ledger balance, line, and reservation records |
| `CompNexusCore` | reserve/commit/release lifecycle and delta-safe state persistence | transaction records with stable IDs and terminal states |
| `NexusLedgerBuildExtension` | explicit Def registration instead of automatic mutation of unknown Defs | `KombinatResourceDef`; future profiles follow the same boundary |
| `MapComponent_NexusLedgerBuild` | snapshot mutable lister results before destroying/replacing entries | retained as an implementation rule for future map adapters |
| `MapComponent_MeikoZeroPointField` | scheduled processing, Def cache after load, post-load collection repair | cache rebuild and validation; no every-tick scan |
| `MeikoDebugActions` | in-game Debug Actions for behaviors that are otherwise slow to reproduce | isolated transaction self-test in the Kombinat debug menu |

## 関連項目

- 上位索引: [research/known-code](/research/known-code/index.md)
- 同じ出典の前項: [Sources inspected](/research/known-code/001-Sources-inspected.md)
- 同じ出典の次項: [Adapt, do not copy directly](/research/known-code/003-Adapt-do-not-copy-directly.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)

## 出典

- Known-code extraction record（退役済み原本: `retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md`） — `Adopted and ported`
