---
type: "Research Reference"
title: "3. Delayed or opaque feedback"
description: "Reported issue、具体的にはA player can interact with the Tower and receive a vague message like something has happened, but see no immediate…。"
tags:
  - "research"
  - "monolyn"
  - "ui"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "3. Delayed or opaque feedback"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md"
    title: "25. Monolyn UI and Systems Reference Analysis"
---

# 3. Delayed or opaque feedback

Reported issue:

- A player can interact with the Tower and receive a vague message like something has happened, but see no immediate visible result.
- Developer answer suggests waiting about one day.
- Research can also appear as `no project active` while background progress is actually happening.

Design lesson:

- Delayed results need visible countdown, status, or expected outcome.
- Hidden progress that contradicts UI text looks like a bug.
- Vague feedback is not enough for a central system.

Shion Nexus translation:

- Tower Ledger should display every relevant process state directly.
- If an action has delayed resolution, show `processing`, `time remaining`, `next check`, or `pending result`.
- Alpha should avoid long hidden background processes.
- Operation messages should state what changed or why nothing changed.

Recommended Shion Nexus rule:

> No central Nexus action should only say “something happened.” It must update a visible state or return a specific block reason.

## 関連項目

- 上位索引: [research/monolyn-ui](/research/monolyn-ui/index.md)
- 同じ出典の前項: [2. Overall system reception](/research/monolyn-ui/02-Overall-system-reception.md)
- 同じ出典の次項: [4. Icon and description ambiguity](/research/monolyn-ui/04-Icon-and-description-ambiguity.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 25. Monolyn UI and Systems Reference Analysis（退役済み原本: `retired-source://project/docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md`） — `3. Delayed or opaque feedback`
