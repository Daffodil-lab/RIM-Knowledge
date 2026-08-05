---
type: "Decision Log Entry"
title: "確定#334：コア必須要件をTower Ledger統合工業システム全体の一般原則として明記（§13.6固有のルールではない）"
description: "コア必須要件をTower Ledger統合工業システム全体の一般原則として明記（§13.6固有のルールではない）を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0334"
canonical_scope: "decision-history"
source_section: "確定#334"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#334：コア必須要件をTower Ledger統合工業システム全体の一般原則として明記（§13.6固有のルールではない）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13冒頭]

ユーザー指示「当然のことですがTower Ledger統合工業システムを稼働にもエンドフィールドでいう協約核心がメイン拠点にサブ協約核心は遠隔拠点に必要です。」を受け、確定#333で§13.6（遠隔拠点）限定の記述としていたコア必須要件を、**§13全体（Tower Ledger統合工業システムそのもの）に適用される一般原則**として§13冒頭へ格上げ：

- **メイン拠点にはNexus Core（`RIM/docs/07`）が必要**——中継塔（§13.1）・3Dプリンター等の設備・cell/CVE経済全般は、Nexus Coreが存在しない限り機能しない。
- **遠隔拠点（§13.6）にはNexusサブコア（確定#333）が必要**——同様に、Nexusサブコアなしでは遠隔拠点の各設備は機能しない。
- `シオン/Shion_地場_仕様書_v1.md`§13冒頭（統合方針・統合の理由の直後）へ「コア必須要件（一般原則・確定#334）」として新規追加。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#333：遠隔拠点にコア設置を必須化——メイン拠点はNexus Core、遠隔拠点は専用の「Nexusサブコア」（旧称：第二コア）が必要](/decisions/decision-0333-確定-遠隔拠点にコア設置を必須化-メイン拠点は-遠隔拠点は専用の.md)
- 同じ出典の次項: [確定#335：抽象的資源の3枠目「影響力」を廃し、確定#313で既に導入済みの「名声」へ統合](/decisions/decision-0335-確定-抽象的資源の-枠目-影響力-を廃し-確定-で既に導入済みの.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#334`
