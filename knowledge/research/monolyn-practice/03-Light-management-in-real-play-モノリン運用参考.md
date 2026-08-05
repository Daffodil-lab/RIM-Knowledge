---
type: "Research Reference"
title: "3. Light management in real play"
description: "Reported player issue、具体的にはThere is no direct electricity-to-Light conversion.とAs colony wealth/scale grows, Light income can fall…。"
tags:
  - "research"
  - "monolyn"
  - "player-practice"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "3. Light management in real play"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md"
    title: "24. Monolyn Player Practice Reference Analysis"
---

# 3. Light management in real play

## 3.1 Late-game Light shortage

Reported player issue:

- There is no direct electricity-to-Light conversion.
- As colony wealth/scale grows, Light income can fall behind maintenance demand.
- Some players appear to compensate through mod setting changes and large numbers of dedicated prayer workers.

Reported example:

- Prayer multiplier set to 3x.
- Very large effective daily prayer labor allocation.
- This was described as needed to maintain a roughly 500k-wealth colony.

Design lesson:

- If a central resource scales primarily through labor, late game may become a labor tax rather than a strategic system.
- Players may solve this through settings changes if the expected economy is too punishing.

Shion Nexus translation:

- CVE must not become a large prayer-style labor treadmill.
- Alpha CVE recovery is passive and tiny, but player-facing loops should not require many permanent Worker Terminals just to sustain the system.
- Future CVE amplifiers should have explicit caps, costs, and clear economy curves.

## 3.2 Memory Pillar as capacity expansion

Reported player issue:

- Memory Pillar increases Tower Light storage capacity.
- Early purpose is unclear to some players.
- Once understood, it becomes a main capacity-expansion tool.

Design lesson:

- Capacity expansion buildings need obvious Inspect text and usage explanation.

Shion Nexus translation:

- Terminal Control Capacity, Terminal Shells, CVE max, Mercy Stock, and Record Integrity must be readable.
- Future capacity-expansion structures should have direct labels such as `+CVE Max`, `+Terminal Control Capacity`, or `+Record Capacity`.
- Alpha Tower Ledger should show capacity even if expansion is not implemented.

## 関連項目

- 上位索引: [research/monolyn-practice](/research/monolyn-practice/index.md)
- 同じ出典の前項: [2. Basic loop and onboarding problems](/research/monolyn-practice/02-Basic-loop-and-onboarding-problems-モノリン運用参考.md)
- 同じ出典の次項: [4. Baptism use and costs](/research/monolyn-practice/04-Baptism-use-and-costs-モノリン運用参考.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 24. Monolyn Player Practice Reference Analysis（退役済み原本: `retired-source://project/docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md`） — `3. Light management in real play`
