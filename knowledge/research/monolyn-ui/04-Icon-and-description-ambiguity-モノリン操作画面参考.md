---
type: "Research Reference"
title: "4. Icon and description ambiguity"
description: "Reported issue、具体的にはGuardian Flare and Radiant Flare appear to have identical or near-identical descriptions.とDeveloper clarifies their…。"
tags:
  - "research"
  - "monolyn"
  - "ui"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "4. Icon and description ambiguity"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md"
    title: "25. Monolyn UI and Systems Reference Analysis"
---

# 4. Icon and description ambiguity

Reported issue:

- `Guardian Flare` and `Radiant Flare` appear to have identical or near-identical descriptions.
- Developer clarifies their functional difference as shield/battery, but game text does not make this obvious enough.
- `Memory Pillar` questions show that players do not immediately understand that it increases Tower Light storage.

Design lesson:

- Similar icons/items must be clearly separated by name, short description, tooltip, and Inspect text.
- Capacity expansion must say exactly what capacity it expands.
- Player-facing text should explain the gameplay function, not only flavor.

Shion Nexus translation:

- CVE, Terminal Shells, Terminal Control Capacity, Mercy Stock, Record Integrity, Relay charge, and recovery records need plain descriptions.
- Similar buildings should expose their exact effect in Inspect strings.
- Future capacity buildings should include direct numeric labels.

Required alpha text style:

- `CVE: 20 / 100`
- `Terminal Control Capacity: 1 / 3`
- `Terminal Shells: 2`
- `Relay Charge: Ready / Empty`
- `Recovery Records: 1`
- `Mercy Stock: 0`

## 関連項目

- 上位索引: [research/monolyn-ui](/research/monolyn-ui/index.md)
- 同じ出典の前項: [3. Delayed or opaque feedback](/research/monolyn-ui/03-Delayed-or-opaque-feedback-モノリン操作画面参考.md)
- 同じ出典の次項: [5. Research tab stability](/research/monolyn-ui/05-Research-tab-stability-モノリン操作画面参考.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 25. Monolyn UI and Systems Reference Analysis（退役済み原本: `retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md`） — `4. Icon and description ambiguity`
