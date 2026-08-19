---
type: "Protected Draft"
title: "75. カエラヴィ完全独自Race昇格構想"
description: "Human継承で検証したカエラヴィを、安定ID、Biotech、通常の健康・仕事・装備を維持しながら、独自RaceProperties、BodyDef、PawnRenderTreeDefを所有する非HAR種族へ昇格する構想。"
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
  - "performance"
project_scope: caelavi
status: draft
authority: protected-draft
knowledge_role: draft-proposal
reference_review: candidate
granularity: concept
content_layer: "implementation"
generated:
  by: "process:codex-design-draft"
  at: "2026-08-19T00:00:00Z"
  precision: "date"
normative_basis:
  - "/world/46-カエラヴィ.md"
  - "/world/47-カエラヴィの鳥類身体.md"
  - "/world/48-カエラヴィの遺伝性鳥類系統.md"
  - "/design/59-バニラ優先カエラヴィ種族実装境界.md"
  - "/design/60-カエラヴィ標準身体の実装仕様.md"
  - "/design/61-遺伝性鳥類系統の共通Xenotype契約.md"
  - "/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md"
---

# 75. カエラヴィ完全独自Race昇格構想

カエラヴィCoreの長期完成像は、HARを必須所有者にせず、`CA_Caelavi`自身が人型鳥類Race、共通身体、描画tree、保存境界を所有する完全独自Race構造である。初期開発では`ThingDef ParentName="Human"`によってバニラ接続を検証し、自然生得型六系統、広用途・国産配備のカエラヴィ改造型、高難度軍務・限定配備の同盟支援型、飛行、環境弱点、通常生成、apparel、健康、Portrait、保存が`scenario-tested`になった後、独自Race構造へ昇格する。

昇格は外見差分の追加ではない。RaceProperties、BodyDef、PawnRenderTreeDef、健康・手術、apparel、年齢、生成、Gene、Portrait、保存を一つのRaceとして成立させる所有移行である。昇格後も通常の仕事、Need、装備、社会関係、Biotech Gene／Xenotypeと公式DLCの公開機構を使用する。

本構想は現行の[バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)に対する将来昇格案である。採用時は同正本を、Human継承を初期検証段階、完全独自Raceを長期完成段階として扱う段階仕様へ更新する。本構想が保護ドラフトである間は、現行正本のHuman継承が実装上の権威を維持する。

## 完全独自Raceの所有構造

```text
CA_Caelavi
├─ ThingDef ParentName="BasePawn"
├─ RaceProperties
│  ├─ Humanlike think tree・intelligence・food・name
│  ├─ CA_CaelaviBody
│  ├─ CA_CaelaviRenderTree
│  ├─ lifeStageAges・health・recipes
│  └─ Race基礎値
├─ Body
│  ├─ Human互換の頭・胴・腕・脚・内部器官
│  ├─ 左翼・右翼
│  ├─ 開放気嚢系
│  └─ 採用済みの尾羽基部・系統器官接続点
├─ Render Tree
│  ├─ body・head・face・hair・beard・tattoo
│  ├─ apparel body・apparel head・equipment
│  ├─ wounds・stumps・status・carried・bed
│  └─ Gene駆動の翼・尾・冠羽・側頭羽・眼
├─ Biotech
│  ├─ CA_FunctionalWings・CA_OpenAirSacs
│  ├─ 六つのCA_Lineage_*
│  └─ 六Xenotype・八軍務xenogerm
└─ Runtime
   ├─ 飛行・身体能力・環境曝露
   ├─ render worker・condition subworker
   ├─ Def validation
   └─ 保存・昇格migration
```

HARはRace型、BodyDef、renderer、保存、apparel、Geneの所有者にならない。HAR互換を追加する場合は、HARが存在する環境だけで有効になる別adapterとし、カエラヴィCoreの通常loadを変更しない。

## Race ThingDefとRaceProperties

完全独自版の`CA_Caelavi`は`ThingDef ParentName="BasePawn"`を使用し、Humanlike Pawnとして必要なRacePropertiesを明示的に所有する。

| 項目 | 所有する内容 |
|---|---|
| 思考と知性 | Humanlikeのmain／constant think tree、Humanlike intelligence |
| 食性とNeed | 採用済みのHuman互換食性、通常Need、休息、娯楽、心情 |
| 名前と社会 | 人型Pawnの名前、関係、会話、Ideology、Royalty、Biotech接続 |
| 身体 | `CA_CaelaviBody` |
| 描画 | `CA_CaelaviRenderTree` |
| 年齢 | 採用済みのカエラヴィLifeStage。独自年齢仕様がない段階ではHuman標準Defを参照する |
| 健康 | Humanで利用できるHediffGiverSetと手術Recipeの採用済み集合 |
| 基礎値 | 標準身体正本が所有するBodySize、HealthScale、HungerRate、MoveSpeed、免疫、快適温度 |
| Gene | Biotechのgene tracker、endogene、xenogene、Xenotype |

