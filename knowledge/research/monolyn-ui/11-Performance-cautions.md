---
type: "Research Reference"
title: "11. Performance cautions"
description: "UI and feedback systems must not introduce hidden cost.。"
tags:
  - "research"
  - "monolyn"
  - "ui"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "11. Performance cautions"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md"
    title: "25. Monolyn UI and Systems Reference Analysis"
---

# 11. Performance cautions

UI and feedback systems must not introduce hidden cost.

Avoid:

- UI refresh that scans the map every tick;
- research tab patching as a core dependency;
- constant tooltip recomputation across many buildings;
- apparel/hat rendering hacks;
- large custom windows updated every frame;
- log spam from non-critical errors;
- status systems that save long histories.

Any future UI layer must specify:

- refresh trigger;
- cached state source;
- fallback display;
- expected update frequency;
- failure state;
- compatibility assumptions.

## 関連項目

- 上位索引: [research/monolyn-ui](/research/monolyn-ui/index.md)
- 同じ出典の前項: [10. Shion Nexus UI checklist](/research/monolyn-ui/10-Shion-Nexus-UI-checklist.md)
- 同じ出典の次項: [12. Final lesson](/research/monolyn-ui/12-Final-lesson.md)

## 出典

- 25. Monolyn UI and Systems Reference Analysis（退役済み原本: `retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md`） — `11. Performance cautions`
