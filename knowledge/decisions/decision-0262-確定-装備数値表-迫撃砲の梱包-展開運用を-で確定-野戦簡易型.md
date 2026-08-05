---
type: "Decision Log Entry"
title: "確定#262：装備数値表v1・迫撃砲の梱包/展開運用をFFF Deployable Itemで確定、「野戦簡易型」新設は撤回"
description: "装備数値表v1・迫撃砲の梱包/展開運用をFFF Deployable Itemで確定、「野戦簡易型」新設は撤回を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0262"
canonical_scope: "decision-history"
source_section: "確定#262"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#262：装備数値表v1・迫撃砲の梱包/展開運用をFFF Deployable Itemで確定、「野戦簡易型」新設は撤回

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §4]
前回セッションログで提案していた「軽量・短時間建造の野戦簡易型迫撃砲」の新設案（実際にはまだ装備数値表v1本体には反映されていなかった）を撤回する。Claude壁打ちセッション（2026-07-06）にて、FFF（Fortified Features Framework）の**Deployable Item**機能が「pawnのインベントリからの高速展開建造物、銃→タレット展開もサポート」と公式に明記されていることを確認し、事前に本体を建造→梱包してキャラバン/インベントリの積荷として砲弾と共に携行→戦闘発生時に任意地点で展開、という求めていた運用をまさにカバーすることが判明。GILGAL/ESH/SODOM全てにDeployable Itemを実装し、単一カテゴリのまま「事前配置」「携行して展開」の両運用に対応させ、新規バリアントの追加は不要と確定した。質量というバニラの既存パラメータにより、GILGAL（軽量35.3kg）は携行しやすく、ESH/SODOM（重量級）はキャラバン積載枠を大きく圧迫する——「どれを持ち出すか」の選択がプレイヤーの手腕に委ねられる形で自然な差別化が生まれる。装備数値表v1§4実装メモに反映済み。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#261：装備数値表v1・銃搭載バイポットによる展開システムを検討開始（未実装）](/decisions/decision-0261-確定-装備数値表-銃搭載バイポットによる展開システムを検討開始.md)
- 同じ出典の次項: [確定#263：装備数値表v1・スポッター連動の狙撃システム＋最優先目標指定コマンドを検討開始（未実装）](/decisions/decision-0263-確定-装備数値表-スポッター連動の狙撃システム-最優先目標指定コ.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#262`
