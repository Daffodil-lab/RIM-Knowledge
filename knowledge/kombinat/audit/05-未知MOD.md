---
type: "Verification Specification"
title: "5. 未知MOD"
description: "未知MODのThingとRecipeはCore Storageの互換判定とKombinatのRecipe分類を通し、安全な公開契約だけへ接続する。"
tags:
  - "kombinat"
  - "audit"
  - "verification"
  - "pawn"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: verification
granularity: section
canonical_for: "kombinat/audit/05-未知MOD"
canonical_scope: "kombinat-verification"
source_section: "5. 未知MOD"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_追加層_仮想シミュレーション監査_v2.md"
    title: "Kombinat追加層 仮想シミュレーション監査 v2"
---

# 5. 未知MOD

未知MODのThingはCore StorageのCompatibility Contractが分類し、Kombinatは予約可能と確定されたThingだけを工程へ算入する。Kombinatは外部RecipeとFactory Adapterの副作用、作業主体、出力所有者を検証する。

| 対象 | 既定 |
|---|---|
| XMLだけの単純Recipe | 検証後にKombinat Automated候補 |
| Pawn技能・品質依存 | Vanilla Work Required |
| World／Quest副作用 | Official Adapter RequiredまたはUnsupported |
| 独自Factory | 正式Adapterがある場合だけ接続 |
| 独自Storage | Core公開Adapterで原子的予約・受渡し・取消を証明できる場合だけ接続 |

## 関連項目

- 上位索引: [kombinat/audit](/kombinat/audit/index.md)
- 同じ出典の前項: [4. シナリオ](/kombinat/audit/04-シナリオ.md)
- 同じ出典の次項: [6. 破壊的操作](/kombinat/audit/06-破壊的操作.md)
- Pawn領域: [Pawn領域](/pawn/index.md)

## 出典

- Kombinat追加層 仮想シミュレーション監査 v2（退役済み原本: `retired-source://project/Kombinat_追加層_仮想シミュレーション監査_v2.md`） — `5. 未知MOD`
