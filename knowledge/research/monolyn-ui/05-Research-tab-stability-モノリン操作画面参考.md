---
type: "Research Reference"
title: "5. Research tab stability"
description: "Reported issue、具体的にはClicking a dedicated research tab such as Shinsung Engineering can cause the description area to disappear, though…。"
tags:
  - "research"
  - "monolyn"
  - "ui"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "5. Research tab stability"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md"
    title: "25. Monolyn UI and Systems Reference Analysis"
---

# 5. Research tab stability

Reported issue:

- Clicking a dedicated research tab such as Shinsung Engineering can cause the description area to disappear, though research can still be selected.
- Other research-tab mods, such as ResearchTabScroller or similar tab patches, may be involved.
- Vanilla Research Panel can cause Tower decoding/research auto-cancel behavior.

Design lesson:

- Research tabs are a high-conflict surface in heavily modded RimWorld installs.
- A custom research UI or tab-heavy system must have a fallback.

Shion Nexus translation:

- Alpha should not rely on a custom research tab.
- Alpha research can be completed by scenario or use simple vanilla research Defs only if needed.
- Critical state must not be shown only through the research UI.
- Tower Ledger Inspect strings must be the fallback status surface.

## 関連項目

- 上位索引: [research/monolyn-ui](/research/monolyn-ui/index.md)
- 同じ出典の前項: [4. Icon and description ambiguity](/research/monolyn-ui/04-Icon-and-description-ambiguity-モノリン操作画面参考.md)
- 同じ出典の次項: [6. Other compatibility and implementation issues](/research/monolyn-ui/06-Other-compatibility-and-implementation-issues-モノリン操作画面参考.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 25. Monolyn UI and Systems Reference Analysis（退役済み原本: `retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md`） — `5. Research tab stability`
