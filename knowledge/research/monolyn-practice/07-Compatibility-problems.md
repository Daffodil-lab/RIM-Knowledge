---
type: "Research Reference"
title: "7. Compatibility problems"
description: "Reported issues、具体的にはVanilla Research Panel can conflict with Tower decoding/research and auto-cancel it.とVE Framework-related faction…。"
tags:
  - "research"
  - "monolyn"
  - "player-practice"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "7. Compatibility problems"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md"
    title: "24. Monolyn Player Practice Reference Analysis"
---

# 7. Compatibility problems

Reported issues:

- Vanilla Research Panel can conflict with Tower decoding/research and auto-cancel it.
- VE Framework-related faction generation may be intentionally hidden or otherwise affected.
- Players often use large framework and UI mods together with race mods.

Design lesson:

- Complex mods must expect compatibility pressure from large UI and framework mods.

Shion Nexus translation:

- Alpha should avoid custom research UI, large custom UI, and deep framework assumptions.
- Use vanilla-friendly Defs and small comps first.
- If custom UI is added later, keep fallback Inspect strings.

## 関連項目

- 上位索引: [research/monolyn-practice](/research/monolyn-practice/index.md)
- 同じ出典の前項: [6. Base structure and expansion play](/research/monolyn-practice/06-Base-structure-and-expansion-play.md)
- 同じ出典の次項: [8. The four real Monolyn management layers](/research/monolyn-practice/08-The-four-real-Monolyn-management-layers.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 24. Monolyn Player Practice Reference Analysis（退役済み原本: `retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md`） — `7. Compatibility problems`
