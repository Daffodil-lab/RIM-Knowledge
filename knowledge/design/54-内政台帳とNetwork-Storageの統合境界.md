---
type: "Implementation Specification"
title: "内政台帳とNetwork Storageの統合境界"
description: "内政管理、Core独自Network Storage、Kombinat生産を一つの需給台帳へ統合し、工場を在庫を持たない設備能力として実装する。"
tags:
  - "shion"
  - "design"
  - "kombinat"
  - "storage"
  - "administration"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/domestic-ledger-network-storage-integration"
canonical_scope: "product-architecture"
content_layer: "implementation"
generated:
  by: "process:codex-design-draft"
  at: "2026-07-31T00:00:00Z"
  precision: "date"
---

# 内政台帳とNetwork Storageの統合境界

内政台帳は、共同体の在庫、発注、生産能力、設備、物流方針、通貨、契約を一つの管理面から操作する。Core独自Network Storageは現地に存在する物理Thingを所有し、Kombinatは需要、予約、工程、設備能力、取引履歴を所有する。統合は画面とApplication層で行い、同じ在庫を二つの台帳へ複製しない。

## 所有

| 対象 | 所有者 | 保存単位 |
| --- | --- | --- |
| 現地の材料、中間品、完成品 | Core独自Network Storageの`ThingOwner` | Thing単位 |
| 利用可能数と予約済み数の索引 | Core Storageから再構築する派生索引 | Def・Network単位 |
| 発注、依存計画、Job、Batch、優先度 | `WorldComponent_KombinatLedger` | 安定IDを持つRecord |
| 通貨、契約、支払、返金 | Kombinat AccountとTransaction | 冪等Operation単位 |
| Map上の工場能力 | 工場CompとLedger上の施設Record | Facility ID単位 |
| 画面上の集計 | 読み取り専用View Model | dirty eventごとに更新 |

物理Thingは常に一つの`ThingOwner`へ属する。内政台帳の数量表示はNetwork Storageの実在庫とKombinatの予約を集計した表示であり、別の資源残高ではない。

## 無バッファ工場

Kombinat Factoryは材料や完成品を保管しない処理設備である。工場は次の状態だけを持つ。

- Facility ID
- 対応Patternと工程能力
- 稼働速度、電力、健全性、接続状態
- 割り当てられたJob ID
- 現在工程、進捗、停止理由

工場は常設Input Buffer、Output Buffer、搬送ベルト、床上の中継在庫を持たない。材料、中間品、完成品は全て接続先Network Storageへ置かれる。中間品を実Thingとして残す工程では、完成した中間品をNetwork Storageへ直接生成し、同じ親Requestの次工程が直ちに予約する。

## 生産Transaction

生産は次の順序で進む。

1. Plannerが目標品、数量、優先度、納入先Networkを確定する。
2. Core Storageが入力ThingをThing IDと数量で予約する。
3. 納入先Storageが完成品の予定容量を予約する。
4. 利用可能な工場能力をFacility IDで割り当てる。
5. 電力、接続、入力予約、出力容量予約が揃った時だけ工程を開始する。
6. 工程完了時に、入力Thingの消費と出力Thingの生成を一つの冪等Commitとして実行する。
7. 出力Thingは指定Network Storageへ直接入り、予約容量を実在庫へ置き換える。
8. 次工程がある場合、生成した中間品を同じRequestへ予約する。

開始前の失敗はThing総量を変えない。Commitが完了した後の再送は保存済み結果を返し、入力を二重消費せず、出力を二重生成しない。

## 状態

```text
Draft
→ Planned
→ InputReserved
→ OutputCapacityReserved
→ Assigned
→ Processing
→ Committing
→ Completed

一時停止: MaterialWaiting / CapacityWaiting / NoPower / Disconnected / Suspended
終端: Cancelled / Failed
```

取消は未Commitの入力予約、出力容量予約、通貨予約、工場割当を同じOperationで解放する。処理中に工場が破壊された場合も、Network Storage内のThingは失われず、Jobだけが停止または再割当される。

## 統合管理画面

管理画面は次のタブを持つ。

1. **概要**: 共同体の収支、警告、滞留、供給不足
2. **在庫**: 実在庫、予約済み、利用可能、輸送中、予定容量
3. **生産**: 目標在庫、発注、依存工程、Job、Batch
4. **設備**: Map上と台帳上のFacility、能力、稼働率、故障、保守
5. **物流**: Network、納入先、輸送、滞留、優先度
6. **財務**: 通貨、契約、購入、売却、維持費、取引履歴

Map上の工場Gizmoはこの画面の該当Facilityへ移動する。Network Storageの建築Gizmoは同じ画面の該当在庫へ移動する。工場固有のBuffer画面は設けない。

各タブは`KombinatManagementPageDef`が順序、表示名、説明、Icon、`workerClass`を宣言する。管理WindowはDef一覧からPage workerを生成し、固定switchや固定タブ配列を持たない。追加MODはKombinat本体を変更せず、新しいPage Defとworkerを登録できる。

## 失敗結果

- 入力不足: `MaterialWaiting`と不足Def・数量を表示する。
- 容量不足: 入力を消費せず`CapacityWaiting`に留める。
- 停電: 進捗を安全停止し、予約を保持する。
- Network切断: 新しいCommitを禁止し、再接続または再割当を待つ。
- 工場破壊: Facility割当を解除し、未Commitの予約を保持または方針に従って解放する。
- 保存復旧でCommit結果が不明: Operation IDの履歴から完了または未実行を再構築する。

## 性能条件

工場は全Map Thingを走査しない。Network Storageの在庫索引、予約索引、Facility索引をeventとdirty flagで更新する。Plannerは変更されたRequestだけを有界Queueで再計画する。管理画面は表示中の行だけを仮想化し、非表示時に毎tick再集計しない。

## 採用値

α実装はStorageの入力Thing予約、出力容量予約、冪等な生産Commit、予約索引、旧saveの工場Buffer回収を採用する。工場の対応Pattern、処理間隔、速度は`KombinatFacilityProfileDef`、World Accountの初期値は`KombinatLedgerDef`、管理画面の構成は`KombinatManagementPageDef`が所有する。遠隔Facility、Remote Inventory、Transit CargoはローカルStorage契約へ混入させず、別の保護草案として実装待ちにする。

## 関連項目

- [Core独自保管接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- [Core・公式DLC量産カタログ境界](/design/55-Core公式DLC量産カタログ境界.md)
- [発注と多段生産](/kombinat/core/05-発注と多段生産.md)
- [Kombinat UI](/kombinat/core/09-UI-操作画面.md)
- [遠隔物流の保護草案](/research/remote-logistics/index.md)
- [遠征共同体の野心と産業化](/world/27-遠征共同体の野心と産業化.md)
