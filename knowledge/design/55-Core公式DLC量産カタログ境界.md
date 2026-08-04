---
type: "Implementation Specification"
title: "Core・公式DLC量産カタログ境界"
description: "Coreと五つの公式DLCに属する反復可能な通常Recipeから、Kombinatの無人量産カタログをDef駆動で生成する。"
tags:
  - "shion"
  - "design"
  - "kombinat"
  - "production"
  - "storage"
  - "dlc"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/core-official-dlc-mass-production-catalog"
canonical_scope: "product-architecture"
content_layer: "implementation"
generated:
  by: "process:codex-implementation"
  at: "2026-07-31T00:00:00Z"
  precision: "date"
---

# Core・公式DLC量産カタログ境界

Kombinatは、Core、Royalty、Ideology、Biotech、Anomaly、Odysseyに属する公開`RecipeDef`から、無人で決定的に実行できる量産候補を生成する。製品Def名の固定許可一覧は持たず、対象package、適格条件、除外条件、出力品質、作業量換算、通貨費換算を`KombinatMassProductionPolicyDef`が所有する。

## 所有

| 対象 | 所有者 | 保存単位 |
| --- | --- | --- |
| 対象packageと適格・除外条件 | `KombinatMassProductionPolicyDef` | Def単位 |
| 読み込まれたRecipeから生成したカタログ | `KombinatProductionCatalog` | セッション中の派生Cache |
| 発注数量、優先度、進捗、通貨予約 | `WorldComponent_KombinatLedger` | Request・Transaction単位 |
| 材料Thing、入力予約、完成品容量、完成品Thing | Core独自Network Storage | Thing・Operation単位 |
| 工場能力と対応Policy | `KombinatFacilityProfileDef`と工場Comp | Facility単位 |

カタログは派生表示であり、saveへ製品一覧を複製しない。保存済みRequestはPolicy Def名とRecipe Def名から成る安定Pattern IDを保持し、ロード時に現在のDefから再解決する。

## 適格条件

量産候補は次を全て満たす。

1. Recipeと全出力ThingがPolicyの許可packageに属する。
2. Recipeに利用設備、物理材料、正数の物理Item出力がある。
3. Recipeは標準の決定的な`RecipeWorker`を使用する。
4. 全出力Thingをプレイヤーが取得できる。
5. 手術、Hediff変更、Mechanitor専用、Ideology建築専用、派閥、Meme、Mutant、特殊生成物の文脈を必要としない。
6. 全出力ThingのTechLevelがPolicyの除外集合に属さない。

αの除外TechLevelは`Archotech`である。反復可能な公開Recipeを持たないQuest報酬、特殊入手品、軌道兵器照準機等は候補源が存在しないためカタログへ入らない。個別除外が必要になった場合はPolicyの`excludedProducts`または`excludedRecipes`へDef参照を追加し、C#の製品名分岐を追加しない。

## 発注と生産Transaction

プレイヤーは管理画面でカタログを検索し、`KombinatFacilityProfileDef`が宣言する範囲で発注できる。αの範囲は1件につき1から10,000単位である。研究未完了の候補は将来需要として表示できるが、研究完了までは工程を開始しない。

工程開始時にKombinatは現在利用可能なStorage在庫をRecipeの`IngredientCount`、ingredient filter、固定filter、既定filter、ingredient value getterへ照合する。選択したThing Defと数量を入力として解決し、Stuff製品では選択材料のStuff Defを出力仕様へ引き渡す。

Core Storageは入力Thing ID・数量と出力容量を同じOperation IDで予約する。作業完了時の冪等Commitが入力消費と完成品生成を一度だけ行う。完成品は工場Bufferまたは地面を経由せず、予約済みStorageへ直接入る。αの出力品質はPolicyが所有する`Normal`であり、Stuff製品は選択したStuff Defを保持する。

## 状態

```text
Catalogued
→ ResearchLocked
→ Planned
→ MaterialWaiting / CapacityWaiting
→ Working
→ Committing
→ Completed

終端: Cancelled / Failed
```

RecipeまたはPolicyがロード後に存在しないRequestは`PatternMissing`となり、入力と出力を生成しない。研究、材料、容量、電力、接続の不足は待機理由を返し、条件が回復した時だけ再開する。

## 失敗結果

- Recipe不適格: カタログへ登録せず、取引を作成しない。
- 研究未完了: `ResearchLocked`を返し、材料と通貨を消費しない。
- 材料Filterを満たせない: `MaterialWaiting`を返し、Thing総量を変えない。
- Stuffを確定できない: `MaterialWaiting`を返し、Stuffなし製品を生成しない。
- 出力容量不足: `CapacityWaiting`を返し、入力を消費しない。
- Commit再送: 保存済み結果を返し、二重消費と二重生成を行わない。
- Commit中例外: 生成済み出力を除去して消費入力を元Ownerへ戻し、`CommitFailed`を返す。

## 性能条件

公式Recipe全件の走査と適格判定はPolicyごとに一度だけ行い、工場tickごとに繰り返さない。管理画面は検索結果をCacheし、Scroll範囲内の行だけを描画する。材料解決はStorageが公開する在庫Viewと予約済み数を使用し、全Map Thing、Stockpile、Pawn jobを走査しない。Recipe追加によってカタログ件数が増えても、非表示画面で毎tick再集計しない。

## 採用値

- 許可package: Core、Royalty、Ideology、Biotech、Anomaly、Odyssey
- 除外TechLevel: `Archotech`
- 出力品質: `Normal`
- 発注数量: `KombinatFacilityProfileDef`が所有する1から10,000
- 候補源: 読み込み済みの公開`RecipeDef`
- 取引経路: Core Storageの予約と冪等Commit
- 設備経路: 在庫を持たないKombinat Factory能力

## 関連項目

- [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)
- [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- [製品境界](/kombinat/core/01-製品境界.md)
- [発注と多段生産](/kombinat/core/05-発注と多段生産.md)
- [無人生産](/kombinat/core/06-無人生産.md)
