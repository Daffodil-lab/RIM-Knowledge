---
type: "Protected Draft"
title: "12. カエラヴィCore完成設計図"
description: "カエラヴィCoreをHuman継承の検証版から完全独自Raceの1.0配布物まで進め、公式更新と実測に応じて改訂する段階、成果物、停止条件、検証証拠、完成判定の草案。"
tags:
  - "caelavi"
  - "roadmap"
  - "release"
  - "implementation"
  - "race"
  - "biotech"
  - "rendering"
  - "performance"
  - "alpha"
  - "beta"
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
  - "/design/63-フリーカ・コーラと軍用複合刺激剤の実装境界.md"
  - "/design/74-カエラヴィMODのCore・拡張製品境界.md"
---

# 12. カエラヴィCore完成設計図

本設計図は、カエラヴィCoreを知識仕様だけが存在する状態から、RimWorld 1.6で配布できる1.0製品へ進める実装順、段階状態、成果物、停止条件、検証証拠を定める。世界設定、Race値、Gene構成、系統効果、軍務ゼノジャーム、薬物、製品境界の内容は既存の各正本が所有し、本設計図はそれらを変更せず完成までの接続順だけを扱う。

カエラヴィCoreは、Human継承で検証する初期Raceから、独自RaceProperties、BodyDef、PawnRenderTreeDefを所有する完全独自Raceへ昇格し、自然生得型六系統、広用途・国産配備のカエラヴィ改造型、高難度軍務・限定配備の同盟支援型、飛行と環境弱点、通常の生成と開始、軍務ゼノジャーム、Core所属の通常コンテンツ、日本語表示、保存、診断、性能を一つの配布物として成立させる。World台帳、債務、軍務教範の横断状態、政治前例、戦役、自動化、専用管理画面はCore完成条件へ含めず、Core前提の拡張MODが所有する。

## 計画の可変性

本設計図は現在採用できる情報から作る現行ルートであり、将来の作業量、実装方法、phase数、公開時期を固定する不変契約ではない。公式更新、DLCの追加または変更、公開APIとDef schemaの変更、実ゲーム試験、性能測定、素材制作、ライセンス、利用者の反応、Core内容表の再評価によって、phase、成果物、順序、完成条件を追加、統合、分割、削減、延期できる。

| 種別 | 変更の扱い |
|---|---|
| 世界設定、Race値、Gene構成、系統効果、製品境界 | 対応する既存正本を更新し、その採用後に本設計図と実装を追従させる |
| packageId、Assembly、DLC依存、対応RimWorld版 | 配布仕様を更新し、scaffold、build、load、保存互換のgateを再判定する |
| phase順、作業分解、XMLファイル分割、C# module分割 | 本設計図を更新し、前提関係と検証範囲が追跡できる形で組み替える |
| 1.0内容表 | 項目の追加、削減、延期と、それによる完成条件・素材・翻訳・試験の差分を同時に更新する |
| 実装済み機能 | 影響する保存、公開Def、UI、翻訳、素材、性能、回帰試験を確認して変更する |

計画変更は失敗ではない。新しい事実に合わせて最終製品へ到達する経路を更新する通常の運用である。ただし、変更後の計画も正本、成果物、失敗結果、検証方法、公開範囲を一つに解決し、未検証の作業を完了扱いにしない。

## 設計図が所有する状態

次の状態列は現行計画の基準経路である。後段の証拠は前段の証拠を置き換えず追加するが、対象RimWorld版、依存、正本、実装、素材、検証条件が変わった場合は、影響を受ける状態を未成立へ戻して再検証する。

```text
知識正本のみ
  → design-ready
  → scaffolded
  → compilable
  → game-loadable
  → scenario-tested
  → alpha-complete
  → feature-complete
  → release-candidate
  → 1.0-complete
```

