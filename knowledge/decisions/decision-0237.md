---
type: "Decision Log Entry"
title: "確定#237：ユニット設計ダイアログに「設計ドクトリン」を新設——②③④タブの推奨値を一括提案する、Tier/特性/温度帯を横断する目的・方法論ベースの指針"
description: "ユニット設計ダイアログに「設計ドクトリン」を新設——②③④タブの推奨値を一括提案する、Tier/特性/温度帯を横断する目的・方法論ベースの指針を確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0237"
canonical_scope: "decision-history"
source_section: "確定#237"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#237：ユニット設計ダイアログに「設計ドクトリン」を新設——②③④タブの推奨値を一括提案する、Tier/特性/温度帯を横断する目的・方法論ベースの指針

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §7.1、シオン/Shion_コンセプト設計書_v2.md §11]
ユーザー指示「ユニット設計に関する更なる拡張　ドクトリンの実装（Hoi4参考）」を受け、AskUserQuestionで方式を確認したところ、Hoi4の国家教義のような排他選択制のツリーではなく「ユニット設計に関する設計時、どの様な目的用途のために様々な方法論を用いて何らかの目的用途を達成するユニット設計ドクトリン」という回答を得た。これに基づき、既存の②身体部位ロードアウト「推奨プリセット」（汎用型／耐久型／機動型／精密型の4種、CoreMOD資料v1§7既存機能）を、Tier傾向・特性バイアス・想定運用温度帯まで横断する「設計ドクトリン」へ拡張。新設ドクトリンは汎用・量産・精鋭・耐久・機動・精密の6種（量産・精鋭はTier軸を新たにカバーする新設分、他4種は既存プリセットの拡張）。いずれも同盟本国の国家教義のような排他選択・恒久固定ではなく、個体ごとに使い分けてよい設計時の一括提案に留める——選択すると②③④タブの推奨値が自動入力されるが、以後の手動編集は自由。CoreMOD資料v1§7.1に新設、コンセプト設計書v2§11「独自開拓団」ブロックに要点を追記。具体的な自動入力ロジック・各ドクトリンの閾値はPhase9で確定。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#236：CoreMOD§12.6「ゼロ点エネルギー地場備蓄装置」の具体数値を10倍に引き上げ——最大貯蔵量200%相当→2000%相当、自動吸収・放出速度20%/日→200%/日](/decisions/decision-0236.md)
- 同じ出典の次項: [確定#238：CoreMODの「職級を持たない汎用個体」に、職級より緩く効果も小さい「任務」ラベルを新設——⑤識別・命名タブで役割を自己申告できる仕組み](/decisions/decision-0238.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#237`
