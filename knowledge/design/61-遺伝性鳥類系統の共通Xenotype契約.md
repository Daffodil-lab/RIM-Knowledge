---
type: "Implementation Specification"
title: "61. 遺伝性鳥類系統の共通Xenotype契約"
description: "六つの遺伝性鳥類Xenotypeを、共通三Geneと長所・短所・外見を一体化した一つのatomic lineage Geneで構成する。"
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
  - "/world/49-帝鷲系.md"
  - "/world/50-猟隼系.md"
  - "/world/51-冠朱鷺系.md"
  - "/world/52-白鸛系.md"
  - "/world/53-大洋信天翁系.md"
  - "/world/54-旅鳩系.md"
  - "/design/59-バニラ優先カエラヴィ種族実装境界.md"
  - "/design/60-カエラヴィ標準身体の実装仕様.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 61. 遺伝性鳥類系統の共通Xenotype契約

カエラヴィの六つの遺伝性鳥類系統は、いずれも`inheritable: true`の完全な`XenotypeDef`である。各Xenotypeは共通三Geneと、その系統の外見、固有器官、長所、短所を不可分に所有する一つのatomic lineage Geneから成る。

## 共通構成

| Endogene | Met | Cpx | Archite | 所有する機能 |
|---|---:|---:|---:|---|
| `CA_FunctionalWings` | -4 | 2 | 0 | 短距離急速飛行と継続飛行 |
| `Delicate` | +3 | 0 | 0 | バニラの脆弱性 |
| `CA_OpenAirSacs` | +1 | 1 | 0 | 公式の有毒ガス、毒性環境、真空曝露進行×1.25 |
| `CA_Lineage_*` | 0 | 2 | 0 | 系統固有の外見、器官、長所、短所 |
| **合計** | **0** | **5** | **0** | 遺伝性Xenotype単体の合計 |

`CA_Lineage_*`は、利益だけまたは欠点だけを別Geneへ分離しない。遺伝、移植、上書き、Def編集のいずれでも、系統の利益と代償を一つの単位として扱う。

六つのlineage Geneは共通の`exclusionTags`値`CA_AvianLineage`を持つ。複数のlineage Geneを保因しても同時に発現する系統は一つだけとし、上書きされたGeneは休眠状態として標準gene trackerが保持する。出生時に独自の全Pawn正規化処理を走らせない。

lineage Geneを一つも発現しなかった混成人は、`CA_FunctionalWings`の汎用外見と共通身体だけを持つ未分類混成となる。未分類混成を第七の選択可能XenotypeDefとして登録しない。

## 六つのXenotypeDef

| 表示名 | XenotypeDef | Atomic Gene |
|---|---|---|
| 帝鷲系〈Kaiseradler〉 | `CA_Xeno_ImperialEagle` | `CA_Lineage_ImperialEagle` |
| 猟隼系〈Saker〉 | `CA_Xeno_SakerFalcon` | `CA_Lineage_SakerFalcon` |
| 冠朱鷺系〈Waldrapp〉 | `CA_Xeno_Waldrapp` | `CA_Lineage_Waldrapp` |
| 白鸛系〈Weißstorch〉 | `CA_Xeno_WhiteStork` | `CA_Lineage_WhiteStork` |
| 大洋信天翁系〈Albatros〉 | `CA_Xeno_WanderingAlbatross` | `CA_Lineage_WanderingAlbatross` |
| 旅鳩系〈Wandertaube〉 | `CA_Xeno_PassengerPigeon` | `CA_Lineage_PassengerPigeon` |

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

通常のStat、Capacity、Thought、Gene render nodeで表せる効果はDefから適用する。飛行倍率、狭所、地形、集団、Solar flare、EMP等の条件効果だけをGeneのCore所有処理が評価する。

旅鳩系の人数はMapとCaravanごとにCacheし、Spawn、Despawn、Faction変更、Map移動、Caravan構成変更でdirtyにする。飛行距離、地形、屋内外は能力選択時と発令時に評価する。系統Gene、休眠状態、Xenotype、描画は標準gene trackerへ保存する。

## 軍務ゼノジャームとの合成

六系統は八つの軍務兵科すべてと組み合わせられる。lineage Geneは兵科を固定せず、軍務xenogermもlineage Geneを置換しない。Met合成と共通上書きは[カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)が所有する。

## 失敗結果と性能条件

- 一つのXenotypeDefにlineage Geneが二つ以上または一つも指定されている場合、標準六系統のDef検証を失敗にする。
- Geneと外見nodeの対応が欠けた場合、別系統の外見へ代替しない。
- atomic lineage Geneの利益と欠点を別Geneへ展開しない。
- 毎Tickの全Pawn人数集計、全地形走査、全Caravan走査を行わない。
- 条件付き効果はイベントCacheまたは操作時評価とし、待機中の追加処理を定数時間に保つ。

## 受入条件

1. 六XenotypeDefがそれぞれ共通三Geneと正しいlineage Gene一つを持ち、Met 0、Cpx 5、Archite 0になる。
2. 異系統の遺伝で利益だけまたは欠点だけのlineage Geneを生成しない。
3. 六系統の全効果、欠点、外見が生成直後と保存・ロード後に一致する。
4. 旅鳩系の人数条件がMap・Caravan構成変更後に更新され、非対象Pawnを走査しない。
5. 六系統と八軍務兵科の48組合せを拒否しない。

## 関連項目

- 上位境界: [バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)
- 系統設定: [カエラヴィの遺伝性鳥類系統](/world/48-カエラヴィの遺伝性鳥類系統.md)
- 身体仕様: [カエラヴィ標準身体の実装仕様](/design/60-カエラヴィ標準身体の実装仕様.md)
- 軍務合成: [カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)
