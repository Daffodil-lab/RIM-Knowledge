---
type: "Research Reference"
title: "6. Other compatibility and implementation issues"
description: "Reported examples、具体的にはHats Display Selection conflict can make hat-wearing pawns invisible under roofs and cause lag; disabling a…。"
tags:
  - "research"
  - "monolyn"
  - "ui"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "6. Other compatibility and implementation issues"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md"
    title: "25. Monolyn UI and Systems Reference Analysis"
---

# 6. Other compatibility and implementation issues

Reported examples:

- `Hats Display Selection` conflict can make hat-wearing pawns invisible under roofs and cause lag; disabling a related option fixes it.
- Ideology generation can log non-fatal deity-name duplication errors around `DeityMaker_Monolyn`.
- Dedicated items such as `Terminal Judge` can produce red errors from missing `ThingComp` `compClass` definitions.

Design lesson:

- Visual equipment layers can conflict with apparel display mods.
- Ideology/faction generation names can collide.
- Missing comp definitions should be caught before release.

Shion Nexus translation:

- Alpha Worker visual should be simple and not depend on complex apparel display tricks.
- Avoid Ideology-specific generation in alpha.
- CI should catch XML errors, missing comp classes, duplicate DefNames, and obvious invalid Def structure.
- A red-error-free base-game-only startup is a release blocker.

## 関連項目

- 上位索引: [research/monolyn-ui](/research/monolyn-ui/index.md)
- 同じ出典の前項: [5. Research tab stability](/research/monolyn-ui/05-Research-tab-stability-モノリン操作画面参考.md)
- 同じ出典の次項: [7. UI/system strengths to learn from](/research/monolyn-ui/07-UI-system-strengths-to-learn-from-操作画面.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 25. Monolyn UI and Systems Reference Analysis（退役済み原本: `retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md`） — `6. Other compatibility and implementation issues`
