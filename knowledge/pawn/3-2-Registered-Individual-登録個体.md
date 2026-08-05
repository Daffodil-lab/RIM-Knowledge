---
type: "Pawn System Specification"
title: "3.2 Registered Individual"
description: "既存Pawnをプレイヤーが登録すると、個体を再構築するためのIndividual Archiveを作る。"
tags:
  - "shion"
  - "pawn"
  - "beta"
  - "equipment"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "pawn/3-2-Registered-Individual"
canonical_scope: "pawn-system"
source_section: "3.2 Registered Individual"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md"
    title: "Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1"
---

# 3.2 Registered Individual

既存Pawnをプレイヤーが登録すると、個体を再構築するための`Individual Archive`を作る。

Archiveは、名前、外見、人格特性、技能、Passion、能力、遺伝情報、身体構成、関係、所属、許可された履歴を保存する。装備は具体Thingの所有権と、再調達に使うLoadout Profileを分けて保存する。

同じ`individualId`を持つ活動中またはDormantの実体は、同時に一体だけ許可する。死亡後の再実体化は同じ`individualId`を継承する。

## 関連項目

- 上位索引: [pawn](/pawn/index.md)
- 同じ出典の前項: [3.1 Ephemeral Pawn](/pawn/3-1-Ephemeral-Pawn-一時個体.md)
- 同じ出典の次項: [3.3 Saved Pawn Design](/pawn/3-3-Saved-Pawn-Design-保存個体設計.md)

## 出典

- Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`） — `3.2 Registered Individual`
