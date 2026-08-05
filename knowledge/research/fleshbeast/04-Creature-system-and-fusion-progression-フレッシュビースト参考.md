---
type: "Research Reference"
title: "4. Creature system and fusion progression"
description: "Creatures can apparently be assigned to a master-like pawn group, similar in feel to mech escort commands: follow, attack, guard, or…。"
tags:
  - "research"
  - "fleshbeast"
  - "pawn"
  - "alpha"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "4. Creature system and fusion progression"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/23_FLESHBEAST_COLONY_DEEP_REFERENCE.md"
    title: "23. Fleshbeast Colony Deep Reference Analysis"
---

# 4. Creature system and fusion progression

## 4.1 Escort and command behavior

Creatures can apparently be assigned to a master-like pawn group, similar in feel to mech escort commands: follow, attack, guard, or defend points.

Design lesson:

- Role-specialized minions become usable when command UI is simple.

Shion Nexus translation:

- Future Guard/Operator Terminals need clear simple orders.
- Alpha Worker should remain simple and capped.
- Do not introduce broad combat-command systems in alpha.

## 4.2 Fusion tree

Reported combat creature progression:

- Finger Spike: basic disposable unit, produced from the Heart roughly several per few days.
- Try Spike: fusion of 3 Finger Spikes.
- Tough Spike: fusion of 4 Try Spikes.
- Bulb Freak: fusion of 7 Tough Spikes.
- Dreadmeld: fusion of 2 Bulb Freaks, boss-class large creature; damage can cause later splitting.

Design lesson:

- A fusion tree compresses many weak bodies into fewer strong bodies.
- This solves some active-unit clutter while preserving swarm fantasy.

Shion Nexus translation:

- Shion Nexus can imply many stored bodies but simulate few active terminal bodies.
- Terminal tiers can be future content, but alpha must prove one Worker Terminal first.
- Do not implement Dreadmeld-style splitting or endless active combat bodies.

## 4.3 Work and special creatures

Reported special bodies include:

- Burden Blob: hauling and enemy-structure dismantling worker.
- Hypnotic lure creature: draws wild animals toward flesh territory, with failure/rage risk.
- Medical creature: harvests body parts from corpses and repairs allies.
- Living prison creature: swallows downed enemies and maintains prisoners internally.
- Scrapmeld: anti-mechanoid creature that eats mechanoid corpses.

Design lesson:

- Role-specialized bodies are memorable when each solves one concrete colony problem.

Shion Nexus translation:

- Future terminal職級 can specialize: Worker, Guard, Engineer, Operator, Recovery, Medical, Anti-Mech.
- Use “職級,” not “カースト.”
- Alpha only needs Worker Terminal.
- Avoid automatic enemy luring, organ harvesting, and mobile prison systems in alpha.

## 関連項目

- 上位索引: [research/fleshbeast](/research/fleshbeast/index.md)
- 同じ出典の前項: [3. Human mutation, core creation, and division loop](/research/fleshbeast/03-Human-mutation-core-creation-and-division-loop-フレッシュビースト参考.md)
- 同じ出典の次項: [5. Buildings and infrastructure](/research/fleshbeast/05-Buildings-and-infrastructure-フレッシュビースト参考.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- 23. Fleshbeast Colony Deep Reference Analysis（退役済み原本: `retired-source://project/docs/23_FLESHBEAST_COLONY_DEEP_REFERENCE.md`） — `4. Creature system and fusion progression`