| 状態 | 成立条件 |
|---|---|
| `design-ready` | 配布識別、依存、実装リポジトリ、1.0内容表、素材契約、検証環境が採用済みの正本へ解決している |
| `scaffolded` | 別の実装リポジトリにAbout、versioned folder、Defs、Languages、Textures、Assemblies、Source、build、検証出力の配置がある |
| `compilable` | 対象.NET FrameworkとRimWorld 1.6参照でAssemblyを再現可能にbuildできる |
| `game-loadable` | 必須環境でDef解決とAssembly読込が完了し、赤エラーなしでメインメニューまで到達する |
| `scenario-tested` | 帝鷲系一系統について生成、全方向描画、Portrait、服、帽子、飛行成功と拒否、環境弱点、保存・ロードを実ゲームで通す |
| `alpha-complete` | Human継承の六系統、通常生成、開始Scenario、主要日本語、基本装備と健康、保存・ロードが一つの継続可能な種族MODとして機能する |
| `feature-complete` | 完全独自Raceへの昇格、採用済みの1.0内容表にあるCore要素、八つの軍務ゼノジャームが全て実装される |
| `release-candidate` | 自動検査、実ゲーム試験、描画表、保存試験、性能測定、配布物監査が同一buildで合格する |
| `1.0-complete` | 固定した公開識別子とdataVersionを持つ配布物、説明、ライセンス、既知事項、検証証拠が公開可能な形で揃う |

状態名は、実際に取得した最も高い証拠だけに使用する。XMLがparseできることを`game-loadable`と呼ばず、メインメニュー到達を`scenario-tested`と呼ばない。

完成状態は一方向の永久認定ではない。たとえば公式更新でAssembly参照が変われば`game-loadable`を再確認し、render treeが変われば`scenario-tested`を再確認し、公開Defまたは保存形式が変われば`release-candidate`と`1.0-complete`の互換条件を再確認する。影響のない証拠は保持し、影響を受ける証拠だけを失効させる。

## 最終製品の構造

```text
Caelavi Core 1.0
├─ Package
│  ├─ About.xml・version routing・依存宣言
│  ├─ Assembly・公開Def・安定ID
│  └─ 日本語説明・ライセンス・配布画像
├─ Race
│  ├─ CA_Caelavi・BasePawn基盤の独自RaceProperties
│  ├─ CA_CaelaviBody・CA_CaelaviRenderTree
│  ├─ CA_FunctionalWings・CA_OpenAirSacs
│  ├─ 自然生得型六Xenotype
│  ├─ カエラヴィ改造型template・xenogerm（広用途・国産配備）
│  ├─ 同盟支援型の改造・作製template（高難度軍務・限定配備）
│  └─ 標準健康・仕事・Need・装備・社会関係・Portrait
├─ Flight and Environment
│  ├─ 飛行選択・発令・着地・安全停止
│  ├─ 系統別の飛行倍率
│  └─ 公式曝露へ接続する開放気嚢
├─ Generation and Play
│  ├─ PawnKind・Faction・Culture・名前
│  ├─ 通常生成・プレイヤー開始Scenario
│  └─ Core内容表にある通常装備・食事・薬物・研究・Recipe
├─ Military Xenogerms
│  ├─ 八兵科の非遺伝性xenogerm
│  ├─ 自然生得型六系統との基準48組合せ
│  └─ 出自・任務・適合契約による追加派生（48を上限としない）
└─ Quality
   ├─ 日本語・必要な英語識別子
   ├─ 保存・ロード・Def検証・診断
   ├─ 描画・性能・失敗結果
   └─ HAR非依存と外部互換の分離
```

## 正本と成果物の対応

| 実装対象 | 内容の正本 | 主な実装成果物 |
|---|---|---|
| 初期種族識別とHuman継承 | `/design/59-バニラ優先カエラヴィ種族実装境界.md` | 初期`ThingDef`、Pawn生成時のrace参照、標準接続の比較基準 |
| 完全独自Raceへの昇格 | `/design/75-カエラヴィ完全独自Race昇格構想.md` | 独自RaceProperties、BodyDef、PawnRenderTreeDef、互換表、migration |
| Race基礎値、翼、気嚢、描画層 | `/design/60-カエラヴィ標準身体の実装仕様.md` | Race XML、共通Gene XML、Ability XML、Gene Runtime、texture |
| 三つの遺伝的出自と六系統 | `/design/61-遺伝性鳥類系統の共通Xenotype契約.md` | 自然生得型六Xenotype、広用途の国内改造template、高難度軍務用の同盟支援型改造・作製template、系統texture、条件効果 |
| 軍務ゼノジャーム | `/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md` | 八xenogerm、高難度任務の資格接続、共通軍務Gene、適合・合計検証、基準48組合せと追加適合契約の試験 |
| 食事と軍用刺激剤 | `/design/63-フリーカ・コーラと軍用複合刺激剤の実装境界.md` | Thing、Drug、Chemical、Hediff、Recipe、Policy接続 |
| Coreと拡張の配置 | `/design/74-カエラヴィMODのCore・拡張製品境界.md` | Assembly依存、配布境界、互換アドオン境界 |
| 実装順と完成状態 | 本設計図 | phase gate、build evidence、release checklist |

