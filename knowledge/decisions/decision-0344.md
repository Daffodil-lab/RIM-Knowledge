---
type: "Decision Log Entry"
title: "確定#344：Tower Ledger／Nexus Core等の用語をA系統（Kombinat）／B系統（The Hive）で改称"
description: "Tower Ledger／Nexus Core等の用語をA系統（Kombinat）／B系統（The Hive）で改称を確定した決定履歴。"
tags:
  - "decision-log"
  - "kombinat"
  - "the-hive"
organization_groups:
  - "kombinat-communities"
  - "the-hive"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0344"
canonical_scope: "decision-history"
source_section: "確定#344"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#344：Tower Ledger／Nexus Core等の用語をA系統（Kombinat）／B系統（The Hive）で改称

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: ユーザー「Tower LedgerとTower Ledger統合工業システムとコアと記録台帳・規模の記録層等の名前を変えよう」→AskUserQuestionで「AIモデル側に複数系統の案を出してほしい」を選択→ユーザー「Shion Race: KombinatはA系統とShion Race: The HiveはB系統」→AskUserQuestionで「同一機能の呼び方違い（推奨）」を選択して確定]

Госплан統合工業システム（旧称：Tower Ledger統合工業システム）を構成する主要用語を、以下のとおり改称する。実体は単一のシステムであり（確定#305の単一システム統合方針に変更なし）、**呼び方がMODごとのフレーバーとして異なるだけ**——Shion Race: Kombinat側の基本語彙を「A系統」（ソ連行政/計画経済風）、Shion Race: The Hive側の基本語彙を「B系統」（ヘブライ語・秘文字/ソフェル系）とする。

| 旧称 | A系統（Shion Race: Kombinat） | B系統（Shion Race: The Hive） |
|---|---|---|
| Tower Ledger（記録台帳・規模の記録層） | **Учёт**（ウチョート） | **Sefer**（セフェル） |
| Tower Ledger統合工業システム | **Госплан**（ゴスプラン） | **Heichal**（ヘイハル） |
| Nexus Core／コア | **Штаб**（シタープ） | **Aron**（アロン） |
| Nexusサブコア | **Филиал**（フィリアル） | **Mishkan**（ミシュカン） |

「Госплан」は実在したソ連の国家計画委員会（Государственный плановый комитет）に由来。B系統はМeiko Race: The Hiveの秘文字・ソフェル関連lore（確定#323等）と語感を揃えたヘブライ語/タルムード系命名。

改称を反映した資料：
- `シオン/Shion_Kombinat_仕様書_v1.md`——§13冒頭に「用語の改称（確定#344）」の説明を追加。§13.1〜13.9本文中のTower Ledger／Nexus Core／Nexusサブコア／コア／記録台帳・規模の記録層をУчёt／Госплан／Штаб／Филиалへ全面置換（A系統を基本語彙として使用）。ただし一般的な日本語の「台帳」（例：台帳スカラー方式・台帳建築）は固有名詞ではないため対象外。`RIM/docs/*.md`のファイル名・AddCVE等のAPI識別子・レビューコメントの原文引用は改称対象外のまま維持。
- `シオン/Shion_コンセプト設計書_v2.md`——§17「Shion Race: The Hive」節の見出し・核メカニクス・資源経済・水仙との関係の各記述をB系統語彙（Aron／Sefer／Heichal）へ更新し、A系統/B系統の対応関係を説明する新規箇条書き「用語の系統分離（確定#344）」を追加。
- `シオン/Shion_実装計画書_v1.md`——MOD一覧表のShion Race: Kombinat行・Shion Race: The Hive行のTower Ledger関連記述を更新。
- `アークナイツ_エンドフィールドAIC設計分析レポート_v1.md`——資料区分の説明文中のTower Ledger表記を更新。

`RIM/docs/`配下の英語設計文書群（37ファイル）は、ハイブが独自MODだった時点の設計であり本MODへの統合に伴い今後大きく書き換わる予定のため、本改称の対象外のまま保持する（Kombinat仕様書§13に既存の記載どおり）。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#343：同盟のサイキック技術は精神への直接干渉より物理的な力への変換を得意とする（秘文字含む）](/decisions/decision-0343.md)
- 同じ出典の次項: [確定#345：同盟の正式条約名＝クピナー条約機構](/decisions/decision-0345.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#344`
