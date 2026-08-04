---
type: "Implementation Specification"
title: "51. Core独自保管・接続システムの実装境界"
description: "α版からCore独自のThing保管・接続・入出庫システムを正規基盤とし、設備間を直接転送し、内容物の任意排出を提供する。"
tags:
  - "shion"
  - "design"
  - "implementation"
  - "storage"
  - "network"
  - "kombinat"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/core-native-storage-network"
canonical_scope: "product-architecture"
content_layer: "implementation"
normative_basis:
  - "/roadmap/04-α版-—-最初の公開候補.md"
  - "/kombinat/core/12-α完成条件.md"
generated:
  by: "process:positive-specification-policy"
  at: "2026-07-27"
---

# 51. Core独自保管・接続システムの実装境界

Core独自のThing保管・接続・入出庫システムをα版から正規基盤とする。現在の設計名は「Core独自保管・接続システム」とし、正式名称、Assembly名、世界内表示名は公開候補の命名工程で確定する。

## 版ごとの境界

| 段階 | 保管・接続基盤 |
|---|---|
| α版 | 独自Storage、Network、Endpoint、手動排出、保存・復旧の最小縦切り |
| β版 | 大容量化、追加Filter、高速Endpoint、Wireless、追加Adapter、診断の拡張 |
| β終了／1.0 | 公開境界、dataVersion、性能予算、破壊・復旧規則を固定した正規基盤 |

αで採用したThing ownership、取引、保存、排出の契約をβで拡張する。

## 独自システムが所有する責務

- Network identity、接続、結合、分割
- 非Spawn状態の実Thingを保持する`ThingOwner`、stack、identity、検索、Filter
- 容量、満杯、入庫拒否、排出、回収
- Pawn向けInterfaceと自動Import／Export Endpoint
- 生産入力Thingの予約、出力容量の予約、入力消費と出力生成の冪等Commit
- 電力またはエネルギー供給との接続
- UI、診断、保存、ロード、dataVersion
- 破壊、Map lifecycle、拠点放棄、紛失、復旧
- wealth、Quest参照、名前付き品、Container、未知Comp、外部MOD品
- 保管中のTick、腐敗、温度、劣化、充放電、孵化等を進めるか停止するかという独自方針

## 直接搬送

接続済み設備間の自動搬入、搬送、在庫判断、生産予約は、権威所有者である`ThingOwner`間の直接取引で完結する。

1. 送信元の`ThingOwner`が対象Thingを所有していることを確認する。
2. 受信先の容量、Filter、権限、予約を検証する。
3. 通常転送は取引IDに対して一度だけ、送信元`ThingOwner`から受信先`ThingOwner`へ直接移す。
4. 受領済み在庫と予約状態を更新し、eventでUIとKombinatへ通知する。

生産は入力Thing ID・数量と納入先容量を同じOperation IDで予約し、工程完了時に入力消費と出力生成を一度だけCommitする。Plannerは実在庫、入力予約、出力容量予約の増分索引を判断根拠にする。

手動搬入用PortはPawnが地上品を持ち込む入口となる。手動排出後の品はVanilla運搬へ引き渡され、通常戦闘では標準のDropと装備変更が機能する。

## 内容物の任意排出

プレイヤーは保管中の内容物を、いつでも明示的に通常Map空間へ戻せる。管理画面と建築Gizmoから、選択品、指定数、全量を排出できる。

- 排出先は建築の指定Output Cellを優先し、塞がっていれば近傍の有効セルを探索する。
- 排出先探索が`NoOutputCell`を返した場合、内容物は保管側の所有状態を維持し、UIは結果理由を表示する。
- 建築実体のRecovery Interfaceは停電、Network分断、Planner停止中の手動排出要求を受け付ける。
- 予約中のThingを排出する場合は、関係するReservationまたはJobを同じ取引で取消してから排出する。
- 建築破壊、Map放棄、アンインストール前復旧では、同じ復旧取引を一度だけ実行し、残存内容物をRecovery Ownerが保持する。

「いつでも」は排出要求を呼び出せることを表す。成功状態は有効セルへの所有権移転、保留状態は保管維持と理由表示である。

## UIと性能

α版は一つの管理画面とField Ledger Terminalの建築Gizmoで成立させる。Terminalを選択すれば、特定のFactoryまたはStorageを先に選ばず、概要、在庫、生産、設備、物流、財務の全Def駆動Pageと公開操作へ到達できる。保管一覧では合計、予約済み、利用可能、容量、検索、Filter、排出を扱う。個別建築Gizmoは同じ管理画面を対象Record付きで開く。接続範囲とリンクは選択時またはOverlay有効時だけ表示する。

大量在庫はページングまたは仮想化した一覧とevent駆動の検索索引で表示する。描画コストは可視行数に比例させる。

## Kombinatとの境界

Kombinatは発注、依存計画、Job、Batch、工場能力、進捗、消費観測、目標在庫、流通優先度、同盟通貨を所有する。独自保管システムはThingの保管、検索、入出庫、接続、入力予約、出力容量予約、生産Commitを所有する。

両者は公開された小さなApplication境界で接続する。Kombinatは公開索引と取引APIを使用し、工場内へThingを移さず、公開契約がThing IDと数量で確約した入力だけを工程へ算入する。

## 保存と版間更新

保管中のThing、Network、Endpoint、Reservation、転送取引、排出取引に安定IDと`dataVersion`を持たせる。同一αビルドでは、転送直前、転送中、排出直前、排出中、建築破壊前後の保存・ロードでThingを一度だけ数える。

αとβの版間セーブ方針はβの`dataVersion`固定工程で確定する。αはCore所有の安定IDと保存Recordを使用する。

## α完了条件

1. RimWorld 1.6でCoreとKombinatがロードできる。
2. 代表工業資源と少なくとも一種類の複雑Thingを、identityを保ったまま保管・検索・直接転送できる。
3. 自動搬送が`ThingOwner`間の直接取引で完結し、Planner判断が受信済み在庫と予約の増分索引を使用する。
4. 選択品、指定数、全量を手動排出でき、排出不能時には内容物を維持して理由を表示する。
5. 予約品の手動排出がReservation取消と原子的に成立する。
6. 容量満杯、取消、停電、接続分断、破壊、保存・ロードの各経路でThing総数と所有権が保存される。
7. Kombinatの三段生産が入力予約、出力容量予約、生産Commitだけで完了し、工場がThingを保持しない。
8. 保管、生産、接続の管理UIと、選択時の接続Overlayが機能する。
9. 規定規模でtick、UI描画、保存、ロードの性能予算を満たす。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- α版: [α版 — 最初の公開候補](/roadmap/04-α版-—-最初の公開候補.md)
- β版: [β版](/roadmap/05-β版.md)
- α完成条件: [Kombinat α完成条件](/kombinat/core/12-α完成条件.md)
- Kombinat: [Kombinat中核仕様](/kombinat/core/index.md)
- UI参照研究: [Kombinat UI参照](/research/kombinat-ui-references/index.md)
- 統合境界: [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)
