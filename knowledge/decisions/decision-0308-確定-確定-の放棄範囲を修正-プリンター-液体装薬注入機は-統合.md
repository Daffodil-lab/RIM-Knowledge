---
type: "Decision Log Entry"
title: "確定#308：確定#307の放棄範囲を修正——3Dプリンター・液体装薬注入機はTower Ledger統合工業の設備として存続、cell/CVEは台帳スカラー方式に統一、PAC/パイプライン系は独立システムとして廃止"
description: "確定番号307の放棄範囲を修正——3Dプリンター・液体装薬注入機はTower Ledger統合工業の設備として存続、cell/CVEは台帳スカラー方式に統一、PAC/パイプライン系は独立システムとして廃止を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0308"
canonical_scope: "decision-history"
source_section: "確定#308"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#308：確定#307の放棄範囲を修正——3Dプリンター・液体装薬注入機はTower Ledger統合工業の設備として存続、cell/CVEは台帳スカラー方式に統一、PAC/パイプライン系は独立システムとして廃止

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§12・§13／RIM/docs/07_CONCENTRATED_VACUUM_ENERGY.md／RIM/docs/35_CVE_EXPANSION_ROUND_2_SCOPE.md]

レビューコメント「正しく言うと液体装薬注入機と3Dプリンター等はTower Ledger統合工業の設備の一部として統合される　docsに多くの資料があるはずです」を受け、`RIM/docs/`配下を調査した結果、以下を確認・確定：

- **確定#307の修正**：旧§12.12（3Dプリンター）・旧§12.13（液体装薬注入機）は放棄対象から除外し、**Tower Ledger統合工業システム（§13）の設備として存続**させる。放棄されるのは地場濃度ゲージ・真空相転移インシデント・無零花・ゼロ点エネルギー発電機・地場備蓄装置・植物工場・依存の鎖・パイプライン関連設備（VEF PipeSystem部分）に限る。
- **重大な競合の発見と解消**：`RIM/docs/07_CONCENTRATED_VACUUM_ENERGY.md`・`RIM/docs/35_CVE_EXPANSION_ROUND_2_SCOPE.md`を確認した結果、分身/Shion Nexus側の設計では**cell・濃縮真空エネルギー（CVE）は物理アイテムではなく、Nexus Core局所範囲の「台帳スカラー資源」**（`AddCVE`/`CanSpend`/`TrySpend`/`TryReserve`/`ReleaseReservation`型API、二重消費防止の予約制、VEF PipeSystem・バニラ電力網に非依存）として既に設計されていることが判明——地場仕様書側（VEF PipeSystemによる物理アイテム＋パイプ網方式）と技術的に非互換だった。ユーザーに確認した結果、**台帳スカラー方式（Nexus/docs流）に統一**することを確定。VEF PipeSystemによるcell/CVEのパイプ輸送・タンク・真空濃縮器・ゼロ点エネルギー発電機・地場備蓄装置は放棄。docs/35§1のCell定義（「台帳と物理資源をつなぐ接着剤」）をそのまま採用。
- **PAC/パイプライン系の扱い**：レビューコメント「これらは簡略化のためTower Ledgerに一本化されます要望があればTower Ledgerの拡張で扱うかもしれません」を受け、パイプライン関連設備を独立システムとして維持することを取りやめ、Tower Ledgerの台帳スカラーAPIへ一本化。将来的な需要があればTower Ledgerの拡張機能として検討する可能性のみ残す。
- **3Dプリンター・液体装薬注入機の再設計方針**：稼働方式をパイプ経由の資源消費から、台帳スカラー方式（`TrySpend`/`TryReserve`型API）へ作り替える。旧仕様書の変換レート等の数値は再設計時の参考値として保持。
- **未解決として明記**：Nexus Core 1体を前提とした台帳スカラーモデル（Core局所範囲・単一主体の予約API）を、CoreMOD側の単一Coreを持たない通常の複数ポーンコロニー運用にどう拡張するかは未検討・今後の設計課題。
- `シオン/Shion_地場_仕様書_v1.md`§12（放棄済み注記）・§13（Tower Ledger統合工業システム本文）を上記方針に沿って更新。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#307：シオン/Shion_地場_仕様書_v1.md§12（旧12.1〜12.13：地場濃度ゲージ・無零花・発電機・濃縮真空エネルギー・cell・パイプライン設備・3Dプリンター・液体装薬注入機、全て）を原則放棄し、Tower Ledger統合工業システム（§13）へ全面統合](/decisions/decision-0307-確定-シオン-地場-仕様書-旧-地場濃度ゲージ-無零花-発電機.md)
- 同じ出典の次項: [確定#309：Tower Ledger統合工業システムの詳細設計を「アークナイツ:エンドフィールドAIC設計分析レポート」のRecommendationsに沿って1項目ずつ確定する方針を採用——第1項目「中継塔（統合物流ノード）」を確定](/decisions/decision-0309-確定-統合工業システムの詳細設計を-アークナイツ-エンドフィール.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#308`
