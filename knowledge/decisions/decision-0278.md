---
type: "Decision Log Entry"
title: "確定#278：クラスター弾をジャミング弾へ統合し、独立弾種としては廃止"
description: "クラスター弾をジャミング弾へ統合し、独立弾種としては廃止を確定した決定履歴。"
tags:
  - "decision-log"
  - "equipment"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0278"
canonical_scope: "decision-history"
source_section: "確定#278"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#278：クラスター弾をジャミング弾へ統合し、独立弾種としては廃止

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §2.20]
Claude.aiレビューコメントの指示「＋範囲内の敵ステータスを低下させる子弾散布型——直接ダメージではなくデバフ主体の弾種　クラスター弾は削除」を受け、確定#275/#277で独立弾種として新設していた**クラスター弾を廃止し、その効果（範囲内の敵ステータスを低下させる子弾散布型・直接ダメージではなくデバフ主体）をジャミング弾へ統合**した。ジャミング弾は「着弾地点周辺の敵の索敵・通信・誘導兵器の精度を妨害する電子戦弾種」に加え、「範囲内の敵ステータスを低下させる子弾散布型」も兼ねる単一弾種となった——電子戦妨害とステータス低下デバフはいずれも直接ダメージではなく相手を弱体化させる系統として親和性が高いという整理。§2.20冒頭の火薬系弾種一覧・末尾の未確定リストからもクラスター弾を削除し、ジャミング弾側の未確定事項として「電子戦効果とステータス低下効果を実装する具体的なstatFactor/Hediff設計」に統合した。GILGAL/ESH/SODOM向けの弾種は10種→9種（RAKIAの2バリエーションを含めれば全11種→10種）に整理された。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#277：§2.20全11弾種の各行備考に液体装薬注入機の明記が漏れていたため個別に追記（確定#276の補完）](/decisions/decision-0277.md)
- 同じ出典の次項: [確定#279：TZOFEH/KESHER（§2.18）のMass・costList・製作スキル・バフ倍率・武器スロット扱いを確定](/decisions/decision-0279.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#278`