実装リポジトリは仕様の正本にならない。Def値または挙動を変更する場合は、対応するRIM-Knowledgeの正本を先に更新し、実装差分をその採用済み内容へ一致させる。

## Phase 0 — 製品契約を固定する

Phase 0は`design-ready`を成立させる。

### 成果物

- 正式製品名、`packageId`、Assembly名、root namespace、公開Def接頭辞を一つの配布仕様へ固定する。
- RimWorld 1.6と公式DLCの必須依存、load order、任意開発MOD、外部互換アドオンを分離する。
- 実装リポジトリの場所、既定branch、build出力、配布zip構造、ライセンスを固定する。
- 1.0へ含める通常装備、服、家具、食事、薬物、研究、Recipe、Faction、Scenario、Backstoryの内容表を作る。
- spriteの方向、基準位置、scale、layer、色、apparelとの重なり、Portrait利用、作者用原本とruntime PNGの配置を素材契約へ固定する。
- 小規模、代表、stressの各検証セーブ条件と、実ゲーム証拠の保存先を固定する。

### 完了条件

- XML、C#、texture、翻訳の各成果物が、採用済みの正本または内容表の一項目へ追跡できる。
- 必須依存と任意互換が同じ欄へ混在しない。
- 1.0完成条件を「後で追加する内容」に依存させない。

### 停止条件

配布識別、必須DLC、ライセンス、実装リポジトリ、1.0内容表のいずれかが未確定の場合、Phase 1の配布scaffoldを正式成果物として固定しない。

## Phase 1 — 配布・build scaffoldを作る

Phase 1は`scaffolded`と`compilable`を成立させる。

### 配置

```text
CaelaviCore/
├─ About/
│  ├─ About.xml
│  └─ preview.png
├─ LoadFolders.xml
└─ v1.6/
   ├─ Defs/
   ├─ Languages/
   ├─ Textures/
   ├─ Assemblies/
   └─ Source/
```

実装リポジトリがroot直下の`Defs`、`Languages`、`Textures`、`Assemblies`を採用する場合は`LoadFolders.xml`を置かず、選んだ方式を配布仕様とbuildへ一貫させる。

### 成果物

- `About.xml`へ名前、作者、packageId、supportedVersions、必須DLC、load order、説明、iconを定義する。
- C# projectへRimWorld 1.6の公開Assembly参照、対象framework、nullable方針、言語version、build後配置を定義する。
- Def、translation、texture、Assemblyを検査するCIまたは同等の再現可能なlocal commandを用意する。
- `About.xml`、project参照、Def型、Assembly参照へHARを必須依存として含めない。

### 完了条件

- clean checkoutから同じcommandでbuildできる。
- build出力が配布フォルダの所定位置へ一度だけ配置される。
- build失敗時に古いDLLを成功成果物として残さない。

## Phase 2 — Race XMLの骨格をロードする

Phase 2は`game-loadable`を成立させる。

### XML成果物

- `Race_Caelavi.xml`: `ThingDef ParentName="Human"`、`CA_Caelavi`、採用済みの七つのRace基礎値。
- `Genes_Common.xml`: `CA_ClosedGermline`、`CA_FunctionalWings`、`CA_OpenAirSacs`。
- `Genes_Lineages.xml`: 帝鷲系atomic lineage Gene一件。
- `Xenotypes_Caelavi.xml`: `CA_Xeno_Native_ImperialEagle`一件。
- `PawnKinds_Caelavi.xml`: 検証用の明示的なカエラヴィPawnKind一件。
- `Languages/Japanese/DefInjected`: 上記Defの名前と説明。

### Runtime成果物

- race Def比較だけを使用する`Caelavi`判定。
- Def読込時に共通Gene、lineage Gene、Met、Archite、exclusion tag、texture参照を検査するvalidator。
- XMLだけで表現できない処理を接続する最小のGeneまたはAbility class。

