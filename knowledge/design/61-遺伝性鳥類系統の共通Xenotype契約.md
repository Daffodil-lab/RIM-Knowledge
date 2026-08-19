---
type: "Implementation Specification"
title: "61. カエラヴィXenotype出自階層契約"
description: "カエラヴィのXenotypeを自然生得型、カエラヴィ改造型、同盟支援型の三つの出自階層と、六つの鳥類系統・後天改造の層に分離する。"
tags:
  - "caelavi"
  - "caelum"
  - "design"
  - "implementation"
  - "pawn"
  - "race"
  - "biotech"
  - "body"
  - "rendering"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelavi-hereditary-xenotype-contract"
canonical_scope: "product-mechanics"
content_layer: "implementation"
normative_basis:
  - "/world/48-カエラヴィの遺伝性鳥類系統.md"
  - "/world/46-カエラヴィ.md"
  - "/world/49-帝鷲系.md"
  - "/world/50-猟隼系.md"
  - "/world/51-冠朱鷺系.md"
  - "/world/52-白鸛系.md"
  - "/world/53-大洋信天翁系.md"
  - "/world/54-旅鳩系.md"
  - "/world/55-カエルムと同盟の初期協定.md"
  - "/world/56-カエルムの工業化と技術転換.md"
  - "/world/61-カエラヴィ軍務ゼノジャーム制度.md"
  - "/design/59-バニラ優先カエラヴィ種族実装境界.md"
  - "/design/60-カエラヴィ標準身体の実装仕様.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 61. カエラヴィXenotype出自階層契約

カエラヴィのXenotypeは、出自、鳥類系統、後天改造の目的を一つの平面一覧へまとめず、三つの出自階層と直交するGene層として実装する。XenotypeDefの継承性はDefごとに定め、個体へ後から付与したxenogermは元のXenotypeを置き換えず、xenogeneとしてgene trackerへ保存する。

## 三つの出自階層

| 出自 | Xenotype／xenogermの責務 | 継承と適用 |
|---|---|---|
| **自然生得型〈Native〉** | 六つの自然鳥類系統を共通身体へ結び付ける基礎Xenotype | `inheritable: true`の`CA_Xeno_Native_*`を出生・遺伝・生成へ使い、意図的な改造用xenogeneを含めない |
| **カエラヴィ改造型〈Caelavi-made〉** | カエルム側が設計・検証・施術を所有する国内改造templateまたは改造xenogerm | 遺伝する改造は`CA_Xeno_CaelaviMade_*`、個体へ付与する改造は`CA_Xenogerm_CaelaviMade_*`として分け、自然系統を保存、組合せ、または採用済み仕様に従って置換する。軍事、産業、民生、医療、輸送、探査の各用途へ広く配備する |
| **同盟支援型〈Alliance-supported〉** | 同盟の技術・設備・専門家を利用した既存個体への改造と、任務用に設計・作製されたtemplate | 既存個体への改造は`CA_Xenogerm_AllianceSupported_*`、作製templateは`CA_Xeno_AllianceCreated_*`として分ける。Archite Geneを含む軍務xenogermはこの層の高難度軍務契約へ接続し、一般軍務・民間用途へは配備しない |

同盟支援型のxenogermを既存個体へ適用しても、その個体の自然生得型またはカエラヴィ改造型のXenotypeを同盟支援型へ書き換えない。作製templateを出生時のXenotypeとして使う場合も、Archite Geneの継承性を前提にしない。出自判定はPawnのrace、Xenotype、gene tracker、選択した改造定義だけを使い、名前、Faction、外見の全走査で推測しない。

## 配備境界

| 改造層 | 標準配備 | 適用条件 |
|---|---|---|
| カエラヴィ改造型 | 軍事・産業・民生・医療・輸送・探査 | 国産化されたtemplateまたはxenogermとして、通常の生成、配属、就業、生活へ使用する |
| 同盟支援型の既存個体改造 | 高高度偵察飛行、弾道弾迎撃、SEAD、超長期飛行、特殊部隊、エリート部隊 | 同盟支援を必要とする高難度軍務の資格・任務命令を先に成立させ、通常の民間・一般軍務要求からは選択できない |
| 同盟支援型の作製template | 上記の高難度軍務を担う専用PawnKind・部隊 | 同盟支援設備と専門補給を持つ軍務生成経路だけが生成し、通常の民間Pawn生成へ自動混入させない |

高難度軍務の判定は、改造Geneの効果推測やPawnの外見で行わず、カエルム軍務教範が発行する任務・資格と、選択したtemplateまたはxenogermの適合契約で決定する。

## 全出自に共通する生殖基盤

