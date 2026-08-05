---
type: "Research Reference"
title: "8. Performance and implementation notes"
description: "Anomaly-style stage readability should be implemented as static state variants, not animation-heavy effects.。"
tags:
  - "research"
  - "visual"
  - "anomaly"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "8. Performance and implementation notes"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/29_ANOMALY_MONOLITH_VISUAL_REFERENCE.md"
    title: "29. Anomaly Monolith Visual Reference for Nexus Core"
---

# 8. Performance and implementation notes

Anomaly-style stage readability should be implemented as static state variants, not animation-heavy effects.

Allowed:

- static state textures;
- one central aperture glow layer;
- short pulse on awakening or terminal output;
- amber/red-orange only when state changes to danger;
- no continuous particle field.

Not allowed:

- Anomaly-style effect spam;
- map-wide ambient effects;
- full-screen horror pulses;
- constant motes;
- hidden pawns;
- every-tick visual update.

Update triggers:

- Core awakened;
- CVE tier changed;
- Core damaged;
- Relay charge/protection state changed if shown on Core;
- permanent shutdown;
- terminal output event.

## 関連項目

- 上位索引: [research/anomaly-monolith](/research/anomaly-monolith/index.md)
- 同じ出典の前項: [7. Relationship to existing references](/research/anomaly-monolith/07-Relationship-to-existing-references.md)
- 同じ出典の次項: [9. Updated Core prompt guidance](/research/anomaly-monolith/09-Updated-Core-prompt-guidance.md)

## 出典

- 29. Anomaly Monolith Visual Reference for Nexus Core（退役済み原本: `retired-source://project/docs/29_ANOMALY_MONOLITH_VISUAL_REFERENCE.md`） — `8. Performance and implementation notes`
