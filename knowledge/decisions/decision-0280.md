---
type: "Decision Log Entry"
title: "確定#280：NISTAR/MISTOR/MAGENシリーズ（§2.19）のSharp/Blunt/Heat/Mass/costList・シールド値・ステルス性演算順序を確定"
description: "NISTAR/MISTOR/MAGENシリーズ（§2.19）のSharp/Blunt/Heat/Mass/costList・シールド値・ステルス性演算順序を確定した決定履歴。"
tags:
  - "decision-log"
  - "equipment"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0280"
canonical_scope: "decision-history"
source_section: "確定#280"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#280：NISTAR/MISTOR/MAGENシリーズ（§2.19）のSharp/Blunt/Heat/Mass/costList・シールド値・ステルス性演算順序を確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §2.19、シオン/Shion_CoreMOD資料_v1.md §13]
ユーザー指示「NISTAR/MISTOR/MAGEN（§2.19）の数値を埋めて下さい」を受け、確定#272/#273で数値方向のみ確定していたステルス装備群のPhase9持ち越し項目を解決した。段1アンカー（Sharp72%/Blunt30%/Heat14%＝KIBBUTZ Medium）と既存のステルス軽装DYBBUK（10%/5%/5%/1.5kg）を参照点に、**NISTAR**＝8%/4%/4%/1.1kg・Steel10（DYBBUKよりさらに軽量な上級品）、**MISTOR**＝10%/6%/8%/1.8kg・Steel8（嵩張る分Heatに優れる普及品）を確定。**MAGENシリーズ（6点セット）**は、実在のマディム・ベト（迷彩服＋オーバースーツ）と、BRIT/MEZUZAH/DANIEL/ARONそれぞれの上位互換であるシールド付きチェストハーネス／チェストリグ／レッグリグ／バトルベルトの各piece単位でSharp/Blunt/Heat/Mass/Steel/ComponentIndustrialを新設し、**各ピースのシールド値をチェストハーネス25／チェストリグ35／レッグリグ20／バトルベルト20＝4ピース合算100**に確定した（バニラShield belt標準値110に近いが意図的に完全一致はさせない、§0.5の一般原則を踏襲）。**ステルス性補正の演算順序**：固定ボーナス（KIBBUTZ／KOVAの−1）を先に加算し、その後に乗算ボーナス（GALUTHの×0.9・MAGENフルセットの×0.8）を適用する——バニラのstat計算がオフセット合算後にファクターを乗算する順序に倣う。**下限0でクランプ**し負値は許容しない（ステルス性は物理的な距離を表すため）。装備数値表v1§2.19・CoreMOD資料v1§13・§5未確定リスト（旧13番、解決済みのため削除）に反映済み。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#279：TZOFEH/KESHER（§2.18）のMass・costList・製作スキル・バフ倍率・武器スロット扱いを確定](/decisions/decision-0279.md)
- 同じ出典の次項: [確定#281：SHOFAR（手榴弾ベルト）を装備数値表v1に新規収録し数値を確定](/decisions/decision-0281.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#280`
