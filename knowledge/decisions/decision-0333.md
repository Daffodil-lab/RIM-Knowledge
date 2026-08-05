---
type: "Decision Log Entry"
title: "確定#333：遠隔拠点にコア設置を必須化——メイン拠点はNexus Core、遠隔拠点は専用の「Nexusサブコア」（旧称：第二コア）が必要"
description: "遠隔拠点にコア設置を必須化——メイン拠点はNexus Core、遠隔拠点は専用の「Nexusサブコア」（旧称：第二コア）が必要を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0333"
canonical_scope: "decision-history"
source_section: "確定#333"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#333：遠隔拠点にコア設置を必須化——メイン拠点はNexus Core、遠隔拠点は専用の「Nexusサブコア」（旧称：第二コア）が必要

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.6]

ユーザー指示「あとエンドフィールドでいう協約核心がメイン拠点にサブ協約核心は遠隔拠点に必要です。（Nexusメインコアが協約核心、サブ協約核心の機能も持つが第二コアの機能以外では使わないNexusサブコア）」を受け、以下を確定：

- Endfieldの「協約核心」（メイン拠点必須のハブ）＋「サブ協約核心」（各拠点必須のハブ）という二層のハブ構造を参考に、本MODでも同様の必須要件を採用。
- **メイン拠点にはNexus Core（既存の中枢核、`RIM/docs/07`）が必要**——既存のNexus Core機能に加えて、「協約核心」的なネットワークアンカー役も兼ねる。
- **遠隔拠点（§13.6）には「Nexusサブコア」という別建造物が必要**——確定#328・#329で「第二コア」と呼んでいたものを正式に「Nexusサブコア」と改称。Nexusサブコアは第二コア機能（本拠点消滅時の再出発拠点機能等）専用の限定的な建造物であり、メインのNexus Coreが持つそれ以外の機能（Worker Terminal管理・Mercy Connection等）は持たない。遠隔拠点はNexusサブコアなしでは成立しない。
- `シオン/Shion_地場_仕様書_v1.md`§13.6の「第二コア」表記を全て「Nexusサブコア」へ改称し、コア必須要件の説明を追加。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#332：Recommendations項目6「リセット型進行」は本MODに非該当と結論——AIC設計分析レポートの全6項目が§13.1〜13.9として出揃う](/decisions/decision-0332.md)
- 同じ出典の次項: [確定#334：コア必須要件をTower Ledger統合工業システム全体の一般原則として明記（§13.6固有のルールではない）](/decisions/decision-0334.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#333`
