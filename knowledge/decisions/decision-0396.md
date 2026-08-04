---
type: "Decision Log Entry"
title: "確定#396：装備の抽象指定を装備ファミリー＋非物理ポイントへ簡略化"
description: "装備の抽象指定を装備ファミリー＋非物理ポイントへ簡略化を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "independent-colony"
  - "equipment"
  - "canon"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0396"
canonical_scope: "decision-history"
source_section: "確定#396"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#396：装備の抽象指定を装備ファミリー＋非物理ポイントへ簡略化

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-25ユーザー確定――任意条件による抽象指定は複雑性に見合うかを再検討し、同程度の性能・費用で異なる装飾を持つ装備を多数支給する場合は、防具ポイント等で換算する方が単純ではないか。]

- 任意の全Stat、全Recipe、全MOD装備を動的に評価する汎用最適化器を装備指定の標準から外した。
- 装備指定を、特定ThingDef等を指定する**具体注文**と、作者が明示登録した同用途・同性能帯・同費用帯の候補集合を使う**装備ファミリー注文**へ分けた。
- Familyは役割、装備部位、候補ThingDefまたは基礎Thing＋Style／装飾差分、性能・費用帯、装備ポイント、数量、配置、所有、選択方式、失敗方針を持てる。
- 選択方式は固定順、重み付き、重複回避、一巡後重複等の単純な規則に限定する。「装飾ヘルメット10個」はFamily数量10と多様性Policyとして処理する。
- 装備ポイントはFamily間の予算、配備量、一式構成を比較する非物理的な計画値であり、Kombinat在庫、通貨、Recipe入力、資産価値ではない。
- 製造時は選ばれた具体Thingの実材料を消費し、完成後は具体Thingだけを正本とする。ロード時に再抽選しない。
- 外部MOD装備は明示登録またはAdapterなしにFamilyへ自動参加させない。
- α版は具体ThingDef／Recipe発注を基本とし、装備ファミリーと装備ポイントはβ版へ置く。

反映先：`README.md`、`Kombinat_実装仕様書_v3.md`、`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#395：Matter NetworkをKombinat倉庫基盤として採用し、物理資源を実Thingへ統一](/decisions/decision-0395.md)
- 同じ出典の次項: [確定#397：Matter Networkを無改造の必須依存へ固定し、上流欠陥とStasisをKombinat監査から除外](/decisions/decision-0397.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#396`
