---
type: "Decision Log Entry"
title: "確定#190：技師修理の資源コスト計算式を確定（生産コスト×欠損率÷2、欠損率は死体欠損から算出）"
description: "技師修理の資源コスト計算式を確定（生産コスト×欠損率÷2、欠損率は死体欠損から算出）を確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0190"
canonical_scope: "decision-history"
source_section: "確定#190"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#190：技師修理の資源コスト計算式を確定（生産コスト×欠損率÷2、欠損率は死体欠損から算出）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §5・シオン/Shion_バランス基準書_v1.md C82]
ユーザー指示「技師修理の重症度係数/資源コスト、生産コスト×欠損率割る２　欠損率は可能であれば死体の欠損から計算」を受け、確定#166が残していた技師修理の具体的コスト計算を解決した。**資源コスト＝生産コスト×欠損率÷2**。欠損率は固定値ではなく、可能であれば死体（corpse）の実際の欠損状態から動的に算出する——個体ごとに実際に失われている身体部位の割合を反映する設計。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#189：有機機械限定特性リストは現状で十分と確定（「非機械であること」で足りる）](/decisions/decision-0189.md)
- 同じ出典の次項: [確定#191：有機機械側のスタッカブル重ね掛け上限は基本的に10〜50の範囲と確定](/decisions/decision-0191.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#190`
