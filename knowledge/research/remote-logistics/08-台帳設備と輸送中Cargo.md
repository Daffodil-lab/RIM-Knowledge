---
type: "Protected Draft"
title: "台帳設備と輸送中Cargo"
description: "Map上の設備、宇宙船、本国施設、契約工場、交易拠点を共通のFacility台帳へ登録し、遠隔資源を時間付きCargoとして現地Network Storageへ届ける設計草案。"
tags:
  - "kombinat"
  - "remote-logistics"
  - "facility"
  - "cargo"
  - "red-star"
  - "protected-draft"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
status: draft
authority: protected-draft
knowledge_role: draft-proposal
granularity: concept
generated:
  by: "process:codex-design-draft"
  at: "2026-07-31"
---

# 台帳設備と輸送中Cargo

施設台帳は、Map上に実体を持つ設備と、World上または契約上に存在する設備を共通のFacility IDで管理する。施設の表示を統合しても、遠隔在庫を現地Network Storageの利用可能在庫へ加算しない。

## Facility種別

| 種別 | 実体 | 主な出力 |
| --- | --- | --- |
| Map Facility | Map上の建築とComp | 現地Network Storageへ直接納入 |
| Mobile Facility | 宇宙船、移動拠点、輸送船 | 搭載Cargoまたは輸送能力 |
| Remote Facility | 本国工場、別拠点、契約工場 | 遠隔在庫または供給枠 |
| Trade Facility | 商社、交易所、市場契約 | 通貨決済後の購入Cargo |
| Support Facility | Red Star等の公的支援元 | 任務、契約、優先度に従う支援枠 |

各Recordは`facilityId`、所有者、所在地scope、能力、稼働状態、維持費、利用権、接続Route、次回更新tickを持つ。独立開拓団は、本国Facilityへの恒常的な無制限アクセスを自動取得しない。

## 権利、在庫、Cargo

三つを区別する。

1. **Supply Claim**は購入権、契約枠、支援枠であり、物理Thingではない。
2. **Remote Inventory**は遠隔地に存在する物理Thingであり、Core所有のWorld-level `ThingOwner`へ保持する。
3. **Transit Cargo**は出発済みの物理Thingであり、Core所有の輸送中`ThingOwner`へ一度だけ移す。

Claimを現地生産へ使うことはできない。Claimの履行または遠隔生産の完了時にRemote InventoryへThingを生成する。出発CommitはRemote InventoryからTransit Cargoへ所有権を移し、到着CommitはTransit Cargoから指定MapのNetwork Storageへ直接移す。

## 輸送状態

```text
Planned
→ Reserving
→ ReadyAtSource
→ Loading
→ InTransit
→ Arriving
→ Deposited

一時停止: Suspended / RouteBlocked / DestinationFull
終端: Cancelled / Returned / Lost / Failed
```

輸送は出発時刻、到着予定、距離、輸送能力、費用、危険、納入先容量を持つ。別Map、本国、宇宙船からの資源は即時出現せず、RouteとCargoを通る。到着先容量が失われた場合、Cargoを削除せず、輸送主体上で待機、別納入先、帰還のいずれかを選ぶ。

## 生産と商売

- Map Facilityの完成品は同じMapのNetwork Storageへ直接Commitする。
- Remote Facilityの完成品はRemote Inventoryへ入り、輸送指示を待つ。
- Trade Facilityは通貨TransactionのCommit後に購入品をRemote InventoryまたはTransit Cargoへ生成する。
- 売却は現地Network StorageからCargoへ積み、買い手到着Commit後に通貨を確定する。
- 本国支援はSupply Claimとして付与し、任務、契約、距離、輸送枠に従ってCargo化する。

## 所有と価値

Map在庫、遠隔在庫、輸送中Cargoを同時に利用可能在庫として数えない。各Thingは一つの`ThingOwner`だけに属する。プレイヤー所有の遠隔在庫、Cargo、施設価値は単一の資産評価Serviceからwealthへ一度だけ加算する。契約上のSupply Claimは、所有が確定していない限り資産価値へ加算しない。

## 保存と失敗

Facility、Claim、Remote Inventory、Route、Cargo、費用Transaction、到着容量予約は安定IDと`dataVersion`を持つ。出発、損失、帰還、到着はOperation IDで冪等化する。保存復旧後もThing総数、所有者、通貨、ETA、危険判定seedを二重適用しない。

## 再開条件

この草案を実装段階へ進める前に、ローカルNetwork Storageの容量予約、生産Commit、破壊復旧、保存往復が安定していなければならない。最初の縦切りは一つのRemote Facility、一つの固定Route、一種類のCargo、一つの到着先で行う。

## 関連項目

- [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)
- [遠隔物流の目的](/research/remote-logistics/00-目的.md)
- [保全する概念](/research/remote-logistics/02-保全する概念.md)
- [旧Transfer状態案](/research/remote-logistics/03-旧Transfer状態案.md)
- [再開ゲート](/research/remote-logistics/06-再開ゲート.md)
- [遠征共同体とRed Star](/world/08-遠征共同体とRed-Star.md)