### 完了条件

- 必須環境でメインメニューへ赤エラーなしで到達する。
- Dev生成したPawnが`CA_Caelavi`を保持する。
- 通常Humanの健康、仕事、Need、年齢、服、髪、帽子、社会関係を利用できる。
- 保存・ロード後もraceと帝鷲系endogeneを保持する。

### 失敗結果

必須Def、Gene、texture、classを解決できないbuildは、通常Human、別系統、空の外見へ黙って縮退せず、Def名と不足対象をエラーへ記録する。

## Phase 3 — 帝鷲系の縦切りを完成する

Phase 3は最初の`scenario-tested`を成立させる。このphaseで一系統の全経路を通し、六系統へ未検証の設計を複製しない。

### 描画

- 汎用翼と尾、帝鷲系の翼、尾、後頭羽、肩羽、眼を標準Human render treeへGene nodeとして追加する。
- 北、東、南、西、立位、睡眠、downed、drafted、Portraitで同じ系統を識別できる。
- 服、帽子、髪、武器、傷overlayを維持し、翼と尾がapparel全体を置換しない。

### 飛行

- AbilityまたはJobが開始セル、着地セル、屋内外、禁止区域、到達、翼力、積載、系統倍率を発令時に検査する。
- 飛行中の正本は実行中AbilityまたはJobが所有する。
- 着地セル失効時は検証済み退避候補へ着地し、候補がない場合は安全停止結果を返す。
- 失敗時はPawnを開始位置に維持し、日本語で拒否理由を返す。

### 環境

- `CA_OpenAirSacs`は公式の有毒ガス、毒性環境、真空曝露が進む時だけ1.25倍を適用する。
- 公式防護が曝露を0にした場合は追加曝露を発生させない。

### 完了条件

- 実ゲームの専用試験Scenarioで帝鷲系を生成できる。
- 全方向、Portrait、通常apparel、飛行成功、代表的な飛行拒否、曝露、防護、保存・ロードを一つのbuildで通す。
- `Pawn Renderer`、`Draw Dynamic Things`、Portrait、`Pawn Tick`、`Thing Comps`に取得不能な常時負荷を追加しない。

## BodyDef昇格ゲート

初期実装はHuman身体とGene所有を維持する。翼の損傷、切断、治療、義翼、翼手術をα内容へ採用する場合に限り、Phase 3とPhase 4の間へ次の成果物を先行追加する。

- 全系統共通の`CA_CaelaviBody`。
- 翼の`BodyPartDef`、左右`BodyPartGroupDef`、Capacity接続、coverage。
- 欠損、傷、治療、義翼、手術Recipe、apparel group、保存の仕様。
- 翼欠損時に描画と飛行能力を同時に停止する接続。
- Human標準の健康、手術、apparel、Portrait、年齢、保存を維持する回帰試験。

BodyDefをαへ先行採用していないbuildは、健康UIへ仮の翼部位を追加しない。完全独自Raceへの最終昇格では[カエラヴィ完全独自Race昇格構想](/design/75-カエラヴィ完全独自Race昇格構想.md)に従い、共通BodyDef、完全な独自`PawnRenderTreeDef`、`BasePawn`基盤のRacePropertiesを一つの昇格変更として検証する。

## Phase 4 — 六系統を完成する

Phase 4は遺伝性系統の実装を完成する。

### 成果物

- 六つの`CA_Lineage_*`と六つの`CA_Xeno_*`。
- 各系統の翼、尾、頭部、眼または顔面overlay。
- 各系統のStat、Capacity、飛行倍率、地形、環境、Thought、集団条件。
- `CA_AvianLineage`排他、休眠Gene、未分類混成の汎用外見。
- 旅鳩系のMap・Caravan人数Cacheとdirty契機。

### 完了条件

- 六Xenotypeが共通四Geneと正しいlineage Gene一つを持ち、Met +2、Archite 0になる。複雑性は設計上の受入条件にしない。
- 各系統の利益、負担、器官、外見がatomic lineage Geneと同時に有効・無効になる。
- 六系統の全方向、Portrait、apparel、出生または遺伝、休眠、保存・ロードを通す。
- 旅鳩系の人数条件はSpawn、Despawn、Faction変更、Map移動、Caravan構成変更で更新される。
- 待機中に全Pawn、全地形、全Caravanを毎Tick走査しない。

