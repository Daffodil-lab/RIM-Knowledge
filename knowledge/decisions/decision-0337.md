---
type: "Decision Log Entry"
title: "確定#337：今回の開発目的をMVP（最小実行可能製品）までと明記（対象：Tower Ledger統合工業システム§13）"
description: "今回の開発目的をMVP（最小実行可能製品）までと明記（対象：Tower Ledger統合工業システム§13）を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0337"
canonical_scope: "decision-history"
source_section: "確定#337"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#337：今回の開発目的をMVP（最小実行可能製品）までと明記（対象：Tower Ledger統合工業システム§13）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md §13]

ユーザー指示：

> あと今回の開発の目的はMVP（最小実行可能製品）までを指定して

AskUserQuestionで対象範囲を確認したところ、回答は「Tower Ledger統合工業システム（§13）のみ」——Shion Race: 地場MOD全体やシオン/Shionプロジェクト全体ではなく、今セッションで設計してきたTower Ledger統合工業システム（§13）に限定してMVP目標を明記する。

- §13冒頭に新規箇条書き「**開発目標（現フェーズのスコープ・確定#337）**」を追加。
- 確定#309〜#336で確定済みの各メカニクス（§13.1〜§13.8＋確定#336のコア入手経路）が**MVPの機能範囲**を構成すると明記。
- 各節末尾の「未確定（Phase設計課題）」に列挙された具体的数値・詳細API設計は、MVP版では簡易な仮値・最小実装で足りるものとし、精密なバランス調整・追加メカニクスの深掘りはMVP後の拡張フェーズへ回す方針を明記。
- 戦略資源・特殊素材の本格実装（§13.2「後回し」）、ブループリント機能（§13.7で非実装と確定済み）等、本文中で既にMVP範囲外・非実装と明記済みの要素は、そのままMVP対象外として扱うことを明記。
- §13見出しに確定#337を追記。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#336：新規コア（Nexus Core／Nexusサブコア）はプレイヤーが直接製造できず、回収または名声購入で入手する](/decisions/decision-0336.md)
- 同じ出典の次項: [確定#338：仮称MOD名2件を文学作品名へ正式化——「スローターハウス5」「月を売った男」](/decisions/decision-0338.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#337`
