---
type: "Decision Log Entry"
title: "確定#167：任意付与特性プールの拡張"
description: "履歴項目であり、また現行仕様との競合時は、正史コアと現在の仕様概念を優先してくださいを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0167"
canonical_scope: "decision-history"
source_section: "確定#167"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#167：任意付与特性プールの拡張

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_コンセプト設計書_v2.md 本文 §6（特性）]
**任意付与特性プール（確定#167・2026-07-04・ユーザー指示「特性システムを実用的な数まで増やそう」／[Stellaris種族特性ページ](https://wikiwiki.jp/stellaris/種族)を参考に拡張／実装＝§15-D インプラント・Hediff）：**

| 再生部品規格 | 2 | 技師修理コスト（確定#166）−20% | 高品質規格 |
| 量産最適化 | 2 | 技師修理速度（確定#166）+15% | 特注製部品 |

負特性（任意付与するとpt獲得＝確定#53④の弱点負債トレード）：

| 特注製部品 | −1 | 技師修理速度（確定#166）−15% | 量産最適化 |
| 高品質規格 | −2 | 技師修理コスト（確定#166）+20%（Stellaris「高品質」＝製造コスト増なのにマイナス特性という捻りを継承） | 再生部品規格 |
| 遅い仕事 | −1 | `WorkSpeedGlobal`−5%（確定#81の+5〜+10限定スタッカブル版とは別枠の汎用版） | — |

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#166：体力システムの機械化（冷媒漏出・技師修理）](/decisions/decision-0166.md)
- 同じ出典の次項: [確定#168：任意付与特性プールに正13種・負14種を追加（正35：負26の構成に調整）](/decisions/decision-0168.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#167`
