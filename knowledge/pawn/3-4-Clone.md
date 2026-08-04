---
type: "Pawn System Specification"
title: "3.4 Clone"
description: "登録個体または保存設計をClone Sourceにできる。"
tags:
  - "shion"
  - "pawn"
  - "beta"
  - "equipment"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "pawn/3-4-Clone"
canonical_scope: "pawn-system"
source_section: "3.4 Clone"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md"
    title: "Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1"
---

# 3.4 Clone

登録個体または保存設計をClone Sourceにできる。

Cloneは元と同じ名前、外見、身体構成、人格特性、技能、能力を初期値として持てる。ただしゲーム内部では固有の`pawnInstanceId`と`individualId`を持ち、生成後の経験、関係、傷、改造、装備を別々に保存する。

Clone生成回数と同時存在数に設計上の固定上限を置かない。同じ原型をRepeat Orderへ登録し、一人のシオンとそのCloneだけでコロニーを構成できる。

---

## 関連項目

- 上位索引: [pawn](/pawn/index.md)
- 同じ出典の前項: [3.3 Saved Pawn Design](/pawn/3-3-Saved-Pawn-Design.md)
- 同じ出典の次項: [4. データ境界](/pawn/04-データ境界.md)

## 出典

- Shion Race: Core — β版 Pawn生産・保管・再生 仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`） — `3.4 Clone`
