---
type: "Decision Log Entry"
title: "確定#252：個人名/セル暗号/読みをバニラNameTriple（名前/姓/ニックネーム）へ正式対応づけ——単一名整形方式を撤回"
description: "個人名/セル暗号/読みをバニラNameTriple（名前/姓/ニックネーム）へ正式対応づけ——単一名整形方式を撤回を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0252"
canonical_scope: "decision-history"
source_section: "確定#252"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#252：個人名/セル暗号/読みをバニラNameTriple（名前/姓/ニックネーム）へ正式対応づけ——単一名整形方式を撤回

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_命名・言語_設定v1.md §6]
ユーザーメモ「ゲームでは個人名＝名前　セル暗号姓　ニックネーム　プレイヤーが選択している対応した言語の読み」を受け、命名・言語設定v1§6実装メモのS13時点の記述（「姓を持たないため単一名扱いとし、表示名を『個人名〈セル暗号〉』に整形する」）を撤回し、バニラのNameTriple構造（名前／ニックネーム／姓の3フィールド）へ正しく対応づける方式に更新した。**名前＝個人名（§2）／姓＝評議会セル暗号（§3）／ニックネーム＝プレイヤーが選択している言語に対応した「読み」**（本書各名前プール表の「読み」列の値。UI言語設定に応じ片仮名読み・キリル読み等を切り替える窓口）。生成は種族ThingDefのバニラ`nameGenerator`（`RulePackDef`）＋BackstoryDefで3フィールドへ直接流し込む形とし、独自の文字列整形ロジックは不要と判明。「姓を持たない（家名の継承がない）」というlore上の建前（§4）自体は変更なし——評議会セル暗号は家系を示す姓ではなく所属細胞の符牒だが、バニラの姓フィールドを技術的に流用するだけで、設定上の「姓なし」原則とは矛盾しない、という整理。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#251：コロニードクトリンによるユニット製造コスト補正、および3Dプリンターのレシピ自動生成＋変換効率の可変化を確定](/decisions/decision-0251.md)
- 同じ出典の次項: [確定#253：研究「ペルソナコア修理」を「ユニット修理」に改称](/decisions/decision-0253.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#252`
