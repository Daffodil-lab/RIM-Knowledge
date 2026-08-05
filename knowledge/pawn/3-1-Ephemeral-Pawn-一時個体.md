---
type: "Pawn System Specification"
title: "3.1 Ephemeral Pawn"
description: "適合生成の既定出力であり、また役割上必要な情報だけを指定し、それ以外をランダム生成する。"
tags:
  - "shion"
  - "pawn"
  - "beta"
  - "equipment"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "pawn/3-1-Ephemeral-Pawn"
canonical_scope: "pawn-system"
source_section: "3.1 Ephemeral Pawn"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md"
    title: "Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1"
---

# 3.1 Ephemeral Pawn

適合生成の既定出力である。役割上必要な情報だけを指定し、それ以外をランダム生成する。

生存中とDormant保管中は、通常Pawnとして名前、関係、経験、身体、装備を保存する。死亡後も、遺体が存在し、再起動または回収処理を選べる間はPawn情報を保持する。

遺体を再資源化した場合は、Pawn、Corpse、World Pawn、Relation、Archive、個体参照付き履歴を残さない。統計へ残す場合は、個体IDと名前を持たない集計値だけにする。

## 関連項目

- 上位索引: [pawn](/pawn/index.md)
- 同じ出典の前項: [3. 個体分類](/pawn/03-個体分類.md)
- 同じ出典の次項: [3.2 Registered Individual](/pawn/3-2-Registered-Individual-登録個体.md)

## 出典

- Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`） — `3.1 Ephemeral Pawn`