## Phase 5 — 通常生成とプレイヤー開始を完成する

Phase 5は`alpha-complete`を成立させる。

### 成果物

- カエラヴィ用PawnKindの共通parentと、プレイヤー開始・民間・軍務等の内容表にある具体PawnKind。
- カエルムのFaction、Culture、名前RulePack、採用済みBackstory。
- 六系統のいずれか、または有効なプレイヤー構成を明示的に選ぶ生成経路。
- 通常開始Scenarioと、検証専用Scenarioを分離した構成。
- 開始Pawn、開始品、開始説明、主要な日本語表示。

### 完了条件

- 新規ゲームで複数のカエラヴィを選び、通常の住居、食事、仕事、戦闘、医療、社会関係を継続できる。
- Scenarioは六系統の選択を一系統へ固定しない。
- Pawn名、Faction、外見、全Gene走査から種族を推測しない。
- 通常生成、開始生成、NPC生成、Caravan、捕虜、加入、死亡、遺体、保存・ロードを通す。
- α配布物に未実装Def、欠落texture、仮説明、開発専用PawnKindを含めない。

## Phase 6 — 完全独自Raceへ昇格する

Phase 6は、Human継承版で得た`alpha-complete`の比較証拠を維持したまま、`CA_Caelavi`を独自RaceProperties、`CA_CaelaviBody`、`CA_CaelaviRenderTree`を所有する非HARの完全独自Raceへ昇格する。このphaseは[カエラヴィ完全独自Race昇格構想](/design/75-カエラヴィ完全独自Race昇格構想.md)が採用済み正本へ昇格した後に実行する。

### 成果物

- `ThingDef ParentName="BasePawn"`を基盤とする`CA_Caelavi`の完全なRaceProperties。
- Human互換の頭、胴、四肢、内部器官と、左右翼、開放気嚢系を持つ共通`CA_CaelaviBody`。
- body、head、hair、apparel、equipment、wounds、statusと、Gene駆動の翼、尾、冠羽、眼を含む`CA_CaelaviRenderTree`。
- Human継承で利用していた健康、手術、Hediff、Capacity、apparel、仕事、Need、年齢、Gene、公式DLC機構の互換表。
- Human継承版から採用する旧buildへのBodyPart、Hediff、Gene、apparel、relation、dataVersion migration。
- Human継承版と独自Race版を同一条件で比較する描画、保存、性能証拠。

### 完了条件

- RaceProperties互換表に未分類項目がない。
- 六系統、未分類混成、通常生成、開始Scenario、NPC、Caravan、捕虜、加入、死亡、遺体、蘇生が独自Raceで成立する。
- 通常の健康、手術、apparel、髪、帽子、武器、仕事、Need、年齢、社会関係、Portraitを維持する。
- 翼と気嚢のBodyPart状態、飛行能力、Gene、描画が一つのPawn状態から一致する。
- HAR無効環境でRace、Body、render tree、Gene、保存が成立する。
- 新規開始、同一build保存、採用するHuman継承版保存のmigration、再ロードを通す。
- Human継承版との比較で描画、Pawn Tick、Needs、Thing Comps、保存、ロードの性能予算を満たす。
- 欠落Def、BodyPart、render node、texture、migration失敗をHumanまたは別Raceへ黙って縮退させない。

Phase 6が未成立の場合はHuman継承版を最後の検証済み比較対象として維持し、`feature-complete`、`release-candidate`、`1.0-complete`へ進めない。完全独自Race目標を変更する場合は、完全独自Race昇格正本と本設計図を同じ変更単位で改訂する。

## Phase 7 — 軍務ゼノジャームを完成する

Phase 7は八兵科と自然生得型六系統の基準合成を完全独自Race上で完成し、通常軍務へ広く配備するカエラヴィ改造型とは分けて、高高度偵察飛行、弾道弾迎撃、SEAD、超長期飛行、特殊部隊・エリート部隊の同盟支援型へ適合契約を通して拡張する。六系統×八兵科の48組合せは基準行列であり、出自、任務、部隊、性能要求に応じた追加派生を含む総数を制限しない。