Humanの健康、手術、仕事、Need、装備をコードコピーで所有しない。公開Defを参照またはXML importする範囲を固定し、RimWorld更新時に参照元との差分を検査する。Humanに追加された新しい公開処理は自動的にカエラヴィへ採用せず、互換表で要否を判定する。

## `CA_CaelaviBody`

独自BodyDefは、六系統すべてが共有する人型鳥類身体を一つだけ所有する。六系統ごとにBodyDefを複製せず、系統差はGene、Hediff、Capacity、描画nodeから適用する。

### 共通身体部位

- Human互換の頭、首、胴、両腕、両手、両脚、両足と内部器官。
- 背部へ接続する左翼と右翼。
- 胴内に接続する開放気嚢系。
- 採用する場合の尾羽基部。
- 系統器官が損傷、切断、治療、Capacityへ参加する場合の共通接続点。

各部位はcoverage、depth、height、group、wound anchor、左右、Capacityへの寄与を明示する。coverage合計、攻撃対象選択、apparel coverage、Hediff配置、手術対象が通常の人型戦闘と医療を壊さない値になることを実ゲームで検証する。

### 翼と気嚢

- 左翼または右翼の欠損・機能低下は、飛行能力、搭載、速度、描画へ同じ身体状態から反映する。
- 両翼が飛行条件を満たさない場合、Abilityを表示または発令せず、欠損理由を返す。
- 開放気嚢は身体部位として存在しても、公式曝露と別の毒性Needまたは並行ダメージを所有しない。
- 気嚢の損傷効果、治療、人工器官を採用する場合は、`CA_OpenAirSacs`のGene効果との重複を明示的に解決する。

## `CA_CaelaviRenderTree`

独自render treeはカエラヴィだけへ適用し、全Humanlike Pawnをpatchしない。標準`PawnRenderNode`と標準workerを基礎にし、カエラヴィ固有条件を標準workerで表現できないnodeだけをCore所有workerへ接続する。

### 必須node

- Root、Body、Head、Face、Hair、Beard、Tattoo。
- ApparelBody、ApparelHead、Equipment、Carried。
- Wounds、Stumps、Firefoam、Status、Swaddle、Bedまたは睡眠表示。
- 左翼、右翼、尾羽、冠羽、側頭羽、眼、顔面overlay。

翼、尾、頭部差分はgene trackerとBodyDefの欠損状態を参照する。系統Geneが休眠または欠落した場合は系統外見を止め、共通Geneが有効なら汎用外見へ解決する。身体部位が欠損した場合は対応するnodeだけを止め、能力と外見が別状態にならないようにする。

### 描画受入範囲

- 北、東、南、西。
- 立位、歩行、drafted、近接、射撃、飛行、睡眠、downed、crawling、死亡、遺体。
- Colonist bar、選択表示、Health tab、Bio tab、Portrait、Quest、Trade、Caravan、World Pawn。
- 全採用BodyType、HeadType、髪、帽子、服、鎧、utility apparel、武器。
- 傷、欠損、義肢、Hediff overlay、Gene overlay、tattoo。

描画CacheはPawn自身のRace、Body、Gene、apparel、姿勢だけを参照し、他PawnまたはMap全体を走査しない。

## 生成とBiotech接続

- PawnKind、Faction、Scenarioは`CA_Caelavi`を明示的に指定する。
- 自然生得型六Xenotypeは共通Geneとatomic lineage Geneを維持し、カエラヴィ改造型・同盟支援型のtemplateは出自階層契約のGene構成を維持する。
- 軍務xenogermはRace移行後も標準gene trackerへ保存される。
- 出生、成長、老化、妊娠、生殖、xenogerm移植、Gene上書き、休眠、死亡、蘇生を通常の公式trackerへ接続する。
- 種族判定は移行前後とも`pawn.def == CA_Caelavi`の定数時間比較を維持する。

完全独自Race化は六系統や三つの遺伝的出自を別Raceへ分割しない。Raceはカエラヴィ一つ、自然系統とtemplate改造はXenotypeとGene、個体へのカエラヴィ改造・同盟支援改造・軍務改造はxenogeneとして直交させる。

## 健康・手術・apparel・仕事の互換表

昇格前に、Human継承で利用していた機構を次の四状態へ分類する。

| 状態 | 処理 |
|---|---|
| そのまま参照 | 公開Defまたは標準workerをRaceから参照する |
| 明示import | Humanのrecipesまたはhediff giver等、継承消失後に必要な集合をXML importする |
| カエラヴィ専用 | 翼、気嚢、飛行、系統器官、専用手術、専用描画をCoreが所有する |
| 対象外 | 世界設定と1.0内容表に含まれず、Race成立に不要な機構を追加しない |

互換表は少なくとも健康、手術、Hediff、Capacity、apparel、equipment、work、Need、age、fertility、gene、Ideology、Royalty、Anomaly、Odyssey、portrait、corpse、resurrectionを対象とする。

