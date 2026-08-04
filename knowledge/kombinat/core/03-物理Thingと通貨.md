---
type: "Implementation Specification"
title: "3. 物理Thingと通貨"
description: "物理材料、工業資源、食料、薬品、武器、防具、固有品は実在するRimWorld ThingDef／Thingである。"
tags:
  - "kombinat"
  - "implementation"
  - "matter-network"
  - "equipment"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "kombinat/core/03-物理Thingと通貨"
canonical_scope: "kombinat-component-boundary"
content_layer: "implementation"
normative_basis:
  - "/world/33-代表工業資源.md"
  - "/world/39-同盟通貨.md"
  - "/design/38-代表工業資源の実装境界.md"
  - "/world/41-エネルギー結晶.md"
source_section: "3. 物理Thingと通貨"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_実装仕様書_v4.md"
    title: "Shion Race: Core — Kombinat実装仕様書 v4"
---

# 3. 物理Thingと通貨

物理材料、工業資源、食料、薬品、武器、防具、固有品は実在するRimWorld `ThingDef`／`Thing`である。Kombinat独自の抽象資源残高へ変換しない。Coreの五つの代表工業資源は、[代表工業資源](/world/33-代表工業資源.md)が所有するCell、エネルギー結晶、構造材、保守資材、弾薬結晶とする。

α版から材料、中間品、完成品の保管をCore独自保管・接続システムに一元化する。Kombinatは実Thingを保持せず、進行中Jobが参照する入力予約、出力予定、Operation IDだけを持つ。台帳表示はStorageの実在庫と予約を集計する。

[同盟通貨](/world/39-同盟通貨.md)だけを非物理的な`Currency Account`としてKombinatが実装する。

通貨は次を持つ。

- accountId
- owner
- scope
- balance
- status
- transaction historyの有限要約
- initialization profile

通貨を通常Recipeから生産しない。物理証票との交換を実装する場合は、証票の受領と残高変更を一つの冪等Transactionへ結び付ける。

## 関連項目

- 上位索引: [kombinat/core](/kombinat/core/index.md)
- 同じ出典の前項: [2. 状態分類](/kombinat/core/02-状態分類.md)
- 同じ出典の次項: [4. Kombinat追加層の中核型](/kombinat/core/04-Kombinat追加層の中核型.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)
- 設定所有者: [代表工業資源](/world/33-代表工業資源.md)
- 設定所有者: [同盟通貨](/world/39-同盟通貨.md)
- 資源実装: [代表工業資源の実装境界](/design/38-代表工業資源の実装境界.md)
- 保管・接続基盤: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- 統合境界: [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)

## 出典

- Shion Race: Core — Kombinat実装仕様書 v4（退役済み原本: `retired-source://project/Kombinat_実装仕様書_v4.md`） — `3. 物理Thingと通貨`