### 成果物

- 八つの非遺伝性軍務xenogerm。
- 共通の`Robust`、`Breathless`相当、`CA_MilitaryFlightController`と、採用済みの兵科固有Gene。
- 標準Gene Assembler、xenogerm保管、移植、昏睡、上書き、保存への接続。
- `CA_Caelavi`と遺伝性共通Geneを確認する移植前検査。
- 移植後の排他、最終Met、lineage外見、軍務能力を確認する結果検査。

### 完了条件

- 各軍務xenogermが単体Met +5になる。
- 自然生得型六系統×八兵科の基準48組合せが最終Met +4になる。
- `Robust`が`Delicate`を停止し、`Breathless`相当が`CA_OpenAirSacs`を削除せず公式曝露を0にする。
- 基準48組合せと、個別適合契約を持つ追加組合せについて、生成、移植、保存、ロード後のlineageとxenogeneを維持する。追加組合せは48を上限とせず、未承認組合せ、通常軍務、民間用途からの同盟支援要求は移植を拒否する。
- 不適合Race、欠落Gene、範囲外Met、誤った排他を移植成功として扱わない。

兵科固有Geneの正本が未採用の兵科は完成Defとして公開しない。兵科名だけから能力を補完しない。

## Phase 8 — Core通常コンテンツを完成する

Phase 8はPhase 0で固定した1.0内容表を実装し、`feature-complete`を成立させる。

### 対象

- 通常の武器、防具、服、家具、食事、設備、Recipe、研究。
- フリーカ・コーラ、軍用複合刺激剤、Chemical、Addiction、Withdrawal、DrugPolicy。
- Coreへ配置するバニラIdeologyの既存Meme、Precept、Role、Ritual利用。
- 各Thing、Recipe、Research、PawnKind、Faction、Scenarioの日本語名、説明、texture、icon。

### 完了条件

- 各コンテンツがバニラまたは公式DLCのThing、Recipe、Bill、WorkGiver、Research、Drug、Hediff、Ideologyの正本へ接続する。
- Core内容がWorld台帳、政治前例、戦役、自動化、専用管理画面を必須にしない。
- 製造、装備、摂取、取引、破壊、保存・ロードの代表経路を通す。
- 1.0内容表の全項目が実装済み、明示延期、削除のいずれかへ解決し、公開物へ空の予約Defを残さない。

## Phase 9 — 図像・翻訳・説明を閉じる

### 図像条件

- runtime textureは採用済みの作者用原本から再生成でき、出典、作者、利用許諾を追跡できる。
- Race、六系統、Gene、Xenotype、Ability、Faction、Scenario、Core内容表の各表示対象へ必要なiconまたはtextureがある。
- texture path、case、方向suffix、shader、mask、color source、scale、draw orderを自動検査できる。
- Portrait、世界Pawn、bed、caravan、downed、corpse、apparel、武器保持で重大な欠けや重なりがない。

### 表示条件

- 日本語を主要表示言語とし、DefName、class、Assembly、packageId、正式な外部名は英語識別子を維持する。
- 能力説明は効果、代償、条件、失敗結果を示す。
- 飛行拒否、移植拒否、欠落Def、無効Xenotype、保存不整合をプレイヤーまたはlogから識別できる。
- 未実装機能、開発用文言、翻訳キーそのものを公開UIへ表示しない。

## Phase 10 — Release Candidateを検証する

Phase 10は一つの固定buildを`release-candidate`へ進める。修正後は影響する検証を同じbuildで再実行する。

### 自動検査

- clean checkout build。
- XML well-formed、Def cross-reference、重複DefName、translation key、texture path、Assembly class解決。
- About、project参照、Assembly、Defs、Patches、保存識別子のHAR必須依存監査。
- 完全独自RaceのRaceProperties互換表、BodyDef参照、render tree node、health／recipe import、migration検証。
- 自然生得型六Xenotype、カエラヴィ改造型、同盟支援型templateのGene構成とBiostat検証。
- 自然生得型六系統×八兵科の基準48組合せ、および48を超え得る追加出自・任務別適合契約の検証。
- source format、test、配布zip内容、`git diff --check`。

### 実ゲーム試験

