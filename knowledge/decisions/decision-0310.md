---
type: "Decision Log Entry"
title: "確定#310：Tower Ledger統合工業システムの基礎資源をCVE・デジタル資材・労務資本・Cellの4種へ絞り込み（ステラリスの資源体系を参考）——戦略資源・特殊素材は後回し"
description: "Tower Ledger統合工業システムの基礎資源をCVE・デジタル資材・労務資本・Cellの4種へ絞り込み（ステラリスの資源体系を参考）——戦略資源・特殊素材は後回しを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0310"
canonical_scope: "decision-history"
source_section: "確定#310"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#310：Tower Ledger統合工業システムの基礎資源をCVE・デジタル資材・労務資本・Cellの4種へ絞り込み（ステラリスの資源体系を参考）——戦略資源・特殊素材は後回し

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.2／RIM/docs/07・19・35／https://wikiwiki.jp/stellaris/資源]

ユーザー指示「リソース種類を3〜4種に絞る　概ねステラリスの資源を参考にするのがいいでしょう...但し戦略資源と特殊素材は後で実装すること（具体的は後で）」を受け、以下を確定：

- Stellarisの資源体系（基礎的な資源＝エネルギー通貨・鉱物・食料、発展的な資源＝消費財・合金、抽象的な資源＝研究力・統合力・影響力、テクノロジー解禁制の戦略資源＝7種）を参考に、Tower Ledger統合工業システムの基礎資源を絞り込む方針を採用。
- `RIM/docs/07`・`RIM/docs/19`・`RIM/docs/35`で個別に設計されていた**CVE（濃縮真空エネルギー）・デジタル資材・労務資本・Cell**の4資源を、正式に「基礎資源4種」として位置づけ：
  - CVE＝エネルギー通貨に相当する基礎エネルギー資源（台帳スカラー、docs/07）
  - デジタル資材＝鉱物／合金に相当する「構築可能な記録」（現物運搬なし、docs/19§4.2）
  - 労務資本＝POP労働力に近い抽象概念、実体Pawnを介さない作業能力割当（docs/19§4.3）
  - Cell＝台帳と物理資源をつなぐ接着剤（docs/35§1）
- 投影体チャンネル・建築チャンネル（docs/19§4.4・4.5）は消費可能な資源ではなく状態管理チャンネルのため、4種のカウントから除外。
- **戦略資源・特殊素材は今回のスコープ外**：Stellarisの戦略資源（下位3種・上位4種、いずれもテクノロジー解禁制）に相当する上位資源群は、具体的な種類・入手経路・用途を含め後日設計する（ユーザー指示どおり「具体的は後で」）。
- `シオン/Shion_地場_仕様書_v1.md`§13へ「### 13.2 資源体系（基礎資源4種への絞り込み・確定#310）」として新設。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#309：Tower Ledger統合工業システムの詳細設計を「アークナイツ:エンドフィールドAIC設計分析レポート」のRecommendationsに沿って1項目ずつ確定する方針を採用——第1項目「中継塔（統合物流ノード）」を確定](/decisions/decision-0309.md)
- 同じ出典の次項: [確定#311：確定#310のCellの位置づけを修正——Cellは「橋渡し役」に加え、ステラリスの合金（Alloys）に相当する軍事・艦隊関連資源の役割も兼ねる](/decisions/decision-0311.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#310`
