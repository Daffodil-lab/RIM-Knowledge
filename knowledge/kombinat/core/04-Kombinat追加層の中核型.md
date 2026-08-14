---
type: "Implementation Specification"
title: "4. Kombinat追加層の中核型"
description: "KombinatはCore独自保管・接続システムに属する保管基盤型を再実装しない。"
tags:
  - "kombinat"
  - "implementation"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "kombinat/core/04-Kombinat追加層の中核型"
canonical_scope: "kombinat-component-boundary"
source_section: "4. Kombinat追加層の中核型"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_実装仕様書_v4.md"
    title: "Shion Race: Core — Kombinat実装仕様書 v4"
---

# 4. Kombinat追加層の中核型

| 型 | 責務 |
|---|---|
| `ProductionRequest` | 出力、数量または目標在庫、優先度、期限、出力先 |
| `ProductionPattern` | 入力、出力、副産物、設備、作業、電力、version |
| `ProductionPlan` | Recipe依存、不足、予定Batch、概算時間 |
| `ProductionJob` | 承認済みPlanの実行正本 |
| `ProductionBatch` | 一設備へ渡す入力と期待出力の原子的単位 |
| `FacilityProfile` | 対応Pattern、処理間隔、速度、設備能力 |
| `FactoryFacility` | Facility ID、電力、健全性、割当、進捗、取消能力 |
| `StorageProductionReservation` | 入力Thing ID・数量と出力容量の原子的予約 |
| `OutputClaim` | BatchとStorageへCommitした実Thingの対応 |
| `ConsumptionRecord` | Kombinatが観測できた消費eventの有限集計 |
| `DistributionGoal` | Kombinat Factoryまたは公開接続面に対する目標量 |
| `AllianceCreditAccount` | 能力、実績、制度的信用に基づく同盟資源・権限の利用可能量と予約量 |
| `FinancialLedger` | Scenario固有のカエルムMark、債務、租税をCreditから分離した台帳 |
| `Transaction` | Credit認定・使用、Mark決済、債務返済、租税納付、Thing受渡しの原子的かつ冪等な変更 |

Core独自保管・接続システムのStorage、Network graph、検索索引、保存RecordをKombinatへ複製せず、公開Application境界から利用する。

## 関連項目

- 上位索引: [kombinat/core](/kombinat/core/index.md)
- 同じ出典の前項: [3. 物理Thingと通貨](/kombinat/core/03-物理Thingと通貨.md)
- 同じ出典の次項: [5. 発注と多段生産](/kombinat/core/05-発注と多段生産.md)
- 正規保管仕様: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- 統合境界: [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)

## 出典

- Shion Race: Core — Kombinat実装仕様書 v4（退役済み原本: `retired-source://project/Kombinat_実装仕様書_v4.md`） — `4. Kombinat追加層の中核型`