| 領域 | 必須経路 |
|---|---|
| ロード | 必須環境、HAR無効、通常load order、赤エラーなし |
| Race構造 | `BasePawn`基盤、`CA_CaelaviBody`、`CA_CaelaviRenderTree`、Human互換表 |
| 生成 | 六系統、国産改造型の通常開始・NPC・加入・捕虜・Caravan、同盟支援型の高難度軍務検証Scenario |
| 描画 | 四方向、Portrait、睡眠、downed、drafted、apparel、帽子、武器、遺体 |
| 健康 | 通常負傷、治療、死亡、採用済みの場合は翼損傷と手術 |
| Gene | 遺伝、混成、休眠、国産改造xenogerm移植、資格付き同盟支援xenogerm、基準48軍務組合せ、追加適合契約 |
| 飛行 | 成功、禁止区域、屋内、積載超過、無効着地、着地失効、安全停止 |
| 環境 | 有毒ガス、毒性環境、真空、防護、Breathless相当 |
| 保存 | 生成直後、飛行前後、移植前後、Caravan、負傷、死亡を保存・ロード |
| 通常プレイ | 食事、仕事、装備、医療、社会、交易、Core内容表の製造と利用 |

### 性能試験

- 小規模、代表、stressの同一セーブでMOD無効・有効を比較する。
- `Pawn Renderer`、`Draw Dynamic Things`、Portrait、`Pawn Tick`、`Needs`、`Thing Comps`、該当Harmony区分を記録する。
- Average、Max、Av Per Call、call count、allocation、保存時間、ロード時間を記録する。
- 高頻度処理はstacktraceで主要経路を特定する。
- 全Pawn、全Gene、全Map、全地形、全Caravanの毎Tick走査をrelease blockerとする。

### 証拠

- build command、commit、mod list、RimWorld version、DLC、test save、再現手順。
- immediate logまたはLog Publisher URL。
- 描画matrixの画像。
- 保存・ロード結果。
- uncropped Performance Analyzer画像と測定条件。
- 自動検査の結果と、実施していない検証項目。

## Phase 11 — 1.0配布物を確定する

Phase 11は`1.0-complete`を成立させる。

### 配布物

- 固定した`packageId`、Assembly名、公開DefName、dataVersion。
- reproducible buildから作成したzipまたはWorkshop upload内容。
- About、preview、説明、依存、load order、利用許諾、更新履歴、既知事項。
- 1.0 Release Gateの証拠索引。
- 保存互換を開始する公開識別子と、以後のMigration責任。

### 完了条件

- 配布物のfile hashと検証対象buildが一致する。
- clean環境へ配布物だけを導入してPhase 10の代表試験を再確認する。
- Coreが拡張MOD、HAR、対象外互換MODを要求せず起動する。
- 公開説明が実装内容、依存、未実装事項、検証範囲と一致する。
- rollback対象となるrelease artifactとsource commitを特定できる。

## 公式更新への追従

RimWorld本体または公式DLCの更新を検知した時点で、更新後の環境を既存の対応対象へ自動追加しない。公開済み配布物と作業中buildの対応版を保持し、次の順で影響を確認する。

1. 更新前のRimWorld版、DLC版、Core build、source commit、検証証拠を固定する。
2. `About.xml`、Assembly参照、対象framework、公開API、Def schema、render tree、Gene、Xenotype、Ability、環境曝露、保存形式の変更範囲を確認する。
3. 影響する正本、配布仕様、phase、状態、検証項目を列挙する。
4. 影響を受ける完成状態を未成立へ戻し、scaffold、build、load、scenario、保存、性能の必要なgateを再実行する。
5. 更新後対応buildの配布物と証拠が一致した時点で、対応版を公開説明へ追加する。

更新前の安定配布物は、対応対象として維持する間、更新後の未検証AssemblyまたはDefで上書きしない。更新後の公開機構で既存要件を表現できなくなった場合は、近似挙動へ黙って変更せず、要件正本の更新または対応延期を記録する。

公式更新によって標準機構が拡張され、独自C#、Harmony、独自render worker、独自BodyDefを削減できる場合は、公開機構への置換を独立変更として試験する。置換後は保存、描画、失敗結果、性能を再検証し、旧互換処理を残す必要がなければ内容表と配布物から除く。

## 実装の共通停止条件

次のいずれかが成立したphaseは、次段階へ進めず現在の状態を維持する。