## Human継承版からの昇格

昇格は専用branchと固定buildで行い、直前のHuman継承版を比較基準として保存する。`CA_Caelavi`、六Xenotype、Gene、PawnKind等の公開DefNameを維持し、Race親、BodyDef、render tree、health／recipe接続だけを昇格対象にする。

### 移行手順

1. Human継承版の六系統、主要apparel、健康、Gene、保存、描画、性能の基準証拠を取得する。
2. 独自BodyDefとrender treeを、開発用の別Race Defまたは専用test buildで先に検証する。
3. RaceProperties互換表の全項目を接続する。
4. `CA_Caelavi`へ独自BodyDefとrender treeを適用する。
5. 新規Pawnで生成、健康、装備、描画、Gene、飛行を検証する。
6. Human継承版の保存を読み、Pawn、Hediff、BodyPartRecord、apparel、Gene、relationを検査する。
7. 互換を提供する版ではmigrationを一度だけ実行し、結果とdataVersionを保存する。
8. 保存、ロード、再ロード後にmigrationが再実行されず、同じ結果を維持することを確認する。

1.0以前の異なるbuild間セーブ互換を提供しない場合も、同一独自Race build内の保存・ロードは必須とする。公開済みbuildからの互換を約束する場合は、BodyPartRecordとHediffの移行結果を個別に定める。

## 昇格Release Gate

完全独自Raceを通常配布へ入れるには、次を全て満たす。

1. Human継承版が一系統縦切り、自然生得型六系統、広用途のカエラヴィ改造型一例、高難度軍務の同盟支援型の改造・作製各一例について`scenario-tested`である。
2. RaceProperties互換表に未分類項目がない。
3. `CA_CaelaviBody`のcoverage、Capacity、健康、手術、欠損、遺体、蘇生が実ゲームで成立する。
4. `CA_CaelaviRenderTree`が描画受入範囲を通す。
5. 通常apparel、髪、帽子、武器、Portrait、仕事、Need、年齢、社会関係を維持する。
6. 三つの遺伝的出自、六系統、未分類混成、八軍務xenogerm、自然生得型を基準とした48組合せを維持する。48は基準行列であって全Xenotype・xenogerm数の上限ではなく、追加出自、任務別、部隊別の軍務適用は個別適合契約で検証する。
7. 新規開始と採用する旧build保存の双方で、保存・ロード・再ロードを通す。
8. HAR無効環境でRace、Body、renderer、Gene、保存が成立する。
9. Human継承版との同一セーブ比較で、描画、Pawn Tick、Needs、Thing Comps、保存、ロードの性能予算を満たす。
10. 欠落Def、texture、worker、BodyPart、migration失敗を別RaceまたはHumanへ黙って縮退させない。

一項目でも未成立の場合、完全独自Race版を通常配布へ昇格せず、最後に検証済みのHuman継承版を安定比較対象として維持する。最終的な完全独自Race目標を取り下げる場合は、本構想、完成設計図、現行種族正本を同じ変更単位で更新する。

## 性能条件

- render treeとworkerはPawn自身の状態だけを参照し、Map全Pawnまたは全Geneを毎Tick走査しない。
- BodyPartとCapacityは標準health trackerの更新契機を利用し、独自の全身再計算を常駐させない。
- 飛行条件は選択時と発令時、環境倍率は公式曝露更新時、旅鳩人数はdirty event時だけ更新する。
- 描画、健康、Gene、migrationの派生Cacheは保存の正本にせず、ロード後に再構築できる。
- Human継承版と独自Race版を同一条件で測定し、平均値だけでなくMax、call count、allocation、保存時間、ロード時間を比較する。

## 失敗結果

- RaceProperties不足で生成できない場合は、Humanとして生成しない。
- health recipeまたはHediff参照が欠けた場合は、対応機能を利用可能として表示しない。
- BodyPart移行に対応しないHediffがある場合は、消去または別部位への無断移動を行わず、互換失敗として記録する。
- render nodeまたはtextureが欠けた場合は、別系統の外見へ代替しない。
- migrationが途中で失敗した場合はdataVersionを完了へ進めず、元保存を上書きしない。
- 独自Race版の性能が予算を満たさない場合は、追加コンテンツで相殺せず昇格を停止する。

## 関連項目

- 現行種族境界: [バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)
- 標準身体: [カエラヴィ標準身体の実装仕様](/design/60-カエラヴィ標準身体の実装仕様.md)
- 遺伝性系統: [遺伝性鳥類系統の共通Xenotype契約](/design/61-遺伝性鳥類系統の共通Xenotype契約.md)
- 軍務ゼノジャーム: [カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)
- 完成設計図: [カエラヴィCore完成設計図](/roadmap/12-カエラヴィCore完成設計図.md)
- 外部実装参照: [Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race非HAR種族実装パターン.md)
- 診断契約: [RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)
