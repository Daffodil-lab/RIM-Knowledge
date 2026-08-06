---
type: "Decision Log Entry"
title: "確定#261：装備数値表v1・銃搭載バイポットによる展開システムを検討開始（未実装）"
description: "装備数値表v1・銃搭載バイポットによる展開システムを検討開始（未実装）を確定した決定履歴。"
tags:
  - "decision-log"
  - "equipment"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0261"
canonical_scope: "decision-history"
source_section: "確定#261"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#261：装備数値表v1・銃搭載バイポットによる展開システムを検討開始（未実装）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §4]
Claude壁打ちセッション（2026-07-06）にて、「RimWorldの戦闘＝歩兵の戦争」というイメージのもと、RG-6620（重レールガン対物）・CM-4410（チャージ式機関銃）等の重量級火器を対象候補に、武器自体にバイポット機能が内蔵され、静止して1〜2秒の展開動作を経るとwarmupTime短縮・命中/反動安定のボーナスを得る（移動すると自動的に未展開状態へ戻る）という方向性を確認した。FFF（Fortified Features Framework）の「Deployable Item」機能が使えるか要検証（バランス基準書S11で存在未確認と記載済み）——使えない場合は「静止tick数を監視→一定時間経過でstatOffsetのHediff付与→移動検知で即解除」という薄いカスタムComp（vanilla-first方針の中の意図的な薄DLL例外）で代替する。対象武器・具体的な数値はPhase9で確定する未実装の検討事項として装備数値表v1§4に記録した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#260：バランス基準書v1の既存懸念5件は設計意図と確認、CoreMOD資料v1§4の任意pt記述を訂正](/decisions/decision-0260.md)
- 同じ出典の次項: [確定#262：装備数値表v1・迫撃砲の梱包/展開運用をFFF Deployable Itemで確定、「野戦簡易型」新設は撤回](/decisions/decision-0262.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#261`