- 必須要件を所有する正本を一つに解決できない。
- Def値、外見、挙動を仮定しないと実装できない。
- 使用するコード、DLL、texture、音声の利用許諾を確認できない。
- XML parse、Def解決、build、実ゲームload、保存・ロードの該当gateが失敗する。
- 欠落要素を通常Human、別系統、別Gene、仮textureへ黙って置換している。
- 検証していない状態を上位の完成状態として表示している。
- Coreの要件が拡張MODまたは外部MODの保存形式へ依存している。
- 性能劣化の主要経路を特定できず、代表セーブで予算を判定できない。

停止したphaseは、不足する正本、成果物、証拠、再開条件を記録する。後段のコンテンツ追加でgate失敗を相殺しない。

## 変更管理

- Race値、Gene構成、系統効果、軍務xenogerm、薬物効果、製品境界は各既存正本で変更する。
- 本設計図は、phase順、状態名、成果物、gate、証拠、1.0完了条件だけを変更する。
- phaseは追加、統合、分割、削減、延期、再順序化できる。変更後は各phaseの入力、成果物、完了条件、停止条件、後続への前提を明示する。
- phaseを並行実施する場合は、作業の並行性と完成状態の前提関係を分ける。後続作業を始めても、前提gateが未成立なら上位状態を付与しない。
- `BasePawn`基盤のRaceProperties、独自BodyDef、完全RenderTreeはPhase 6の一つの昇格変更として扱う。Harmony、HAR互換、外部MOD Adapterはそれぞれ独立した採用条件と回帰試験を持つ変更にする。
- Core拡張MODの調査と設計はCore開発中にも進められる。拡張Runtimeは別の完成設計図で横断状態と台帳の実装順を所有し、Coreの完成条件または必須依存へ逆流させない。
- 1.0以後に公開DefName、packageId、Scribe key、dataVersionを変更する場合はMigration仕様を先に採用する。

### 計画改訂記録

計画を改訂する変更は、次を同じ変更単位へ記録する。

- 改訂の契機となった現在の事実または測定結果。
- 追加、統合、分割、削減、延期、再順序化するphaseと成果物。
- 影響する正本、配布仕様、実装module、XML、texture、翻訳、試験。
- 現在の完成状態のうち保持する証拠と失効させる証拠。
- 同一buildの保存・ロードと、1.0以後の保存互換への影響。
- 新しい停止条件、再開条件、rollback単位。

変更理由の履歴は決定記録またはPull Requestが所有し、本設計図の本文は改訂後の現行ルートだけを示す。

### 要素の追加と削減

- 新しい要素は、所有する正本、Coreまたは拡張の配置、最小実装phase、素材、翻訳、失敗結果、保存、性能、試験を解決してから内容表へ追加する。
- 1.0完成に必須でない追加要素は、現在のrelease gateを広げず、後続releaseの内容表へ配置できる。
- 1.0以前に要素を削減する場合は、内容表、Def、C#、texture、翻訳、Scenario、testから同じ変更単位で除き、空の予約Defまたは表示だけを残さない。
- 1.0以後に公開Defまたは保存データを削減する場合は、Migration、tombstone、利用者への通知、旧セーブの結果を先に定める。
- 要素の追加または削減後は、影響する最も早いphaseへ完成状態を戻し、必要なgateを再実行する。

## 関連項目

- 上位索引: [リリース計画](/roadmap/index.md)
- 種族実装境界: [バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)
- 標準身体: [カエラヴィ標準身体の実装仕様](/design/60-カエラヴィ標準身体の実装仕様.md)
- 出自・系統: [カエラヴィXenotype出自階層契約](/design/61-遺伝性鳥類系統の共通Xenotype契約.md)
- 軍務ゼノジャーム: [カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)
- Core配置境界: [カエラヴィMODのCore・拡張製品境界](/design/74-カエラヴィMODのCore・拡張製品境界.md)
- 完全独自Race: [カエラヴィ完全独自Race昇格構想](/design/75-カエラヴィ完全独自Race昇格構想.md)
- 診断契約: [RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)
- 外部実装参照: [Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race非HAR種族実装パターン.md)
- 人間承認境界: [人間による承認境界](/governance/human-approval-boundary-人間による承認境界.md)
