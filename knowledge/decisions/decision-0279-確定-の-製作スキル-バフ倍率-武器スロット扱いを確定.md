---
type: "Decision Log Entry"
title: "確定#279：TZOFEH/KESHER（§2.18）のMass・costList・製作スキル・バフ倍率・武器スロット扱いを確定"
description: "TZOFEH/KESHER（§2.18）のMass・costList・製作スキル・バフ倍率・武器スロット扱いを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0279"
canonical_scope: "decision-history"
source_section: "確定#279"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#279：TZOFEH/KESHER（§2.18）のMass・costList・製作スキル・バフ倍率・武器スロット扱いを確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §2.18]
ユーザー指示「TZOFEH/KESHER（§2.18）の数値を埋めて下さい」を受け、確定#272/#274で新設・確定#274まで進めていたTZOFEH/KESHERのPhase9持ち越し項目を解決した。両品目は火薬式火器ではなく光学/演算/通信一体機器のため、§2.17のバイオ液化燃料置換算式（標準火器限定）の対象外と整理し、通常のSteel/ComponentIndustrial構成を直接設定：**TZOFEH**＝Mass3.5kg・Steel25・ComponentIndustrial6・WorkToMake30000・製作スキル9（実在のスポッティングスコープ＋レーザー測距＋通信一体機器の重量帯を参照）。**KESHER**＝Mass2.0kg・Steel15・ComponentIndustrial4・WorkToMake16000・製作スキル7（双眼測距装備＋携行無線機の重量帯を参照）。**付与バフの倍率**：TZOFEHの「観測済み」状態は対象へ直接射撃する味方の`ShootingAccuracyPawn`×1.2・実効`Range`×1.15を付与（TZOFEH自体は武器枠占有につき射撃不可のため受益者は他の狙撃手）。KESHERの「観測済み」状態はGILGAL/ESH/SODOM等の**間接射撃のみ**に`ShootingAccuracyPawn`×1.3を付与し、**直接射撃には及ばない**（確定#272で残っていた未決定を間接射撃限定に確定）。**TZOFEHの武器スロット扱い**：`weaponTags`専用タグ（`Shion_SpotterDevice`）でSimple Sidearms等の自動武器選択/切替ロジックから除外し、プレイヤーの手動換装のみで切り替わる専任スポッター運用と確定した。装備数値表v1§2.18・§5未確定リスト（旧12番）に反映済み。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#278：クラスター弾をジャミング弾へ統合し、独立弾種としては廃止](/decisions/decision-0278-確定-クラスター弾をジャミング弾へ統合し-独立弾種としては廃止.md)
- 同じ出典の次項: [確定#280：NISTAR/MISTOR/MAGENシリーズ（§2.19）のSharp/Blunt/Heat/Mass/costList・シールド値・ステルス性演算順序を確定](/decisions/decision-0280-確定-シリーズ-の-シールド値-ステルス性演算順序を確定.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#279`