全てのカエラヴィは、六倍体相当の閉鎖的な遺伝的基盤を表す `CA_ClosedGermline` を共通endogeneとして持つ。`Met +2` を与えるが、複雑性予算は設計上の制約にしない。Geneを持たない相手との恋愛試行は約1%に上限設定し、交配そのものを絶対禁止するHard blockは追加しない。Geneを持つカエラヴィ同士の関係・出生・遺伝はBiotech標準の処理を基礎にする。

## 自然生得型の共通構成

| Endogene | Met | Archite | 所有する機能 |
|---|---:|---:|---|
| `CA_ClosedGermline` | +2 | 0 | 六倍体相当の遺伝的同一性と恋愛試行制限 |
| `CA_FunctionalWings` | -4 | 0 | ホバリング、短距離急速飛行、継続飛行 |
| `Delicate` | +3 | 0 | バニラの脆弱性 |
| `CA_OpenAirSacs` | +1 | 0 | 公式の有毒ガス、毒性環境、真空曝露進行×1.25 |
| `CA_Lineage_*` | 0 | 0 | 系統固有の外見、器官、長所、短所 |
| **合計** | **+2** | **0** | 遺伝性Xenotype単体のMet合計 |

`CA_Lineage_*`は、利益だけまたは欠点だけを別Geneへ分離しない。遺伝、移植、上書き、Def編集のいずれでも、系統の利益と代償を一つの単位として扱う。

六つのlineage Geneは共通の`exclusionTags`値`CA_AvianLineage`を持つ。複数のlineage Geneを保因しても同時に発現する系統は一つだけとし、上書きされたGeneは休眠状態として標準gene trackerが保持する。出生時に独自の全Pawn正規化処理を走らせない。カエラヴィ改造型と同盟支援型のtemplateは、採用する系統Geneをこの排他規則へ接続する。

lineage Geneを一つも発現しなかった混成人は、`CA_FunctionalWings`の汎用外見と共通身体だけを持つ未分類混成となる。未分類混成を第七の選択可能XenotypeDefとして登録しない。

## 自然生得型の六つのXenotypeDef

| 表示名 | XenotypeDef | Atomic Gene |
|---|---|---|
| 帝鷲系〈Kaiseradler〉 | `CA_Xeno_Native_ImperialEagle` | `CA_Lineage_ImperialEagle` |
| 猟隼系〈Saker〉 | `CA_Xeno_Native_SakerFalcon` | `CA_Lineage_SakerFalcon` |
| 冠朱鷺系〈Waldrapp〉 | `CA_Xeno_Native_Waldrapp` | `CA_Lineage_Waldrapp` |
| 白鸛系〈Weißstorch〉 | `CA_Xeno_Native_WhiteStork` | `CA_Lineage_WhiteStork` |
| 大洋信天翁系〈Albatros〉 | `CA_Xeno_Native_WanderingAlbatross` | `CA_Lineage_WanderingAlbatross` |
| 旅鳩系〈Wandertaube〉 | `CA_Xeno_Native_PassengerPigeon` | `CA_Lineage_PassengerPigeon` |

## 系統固有効果

### 帝鷲系

`CA_Lineage_ImperialEagle`は暗褐色の羽、金色の後頭羽、淡色の肩羽、幅広い指状翼、扇尾、琥珀眼を描画する。双窩遠望網膜と強化翼梁を次として表す。

- Sight ×1.05
- 飛行搭載上限 ×1.10
- Melee dodge ×0.90
- 離陸準備時間 ×1.25

### 猟隼系

`CA_Lineage_SakerFalcon`は砂褐色から淡いクリーム色、細かな斑点、頬髭、尖った翼、横縞の長尾を描画する。衝圧鼻弁と硬質初列風切を次として表す。

- 飛行速度 ×1.15
- 離陸準備時間 ×0.75
- 翼力容量と連続飛行時間 ×0.70
- 飛行搭載上限 ×0.80

### 冠朱鷺系

`CA_Lineage_Waldrapp`は緑紫色に光る黒羽、赤い裸面、長い冠羽、銅色の眼を描画する。裸面熱交換帯と多襞嗉嚢を次として表す。

- 生食から得る栄養 ×1.25
- 通常の「生の食事」心情を無効化
- `ComfyTemperatureMax` +10℃
- Hunger rate ×1.15
- `ComfyTemperatureMin` +5℃

Ideologyが所有する食事思想と禁忌は無効化しない。

### 白鸛系

`CA_Lineage_WhiteStork`は白い体羽、黒い風切羽、赤い眼周囲と下腿、滑らかな側頭羽を描画する。長脛湿地腱と湿地濾過気嚢を次として表す。

- 水、浅瀬、湿地セルの地上移動コストを1にする
- Toxic environment resistance +0.15
- Melee dodge ×0.90
- 屋内または狭所での離陸準備時間 ×1.25

### 大洋信天翁系

