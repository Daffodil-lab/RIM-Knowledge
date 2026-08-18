---
type: "Decision Log Entry"
title: "確定#309：Tower Ledger統合工業システムの詳細設計を「アークナイツ:エンドフィールドAIC設計分析レポート」のRecommendationsに沿って1項目ずつ確定する方針を採用——第1項目「中継塔（統合物流ノード）」を確定"
description: "Tower Ledger統合工業システムの詳細設計を「アークナイツ:エンドフィールドAIC設計分析レポート」のRecommendationsに沿って1項目ずつ確定する方針を採用——第1項目「中継塔（統合物流ノード）」を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0309"
canonical_scope: "decision-history"
source_section: "確定#309"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#309：Tower Ledger統合工業システムの詳細設計を「アークナイツ:エンドフィールドAIC設計分析レポート」のRecommendationsに沿って1項目ずつ確定する方針を採用——第1項目「中継塔（統合物流ノード）」を確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.1／アークナイツ_エンドフィールドAIC設計分析レポート_v1.md Recommendations／RIM/docs/07・14・19・35]

ユーザー指示「Tower Ledgerのシステムをやや変えますアークナイツ_エンドフィールドの集成工業システム或いはAICを参考に仕様を調整します一個一個やりましょう」を受け、レポートのRecommendations（6項目）を1つずつ順に確定していく進め方を採用。

第1項目「固定スループット＋詰まり可視化」について、ユーザー指示「流通システムはしばしば簡略化したいと思っています取り敢えずはエンドフィールドに於ける送電スタンドに輸送制限（送電スタンド/中継タワーに電力だけでなく物資の輸送機能を持つ代わりに輸送上限を設けるその輸送上限は研究とアップグレード出来るで上げれるように）を設けて」を受け、以下を確定：

- **中継塔（統合物流ノード）を新設**：エンドフィールドのRelay Tower（電力延伸）＋Electric Pylon（範囲内無線給電）の二層構造を参考にしつつ、Tower Ledgerの「流通は簡略化する」方針に合わせ**単一の建造物へ統合**——CVE（濃縮真空エネルギー）とcellの両方を同じ塔で中継する（電力用・物資用で塔を分けない）。
- **輸送上限（固定スループット）**：中継塔1基あたりCVE・cellそれぞれに固定の輸送上限を設け、需要が上限を超えると詰まり（clog）として可視化する。経路探索・動的帯域計算は行わない単純な固定値方式。
- **拡張性**：輸送上限は固定ではなく、**研究およびアップグレードで引き上げ可能**とする。
- **実装方針**：`RIM/docs/35`§3のLogistics Node（機能実装済みの範囲中継）を土台に、輸送上限フィールドを追加。台帳スカラー方式（TrySpend/TryReserve型API）へ「経路上のノード輸送上限チェック」を挟む形で実装し、`RIM/docs/19`§10の性能ルール（経路探索なし・アイテム運搬なし・毎tickなし）を維持する。
- `シオン/Shion_地場_仕様書_v1.md`§13へ新設「### 13.1 中継塔（統合物流ノード・確定#309）」として記録。以降、レポートのRecommendations各項目を§13.2以降へ順次追加していく。
- **未確定（Phase設計課題）として明記**：初期輸送上限の具体的な数値、CVE用とcell用で上限を分けるか共通枠にするか、研究/アップグレードでの引き上げ幅・段階数、中継塔の設置コスト・射程・設置間隔、詰まり発生時のゲームプレイ上のペナルティの有無。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#308：確定#307の放棄範囲を修正——3Dプリンター・液体装薬注入機はTower Ledger統合工業の設備として存続、cell/CVEは台帳スカラー方式に統一、PAC/パイプライン系は独立システムとして廃止](/decisions/decision-0308.md)
- 同じ出典の次項: [確定#310：Tower Ledger統合工業システムの基礎資源をCVE・デジタル資材・労務資本・Cellの4種へ絞り込み（ステラリスの資源体系を参考）——戦略資源・特殊素材は後回し](/decisions/decision-0310.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#309`
