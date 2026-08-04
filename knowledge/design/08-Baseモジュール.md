---
type: "Product Design"
title: "8. Baseモジュール"
description: "Core設定は複数の開始立場を許容するが、最初に遊べるα版は数人規模の独立開拓団へ固定する。"
tags:
  - "shion"
  - "design"
  - "architecture"
  - "kombinat"
  - "pawn"
  - "red-star"
  - "the-hive"
  - "independent-colony"
  - "equipment"
  - "canon"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
  - "the-hive"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "design/08-Baseモジュール"
canonical_scope: "product-architecture"
source_section: "8. Baseモジュール"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_統合資料_本文優先全体設計版_v2.md"
    title: "シオン／Shion 統合資料 — 本文優先・全体設計版 v2"
---

# 8. Baseモジュール

## 8.1 責務

- シオンの種族・人格・身体の共通定義
- 狐娘型の標準遠征身体
- β版Pawn Foundry、適合生成、設計保存、個体登録、Clone、無料Dormant保管、低コスト修復・遺体回収・再実体化
- 独立開拓団を最初のプレイ可能開始として実装
- 漂着者、認可団等を追加できる開始立場基盤
- 生活、文化、救援、関係性を示すコンテンツ
- 通常工学、標準技術、イェツィラーの境界
- ソフェルの専門性
- 共通建築、研究、装備、UI
- Kombinatの有効化管理
- 後期に同梱するHiveを通常生成から隔離できる拡張点

## 8.2 Core開始立場

Core設定は複数の開始立場を許容するが、最初に遊べるα版は数人規模の独立開拓団へ固定する。この実装上の焦点を、独立開拓団という正史分類そのものの規模制限にしない。

開始立場は一列の排他的な組織名ではなく、少なくとも次の軸の組合せである。

| 軸 | 例 | 分類上の意味 |
|---|---|---|
| 本国関係 | 独立、限定認可、正式派遣 | 指揮、保証支援、最終責任 |
| 到着経緯 | 自発遠征、漂着、移住、分派 | 初期目的と不足 |
| 規模 | 数人、集落網、都市連合、国家級 | 生成方法、外交、資産規模 |
| 主な機能 | 生活、研究、交易、救援、契約軍事・警備 | クエスト、装備、行動傾向 |

独立開拓団は本国関係の大分類であり、規模と機能を限定しない。数人の遠征から国家級勢力まで存在し、PMC型の契約軍事・警備組織も含み得る。国家級の行政、常備戦力、独自外交、強固な物流を持っていても、本国の正規指揮と保証支援へ恒常所属しなければRed Starではない。

ゲーム内のシオン派閥は、同盟本国を辺境用の一派閥へ縮小するのではなく、複数の独立勢力から構成することを基本候補とする。一つの`FactionDef`で「独立シオン」全体を代表させない。

| 独立勢力の規模・機能 | 主なゲーム表現 | 実装時期 |
|---|---|---|
| 数人規模 | プレイヤー開始、来訪者、キャラバン、遭遇、クエスト | α版はプレイヤー開始を実装 |
| 集落・拠点網 | 通常派閥、交易先、救援・共同事業 | β |
| 国家級独立勢力 | 複数拠点、外交主体、大規模依頼・紛争 | β |
| PMC型組織 | 契約、護衛、警備、戦闘、救難、雇用関係 | β |

漂着、認可、移住等は独立と組み合わせ得る。これらを全て本国派遣のRed Star扱いにしない。

独立開拓団の大分類、標準三人開始、将来の派閥境界、Kombinat口座、生活、救援、実装データモデルは`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`を正本とする。

## 8.3 Baseへ直接入れない詳細

- Red Starの継続支援数値
- 内戦期全装備
- 全惑星と巨大建造物
- Hiveの大規模端末網を通常開始へ自動生成する規則
- 外部MOD全統合プロファイル

---

## 関連項目

- 上位索引: [design](/design/index.md)
- 同じ出典の前項: [7. 製品ファミリーの新しい境界](/design/07-製品ファミリーの新しい境界.md)
- 同じ出典の次項: [9. Kombinat内部Runtime](/design/09-Kombinat内部Runtime.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- 共有身体: [狐娘型の共有身体](/world/28-狐娘型の共有身体.md)

## 出典

- シオン／Shion 統合資料 — 本文優先・全体設計版 v2（退役済み原本: `retired-source://project/シオンShion_統合資料_本文優先全体設計版_v2.md`） — `8. Baseモジュール`
