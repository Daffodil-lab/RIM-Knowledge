---
type: "Gameplay Specification"
title: "17. Field Workshopのαコンテンツ"
description: "Core独自Storageと、Kombinat追加層の発注・多段生産・消費・流通・通貨、独立開拓団用の代表的な三段閉路を同じα公開候補で完成させる。"
tags:
  - "shion"
  - "independent-colony"
  - "gameplay"
  - "kombinat"
  - "pawn"
  - "equipment"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "colony/17-Field-Workshopのαコンテンツ"
canonical_scope: "independent-colony"
content_layer: "implementation"
normative_basis:
  - "/design/40-Field-Workshop設定クラス.md"
  - "/world/33-代表工業資源.md"
source_section: "17. Field Workshopのαコンテンツ"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md"
    title: "Shion Race: Core — 独立開拓団 設定・実装仕様 v1"
---

# 17. Field Workshopのαコンテンツ

## 17.1 最小閉路

Core独自Storageと、Kombinat追加層の発注・多段生産・消費・流通・通貨、独立開拓団用の代表的な三段閉路を同じα公開候補で完成させる。自動生産は通常Map空間や工場内在庫を中間経路にせず、Storage上で入力と出力容量を予約して直接Commitする。

```text
保守資材または構造材の実Thingを予約
  → Pawnまたは設備が作業を供給
  → 入力をcommit
  → 一つの実Thing出力を生成
```

Recipeは、独立開拓団の生活に直結するものを優先する。

候補:

- 現地食材から、動物、来訪者、救援、交易向けの栄養備蓄
- 現地資材から規格構造材
- 構造材とCellから修理部材

武器量産を最初のα生産コンテンツにしない。

## 17.2 失敗処理

- 資源不足: 予約を作らず理由を表示。
- 停電: 予約を保持してSuspend。
- 取消: 未commit予約をrelease。
- 建物破壊: 未commit予約をrelease。
- 出力満杯: commit前に待機。
- セーブ／ロード: 入力と出力を二重処理しない。

---

## 関連項目

- 上位索引: [colony](/colony/index.md)
- 同じ出典の前項: [16. Field Ledger Terminal](/colony/16-Field-Ledger-Terminal-工業管制塔.md)
- 同じ出典の次項: [18. 独立状態のUI](/colony/18-独立状態のUI.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 正規保管仕様: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)
- シオンの身体: [シオンの無性機械身体](/world/29-シオンの無性機械身体.md)
- 設定所有者: [Field Workshop設定クラス](/design/40-Field-Workshop設定クラス.md)
- 資源設定: [代表工業資源](/world/33-代表工業資源.md)
- 資源実装境界: [代表工業資源の実装境界](/design/38-代表工業資源の実装境界.md)

## 出典

- Shion Race: Core — 独立開拓団 設定・実装仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md`） — `17. Field Workshopのαコンテンツ`
