---
type: "Decision Log Entry"
title: "確定#272：観測・通信装備（TZOFEH/KESHER）とステルス装備（NISTAR/MISTOR/MAGENシリーズ）を新設、既存装備にステルス性補正を追加"
description: "観測・通信装備（TZOFEH/KESHER）とステルス装備（NISTAR/MISTOR/MAGENシリーズ）を新設、既存装備にステルス性補正を追加を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0272"
canonical_scope: "decision-history"
source_section: "確定#272"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#272：観測・通信装備（TZOFEH/KESHER）とステルス装備（NISTAR/MISTOR/MAGENシリーズ）を新設、既存装備にステルス性補正を追加

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §2.18（新設）・§2.19（新設）・§1.3・§2.8、シオン/Shion_CoreMOD資料_v1.md §13]
ユーザー指示「Diasporaシリーズに武器枠のスポッティングスコープ　光学装置と演算装置と通信装置が付属している　射程65Warmup1sCooldown0.1　バイポット必要　ユーティリティ枠の前線観測装備　観測・測距装備や通信装備一式　射程34Warmup1sCooldown0.1　観測された相手に砲撃する時にバフ　偵察/強襲部隊向けの元ネタRajuga Ponchoのステルス装備　ステルス性30　通常の部隊向けの元ネタポンチョライナーのステルス装備　ステルス性60　新しい装備　少し高価な通常の部隊向けの元ネタマディム・ベトの迷彩服とオーバースーツ　シールド付きチェストハーネスシールド付きチェストリグシールド付きレッグリグ　シールド付きバトルベルト嵩張るが役に立つシールドの値は加算されます　一式ステルス性0.8倍　GALUTHにステルス性0.9倍　KIBBUTZとKOVAシリーズにステルス性-１付与」を受け、装備数値表v1に新設§2.18・§2.19として反映した。**①§2.18観測・通信装備**：スポッター連動狙撃システム（§4.2・確定#263）を実装する具体的な装備2点——**TZOFEH**（צופה＝観測者、武器枠、光学/演算/通信装置内蔵、Range65/Warmup1s/Cooldown0.1、バイポット必要で§4.1バイポット展開システム・確定#261と連動、武器枠占有につき通常火器と併用不可の専任スポッター用装備）と**KESHER**（קשר＝連絡・通信、IDF実在の通信科用語、ユーティリティ枠、観測・測距＋通信装備一式、Range34/Warmup1s/Cooldown0.1、観測済みの相手への砲撃＝間接射撃にバフを付与、武器枠を占有しないため通常火器と併用可能）。**②§2.19ステルス装備**：ステルス性メカニクス（§13・確定#267〜269）に連動する具体的な数値を初めて確定——**NISTAR**（נסתר＝隠された、Rajuga Ponchoモチーフ、偵察/強襲部隊向け、ステルス性30）、**MISTOR**（מסתור＝隠れ場所、Poncho Linerモチーフ、通常の部隊向け、ステルス性60）、**MAGEN**（מגן＝盾）シリーズ（マディム・ベト＝IDF実在の戦闘服"מדים ב׳"モチーフの迷彩服＋オーバースーツに、シールド付きチェストハーネス／チェストリグ／レッグリグ／バトルベルト〔既存BRIT/MEZUZAH/DANIEL/ARONの上位互換〕を組み合わせた6点セット、通常の部隊向け・やや高価格帯、各ピースのシールド値は加算、嵩張る代償として一式装備時ステルス性×0.8）。**③既存品目への追加補正**：GALUTH（§1.3）にステルス性×0.9、KIBBUTZ／KOVAシリーズ（§2.8・Light/Medium/Heavy各3種）にステルス性−1を追加。CoreMOD資料v1§13にも、装備側で初めて確定したステルス性の実数値レンジ（0〜60超）を追記した。具体的なSharp/Blunt/Heat/Mass/costList・MAGENシリーズの個別シールド値・乗算/固定減算ペナルティの演算順序はいずれもPhase9で確定する。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#271：3Dプリンター・液体装薬注入機は有人稼働／無人稼働の二種類を持つと確定](/decisions/decision-0271.md)
- 同じ出典の次項: [確定#273：ステルス性は数値が低いほど良いと訂正、既存の×0.9/×0.8/−1補正はすべて有利なボーナスと確定](/decisions/decision-0273.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#272`