`CA_Lineage_WanderingAlbatross`は白い頭胴、黒灰色の外翼、極端に長い鎌状翼、眼上の塩腺線を描画する。翼関節固定腱と発達した塩腺を次として表す。

- 飛行維持消費 ×0.60
- 最大連続飛行時間 ×1.50
- 水セルの地上移動コストを1にする
- 離陸時の固定翼力消費 ×1.75
- 離陸準備時間 ×1.75
- 地上Move speed -0.15

高い固定離陸費用と低い維持費により、約20セル以上の移動から他系統より効率的になる。約20セルは結果説明であり、距離20セルを境に効果を切り替える追加分岐ではない。

### 旅鳩系

`CA_Lineage_PassengerPigeon`は青灰色の翼、葡萄色の胸、緑紫色の首羽、長い楔尾、紅眼を描画する。帰巣磁鉄小体と編隊前庭器を次として表す。

同一MapまたはCaravanに、自身を含む友好的なカエラヴィが四名以上いる場合:

- 飛行維持消費 ×0.85
- Caravan movement speed ×1.10
- 飛行着地点の誤差 ×0.50

他の友好的なカエラヴィが一人もいない場合:

- Mood -6

Solar flareまたは強力なEMP環境中:

- Sight ×0.80
- Move speed -0.20

二名または三名の集団は、集団恩恵も孤立心情も持たない。

## 実行と保存

通常のStat、Capacity、Thought、Gene render nodeで表せる効果はDefから適用する。飛行倍率、狭所、地形、集団、Solar flare等の条件効果だけをGeneのCore所有処理が評価する。自然生得型の飛行フィールドは真空中でも機能し、EMPで飛行不能にはしない。

旅鳩系の人数はMapとCaravanごとにCacheし、Spawn、Despawn、Faction変更、Map移動、Caravan構成変更でdirtyにする。飛行距離、地形、屋内外は能力選択時と発令時に評価する。系統Gene、休眠状態、Xenotype、描画は標準gene trackerへ保存する。

## 改造層との合成

六系統は、適合契約が成立したカエラヴィ改造型および同盟支援型の改造層と組み合わせられる。lineage Geneは改造目的を固定せず、後天xenogermもlineage Geneまたは元の出自を置換しない。国産改造型は通常用途の契約へ、軍務xenogermのMet合成、共通上書き、高難度軍務への適用可能性は[カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)へ接続する。

## 失敗結果と性能条件

- 自然生得型のXenotypeDefにlineage Geneが二つ以上または一つも指定されている場合、六系統のDef検証を失敗にする。国内改造型または同盟作製型は、採用済みtemplateが定める系統または混成Geneの数を別途検証する。
- Geneと外見nodeの対応が欠けた場合、別系統の外見へ代替しない。
- atomic lineage Geneの利益と欠点を別Geneへ展開しない。出自と改造主体を表す情報を、効果だけの推測Geneへ分割しない。
- 同盟支援型を通常の民間・一般軍務生成へ混入させず、資格・任務命令のない改造要求を成功扱いにしない。
- 毎Tickの全Pawn人数集計、全地形走査、全Caravan走査を行わない。
- 条件付き効果はイベントCacheまたは操作時評価とし、待機中の追加処理を定数時間に保つ。

## 受入条件

1. 自然生得型の六XenotypeDefがそれぞれ共通四Geneと正しいlineage Gene一つを持ち、Met +2、Archite 0になる。
2. 異系統の遺伝で利益だけまたは欠点だけのlineage Geneを生成しない。
3. 六系統の全効果、欠点、外見が生成直後と保存・ロード後に一致する。
4. 旅鳩系の人数条件がMap・Caravan構成変更後に更新され、非対象Pawnを走査しない。
5. 自然生得型、カエラヴィ改造型、同盟支援型の出自を、Xenotypeとxenogermの組合せから別出自へ誤変換せず復元する。
6. カエラヴィ改造型を通常の軍事・産業・民生用途へ生成・適用できる。
7. 同盟支援型の既存個体改造と作製templateが、資格・任務命令のある高難度軍務検証経路だけで生成・適用され、民間・一般軍務経路では拒否される。
8. 自然生得型六系統と八軍務兵科の基準48組合せを共通基準として検証する。48はXenotype・xenogerm全体の上限や総数ではなく、カエラヴィ改造型、同盟作製型、任務別派生を含む追加組合せは個別適合契約と対応するDef一覧を持つ場合に検証対象へ加える。

## 関連項目

- 上位境界: [バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)
- 系統・出自設定: [カエラヴィの遺伝的出自と鳥類系統](/world/48-カエラヴィの遺伝性鳥類系統.md)
- 身体仕様: [カエラヴィ標準身体の実装仕様](/design/60-カエラヴィ標準身体の実装仕様.md)
- 軍務合成: [カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)
