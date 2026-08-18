---
type: "Decision Log Entry"
title: "確定#306：「Shion Race: 無零花」を「Shion Race: 地場」へ改称し、正式な仕様書シオン/Shion_地場_仕様書_v1.mdを新設——§12全内容をCoreMOD資料から物理移設"
description: "「Shion Race: 無零花」を「Shion Race: 地場」へ改称し、正式な仕様書シオン/Shion地場仕様書v1.mdを新設——§12全内容をCoreMOD資料から物理移設を確定した決定履歴。"
tags:
  - "decision-log"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0306"
canonical_scope: "decision-history"
source_section: "確定#306"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#306：「Shion Race: 無零花」を「Shion Race: 地場」へ改称し、正式な仕様書シオン/Shion_地場_仕様書_v1.mdを新設——§12全内容をCoreMOD資料から物理移設

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md（新設）／シオン/Shion_実装計画書_v1.md「MODファミリー一覧」／シオン/Shion_コンセプト設計書_v2.md§17／シオン/Shion_CoreMOD資料_v1.md§12]

ユーザー指示「えーとShion Race: 無零花（名前は変えてね）の正確な仕様書は何処に？」を受け、以下を確定：

- **MOD名称を「Shion Race: 無零花」から「Shion Race: 地場」へ改称**——「無零花」は既存の特定植物（§12.4）の固有名でもあり、MOD名として使うと混同を招くため変更。「地場濃度」「ゼロ点エネルギー地場システム」という中核用語に直結する「地場」を新名称に採用（仮称・変更可）。
- **正確な仕様書として新規ファイル`シオン/Shion_地場_仕様書_v1.md`を新設**——従来`シオン/Shion_CoreMOD資料_v1.md`§12に直接記載されていたゼロ点エネルギー地場システムの全内容（§12.1〜12.13：地場濃度ゲージ・真空相転移インシデント・無零花〔植物〕・発電機/真空濃縮器/備蓄装置/濃縮真空エネルギー・cell・パイプライン関連設備・植物工場・3Dプリンター・液体装薬注入機）を、**節番号を維持したまま本ファイルへ物理的に移設**した。CoreMOD資料v1§12は移設先を示す短い注記のみを残すスタブへ縮小。
- **Tower Ledger統合（確定#305）の記録も本仕様書に新設§13として追加**——現状「大幅改変予定・仕様未確定」であることを明記し、`RIM/docs/`の分身側ドラフトおよびアークナイツ:エンドフィールドAIC設計分析レポート（確定#303）を参照先として記録。
- 実装計画書「MODファミリー一覧」・コンセプト設計書§17「分身」内の「Shion Race: 無零花」表記を全て「Shion Race: 地場」へ更新し、いずれも本仕様書ファイルへのポインタを追加。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#305：分身固有の工業メカニクス（Tower Ledger等）をShion Race: 無零花の単一工業システムへ統合——Shion Race: 無零花は大幅な改変を予定](/decisions/decision-0305.md)
- 同じ出典の次項: [確定#307：シオン/Shion_地場_仕様書_v1.md§12（旧12.1〜12.13：地場濃度ゲージ・無零花・発電機・濃縮真空エネルギー・cell・パイプライン設備・3Dプリンター・液体装薬注入機、全て）を原則放棄し、Tower Ledger統合工業システム（§13）へ全面統合](/decisions/decision-0307.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#306`
