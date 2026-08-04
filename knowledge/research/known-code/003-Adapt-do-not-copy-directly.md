---
type: "Research Reference"
title: "Adapt, do not copy directly"
description: "Adapt, do not copy directlyは、Legacy code：ReasonとCompNexusCore CVE and digital-material fields：Aggregate reservedCVE floats have no…。"
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
source_section: "Adapt, do not copy directly"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md"
    title: "Known-code extraction record"
---

# Adapt, do not copy directly

| Legacy code | Reason |
|---|---|
| `CompNexusCore` CVE and digital-material fields | Aggregate `reservedCVE` floats have no transaction identity and cannot prove exactly-once commit after transfer/save boundaries. |
| `CompNexusConstructionSite` | Correct lifecycle shape, but reservations point to a building Comp rather than the World-level canonical ledger. It will later consume a Kombinat transaction ID. |
| `CompMeikoAutoPrinter` | Useful scheduled-production and blocked-output behavior, but it is directly coupled to PipeSystem and deducts two networks after attempting output. Future production will reserve all inputs through one Kombinat transaction. |
| `MapComponent_MeikoZeroPointField` | Useful scheduled/cached map-state pattern, but the old zero-point gauge and hard-coded Japanese messages are Core content, not Kombinat runtime state. |

## 関連項目

- 上位索引: [research/known-code](/research/known-code/index.md)
- 同じ出典の前項: [Adopted and ported](/research/known-code/002-Adopted-and-ported.md)
- 同じ出典の次項: [Rejected from the runtime](/research/known-code/004-Rejected-from-the-runtime.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)

## 出典

- Known-code extraction record（退役済み原本: `retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md`） — `Adapt, do not copy directly`
