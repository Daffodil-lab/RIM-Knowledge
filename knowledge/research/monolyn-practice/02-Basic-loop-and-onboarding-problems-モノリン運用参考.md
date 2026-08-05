---
type: "Research Reference"
title: "2. Basic loop and onboarding problems"
description: "Reported player issue、具体的にはPrayer is not handled as an ordinary Job.とPlayers assign Meditate through the Schedule tab.を扱う。"
tags:
  - "research"
  - "monolyn"
  - "player-practice"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "2. Basic loop and onboarding problems"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md"
    title: "24. Monolyn Player Practice Reference Analysis"
---

# 2. Basic loop and onboarding problems

## 2.1 Prayer as Schedule/Meditate, not a normal Job

Reported player issue:

- Prayer is not handled as an ordinary Job.
- Players assign **Meditate** through the Schedule tab.
- A meditation spot can be placed from the Misc tab.
- Multiple Q&A questions suggest this is a common first-time confusion.

Design lesson:

- A system can be mechanically simple but still feel broken if the entry point is hidden in a non-obvious UI location.

Shion Nexus translation:

- Worker Terminal output should be visible through Terminal Hangar and Tower Ledger commands, not hidden behind an unrelated vanilla schedule mode.
- CVE recovery and terminal limits should appear in Inspect strings and Gizmos.
- Alpha should prefer explicit command buttons and clear blocked messages.

## 2.2 Tower generation and settings shortcut

Reported player issue:

- Tower can appear naturally over time, similarly to Anomaly monolith behavior.
- Mod settings include a `Create Tower` shortcut to summon it immediately.

Design lesson:

- A central structure may need both narrative arrival and debug/setting shortcut for players who miss or dislike the wait.

Shion Nexus translation:

- Alpha scenario should start with Core, Ledger, Hangar, and one Worker already present.
- Do not require the player to wait for the Core to appear in Alpha 0.1.
- Later non-scenario starts may need a clear Core-awakening path.

## 2.3 Research UI confusion

Reported player issue:

- Research UI may show `no project active` while Tower decoding/research continues in the background.
- Developer replies clarify that progress is happening, but players can misread the UI as broken.

Design lesson:

- Background progress must be represented directly, or players will assume it failed.

Shion Nexus translation:

- Tower Ledger must display actual CVE, shell, capacity, logistics, Mercy Stock, and Record Integrity state.
- If a process runs in background, it needs a visible status line.
- Alpha should avoid hidden research/progression systems.

## 関連項目

- 上位索引: [research/monolyn-practice](/research/monolyn-practice/index.md)
- 同じ出典の前項: [1. Source status](/research/monolyn-practice/01-Source-status-モノリン運用参考.md)
- 同じ出典の次項: [3. Light management in real play](/research/monolyn-practice/03-Light-management-in-real-play-モノリン運用参考.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 24. Monolyn Player Practice Reference Analysis（退役済み原本: `retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md`） — `2. Basic loop and onboarding problems`
