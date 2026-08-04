---
type: "Decision Log Entry"
title: "確定#263：装備数値表v1・スポッター連動の狙撃システム＋最優先目標指定コマンドを検討開始（未実装）"
description: "装備数値表v1・スポッター連動の狙撃システム＋最優先目標指定コマンドを検討開始（未実装）を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0263"
canonical_scope: "decision-history"
source_section: "確定#263"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#263：装備数値表v1・スポッター連動の狙撃システム＋最優先目標指定コマンドを検討開始（未実装）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §4/§5]
Claude壁打ちセッション（2026-07-06）にて、観測手が対象を「観測」することで狙撃手の命中/実効射程が引き上がる一方、観測なしでは大幅なペナルティを受けるという狙撃システムの方向性を確認した。観測なしでは物理的に撃てなくなるハードゲートは、スポッター喪失時に高価な狙撃兵が完全無力化する事故を避けるため不採用とし、**ソフトゲート方式**を採用。装備数値表v1§0.4「超長射程specialist武器は視界・索敵と組み合わせて初めて意味を持つ」という既存の運用インセンティブに対する具体的なメカニクス上の答えとして機能する。バニラのターゲット選択ロジックには「観測済みでなければ撃てない/当たらない」という概念が無いため薄DLL必須——スポッターが対象へ「観測済み」Hediff/Compを付与するAbility＋、狙撃銃側の命中率/実効射程がそのHediff有無でstatFactor変動する仕組みで実装する方針とした。**追加確定：最優先目標指定コマンド**——スポッターが観測した敵集団の中から「最優先目標」を指定する機能を、プレイヤーが任意に発動するコマンドとして追加する（完全自動化はしない——「連携はプレイヤーの手腕」という方針と一貫させるため）。判定基準は選択式（基本＝脅威度〔Damage×Range等の複合指標〕、オプション＝敵の装備Range単体で対狙撃手に特化）とし、指定された最優先目標は狙撃兵/EZRA側の通常のFire at Willロジックより先に処理されるようパッチする。脅威度スコアの正確な算出式・コマンドのUIはPhase9で確定する未実装の検討事項として装備数値表v1§4/§5に記録した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#262：装備数値表v1・迫撃砲の梱包/展開運用をFFF Deployable Itemで確定、「野戦簡易型」新設は撤回](/decisions/decision-0262.md)
- 同じ出典の次項: [確定#264：将来構想・独自開拓団の「開拓戦争」（毒ガス＋ステルスクローク突撃部隊、未着手）](/decisions/decision-0264.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#263`
