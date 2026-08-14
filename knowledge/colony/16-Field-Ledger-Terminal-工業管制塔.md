---
type: "Gameplay Specification"
title: "16. 工業管制塔"
description: "コアMODからコンビナートへ入る最初の可視入口とする。"
tags:
  - "shion"
  - "independent-colony"
  - "gameplay"
  - "kombinat"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "colony/16-Field-Ledger-Terminal"
canonical_scope: "independent-colony"
content_layer: "implementation"
normative_basis:
  - "/design/39-Field-Ledger-Terminal設定クラス.md"
source_section: "16. Field Ledger Terminal"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md"
    title: "Shion Race: Core — 独立開拓団 設定・実装仕様 v1"
---

# 16. 工業管制塔

## 16.1 役割

コアMODからコンビナートへ入る最初の可視入口とする。

- マップ上の工業管制塔を選択すると`統合端末を開く`操作ボタンを表示し、既定画面を`概要`として全登録ページを持つ同一の管理画面を開く。
- 工業管制塔から概要、在庫、研究、生産、投資、物流、設備、財務、資料庫と、それぞれが公開する操作へ到達できる。特定の工場または保管設備を先に選択する必要はない。
- 操作対象はページ内の一覧、検索、絞り込み、マップ選択から指定する。個別工場、保管設備、接続端点の操作ボタンは、同じ管理画面を対象ページと対象記録付きで開く文脈ショートカットとする。
- 実在する`Thing`の在庫、予約量、使用可能量と、非貨幣の同盟Credit Accountを区別して表示する。
- 開拓団構成と口座識別子を開発者表示で確認できる。
- 通常表示では内部識別子を隠す。
- 台帳不在、Def欠落、初期化失敗を警告する。

工業管制塔の停電、接続網分断、台帳初期化失敗時も管理画面と診断ページを開ける。実行条件を満たさない操作は、正本所有者が状態を維持したまま拒否理由を返す。工業管制塔の破壊時は建築入口だけを失い、世界台帳、口座、生産依頼、保管設備内の`Thing`を削除しない。

## 16.2 実装段階

α版コンビナートでは、一つの工業管制塔を選択するだけで、生産目標、消費率、不足予測、供給先、目標量、優先度、詰まりを表示・操作できる管理画面を完成させる。通常表示はマップと操作ボタンを残し、最大化表示は同じ画面、選択、絞り込みを維持したまま大量一覧、工程、物流図、取引履歴の表示領域を広げる。生産型、供給元、実行設備、予約、製造単位は診断詳細へ置き、通常プレイヤーへ管理を要求しない。コアMOD側は領域内部のコレクションや保存用具象記録を走査しない。

α版ではこの完成画面へ独立開拓団用の表示名、施設、製造処方、開始定義を接続し、種族MODのプレイ文脈で検証する。

工業管制塔が台帳を所有しない。破壊されても世界の正本台帳は消滅しない。

---

## 関連項目

- 上位索引: [colony](/colony/index.md)
- 同じ出典の前項: [15. 開始シナリオ定義とポーン生成](/colony/15-ScenarioDefとPawn生成.md)
- 同じ出典の次項: [17. Field Workshopのαコンテンツ](/colony/17-Field-Workshopのαコンテンツ.md)
- コンビナート領域: [コンビナート](/kombinat/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)
- 設定所有者: [工業管制塔設定クラス](/design/39-Field-Ledger-Terminal設定クラス.md)
- 表示言語: [日本語優先表記規則](/authoring/23-日本語優先表記規則.md)

## 出典

- Shion Race: Core — 独立開拓団 設定・実装仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md`） — `16. Field Ledger Terminal`
