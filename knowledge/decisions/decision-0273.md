---
type: "Decision Log Entry"
title: "確定#273：ステルス性は数値が低いほど良いと訂正、既存の×0.9/×0.8/−1補正はすべて有利なボーナスと確定"
description: "ステルス性は数値が低いほど良いと訂正、既存の×0.9/×0.8/−1補正はすべて有利なボーナスを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0273"
canonical_scope: "decision-history"
source_section: "確定#273"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#273：ステルス性は数値が低いほど良いと訂正、既存の×0.9/×0.8/−1補正はすべて有利なボーナスと確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §13、シオン/Shion_装備数値表_段0-2_v1.md §2.19]
Claude.aiレビューコメントの指示「ステルス性は数字が少ないほど良いです」を受け、確定#267の「値が高いほど敵に発見されにくくなる」という記述を訂正した。**正しくは値が低いほど良い**——ステルス性の値はそのまま「敵に発見されずに接近できる最短距離（安全接近距離）」を表し、0に近いほど深く・遅くまで気づかれずに接近できる（例：ステルス性1＝敵との距離が残り1マスになるまで発見されない＝優秀。ステルス性30なら敵が30マス以内に入った時点で発見される）。この訂正に伴い、AskUserQuestionで確認の上、確定#272で追加したGALUTH（×0.9）・MAGENシリーズ一式（×0.8）・KIBBUTZ／KOVAシリーズ（−1）の補正はすべて**数値を押し下げる方向＝有利なボーナス**であると確定した（「ペナルティ」ではない）。あわせてNISTAR（30）はMISTOR（60）より数値が低く、偵察/強襲部隊向けの上級品という位置づけが数値上も裏付けられることを確認した。CoreMOD資料v1§13・装備数値表v1§2.19の該当記述（「値が高いほど良い」という説明、GALUTH/MAGEN/KIBBUTZ/KOVAの「ペナルティ」表記）を全て訂正済み。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#272：観測・通信装備（TZOFEH/KESHER）とステルス装備（NISTAR/MISTOR/MAGENシリーズ）を新設、既存装備にステルス性補正を追加](/decisions/decision-0272.md)
- 同じ出典の次項: [確定#274：TZOFEH/KESHERによる観測行為はステルス性の露見条件から除外すると確定](/decisions/decision-0274.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#273`
