---
type: "Research Reference"
title: "11. Performance cautions"
description: "Avoid importing these patterns without hard limits、具体的にはschedule-driven labor loops that require many pawns;とunbounded resource demand…。"
tags:
  - "research"
  - "monolyn"
  - "player-practice"
  - "pawn"
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
    resource: "retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md"
    title: "24. Monolyn Player Practice Reference Analysis"
---

# 11. Performance cautions

Avoid importing these patterns without hard limits:

- schedule-driven labor loops that require many pawns;
- unbounded resource demand that grows with wealth;
- hidden background progress with unclear UI;
- cross-map logistics without transfer caps;
- terminal reconstruction without record caps;
- large custom UI without fallback;
- systems whose default solution is “increase mod setting multiplier.”

Any future adaptation must specify:

- active pawn impact;
- tick frequency;
- map scan policy;
- cache strategy;
- save-data cap;
- player-visible blocked reason;
- late-game scaling curve;
- compatibility fallback.

## 関連項目

- 上位索引: [research/monolyn-practice](/research/monolyn-practice/index.md)
- 同じ出典の前項: [10. Alpha impact](/research/monolyn-practice/10-Alpha-impact-モノリン運用参考.md)
- 同じ出典の次項: [12. Final lesson](/research/monolyn-practice/12-Final-lesson-モノリン運用参考.md)
- Pawn領域: [Pawn領域](/pawn/index.md)

## 出典

- 24. Monolyn Player Practice Reference Analysis（退役済み原本: `retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md`） — `11. Performance cautions`
