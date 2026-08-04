---
type: "Implementation Specification"
title: "52. バニラ優先Shion種族実装境界"
description: "Shion種族はHuman継承を維持し、Core所有の物理身体と公式DLCの公開機構で実装してHumanoid Alien Racesへ依存しない。"
tags:
  - "shion"
  - "design"
  - "implementation"
  - "pawn"
  - "race"
  - "biotech"
  - "alpha"
organization_groups:
  - "independent-frontier"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/vanilla-first-shion-race"
canonical_scope: "product-architecture"
content_layer: "implementation"
normative_basis:
  - "/world/03-シオンという人類.md"
  - "/world/28-狐娘型の共有身体.md"
  - "/world/29-シオンの無性機械身体.md"
  - "/design/07-製品ファミリーの新しい境界.md"
  - "/roadmap/04-α版-—-最初の公開候補.md"
generated:
  by: "process:user-decision"
  at: "2026-07-30T00:00:00Z"
  precision: "date"
---

# 52. バニラ優先Shion種族実装境界

Shion種族は、RimWorld 1.6本体と必須の公式DLCが提供するDef、Pawn renderer、健康、装備、仕事、Need、Gene、Xenotypeの公開機構を第一選択として実装する。Humanoid Alien Racesは必須MOD、ロード順、Assembly参照、XML型、描画、保存データのいずれも所有しない。

## 実装着手条件

Shion種族、標準身体、狐耳、狐尾、Portrait、独立開拓団Scenarioは、Core独自StorageとKombinatがバニラHumanのfixtureで工業基盤完成マイルストーンを通過した後に実装する。工業基盤はShionのrace Def、Gene、Xenotype、BodyDef、PawnKind、図像を要求せず、Shion統合は工業Runtimeの所有者、取引状態、保存形式を変更しない。

Shion種族の図像不足は工業マイルストーンのblockerではない。工業基盤の保存、取引、生産、UI、性能が未完了の場合も、種族Defまたは仮画像の追加を工業完成の代替証拠にしない。

## 採用する表現

| 要件 | 採用する所有者 |
|---|---|
| Shionという種族の安定ID | Coreの`Shion_Race` |
| 人型Pawn、服、通常UI、仕事、健康の基盤 | Verse標準`ThingDef ParentName="Human"` |
| 無性、機械の肉質・Cell、肉・皮なし | Verse標準`RaceProperties` |
| 標準身体Profile | Biotech標準`XenotypeDef` |
| 食事Need無効化と生物学的加齢係数0 | Biotech標準`GeneDef`フィールド |
| 生物学的生殖なし | Biotech標準`Sterile`と無性の`RaceProperties` |
| 内臓、狐耳、狐尾の物理的な負傷・欠損 | Coreの`Shion_StandardBody`と`BodyPartDef` |
| 狐耳と狐尾の表示 | Biotech標準textureを使うCore所有Gene render node |
| Cell喪失、休息下限、流体再処理停止、Anomaly状態拒絶 | Shion Pawnだけを処理するCore所有Gene class |
| 複製個体を残さない境界 | 公開`Pawn.Notify_DuplicatedFrom`と`SpawnSetup`だけを上書きする最小`Pawn_Shion` |
| 耐毒性 | Biotech標準`ToxicEnvironmentResistance_Total` |

`Shion_ClockworkBody`は、食事不要、加齢停止、傷跡防止、Anomaly免疫を宣言するCore所有Defである。Defだけに公開hookがないCell喪失、休息下限、流体再処理停止、複製拒絶markerの維持は、同Geneを持つShion Pawn自身のtickだけで処理する。全Pawn走査、renderer差替え、Harmony patchは持たない。

## 表現の拡張段階

`Shion_StandardBody`を採用し、内臓、狐耳、狐尾を物理的な健康対象にする。身体の具体的な器官、能力、欠損状態、心情は[Shion標準遠征身体の実装仕様](/design/56-Shion標準遠征身体の実装仕様.md)が所有する。

独自BodyDefを採用しても、`ThingDef ParentName="Human"`、標準Pawn renderer、apparel、仕事、健康tracker、手術Recipe、思考、Gene、Xenotypeは公開機構へ接続する。`Pawn_Shion`はAnomaly複製通知とspawn直後の拒絶だけを所有し、それ以外のPawn処理は基底`Pawn`へ委ねる。独自`ThingDef ParentName="BasePawn"`と独自`PawnRenderTreeDef`は採用しない。

## 依存境界

Coreの必須公式環境はRimWorld 1.6、Royalty、Ideology、Biotech、Anomaly、Odysseyである。現在のαではFactory animation、完成Fleck、Endpoint overlayの投影だけにVanilla Expanded Frameworkを使用する。

Shion CoreはHumanoid Alien RacesとHarmonyを直接依存へ列挙せず、`AlienRace.ThingDef_AlienRace`、`AlienRace.dll`、HAR body addon、HAR用互換コードを含めない。Vanilla Expanded Frameworkが内部で必要とする依存は、Shion種族実装の公開境界にしない。

## 状態と保存

Pawn生成時に`Shion_Colonist`またはShion派閥のXenotype集合から`Shion_Xenotype`を付与する。生成後はPawn自身のrace Defとgene trackerが種族IDと身体Profileを保持する。`ShionUtility.IsShion`は`Shion_Race`とのDef比較だけを行う。

同一新方式ビルドでは、新規生成、保存、ロード後にrace Def、Xenotype、Food Need不在、加齢係数、無性、身体部位、欠損効果、Cell喪失、Anomaly保護を維持する。公開前αでHAR型`Shion_Race`を保存した旧セーブからの移行は保証しない。新方式でも`Shion_Race`のDef名を維持し、以後の保存互換判断はdataVersionと公開段階に従う。

## 失敗結果

- `Shion_Xenotype`を付与できないPawn生成は、Shion生成成功として扱わず、検証エラーにする。
- 必須Geneまたは公式DLC Defが解決できない場合は、代替外見や通常人間への黙示的縮退を行わず、ロード時の欠落として扱う。
- Food Need、妊娠可能状態、生物学的加齢進行がShionに現れた場合は、設定差ではなく実装不具合として扱う。
- 出力セルやFactoryの失敗はPawn種族実装へ波及させず、StorageとKombinatの既存失敗結果を返す。

## 性能条件

- 種族判定はrace Defの定数時間比較とし、Map、Pawn一覧、Gene一覧を走査しない。
- 食事不要と加齢停止はgene trackerとNeed生成の公式処理へ委ねる。
- 身体状態の保守は対象Shion自身のGene tickで行い、血液喪失の即時変換以外は60 tick間隔とする。
- 耳、尾、服、Portraitはバニラrender treeへ接続し、独自OnGUIやMap探索を追加しない。
- Performance Analyzerで測定する場合は、[RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)に従い、Profiler自体の負荷を分離し、Shion種族由来の常駐patchまたは高頻度呼出しがないことを確認する。

## α受入条件

1. HARを無効にしたRimWorld 1.6、5公式DLC、VEF環境でロードできる。
2. `About.xml`、Build props、C#、実行DefにHAR package ID、DLL、型、XML blockがない。
3. 独立遠征が三人の`Shion_Race`と`Shion_Xenotype`を生成する。
4. 生成直後と保存・ロード後にFood Needがなく、生物学的年齢が進まず、生殖不能である。
5. バニラrendererで服、物理狐耳、物理狐尾を全方向とPortraitに表示し、欠損時は対応描画を消す。
6. Release buildと静的検証が成功し、実機ログにShion由来のXML、cross-reference、texture、config例外がない。
7. 種族判定と身体処理に全Pawn走査、Harmony patch、reflectionがない。
8. リアクターと人工脳、Cell、流体再処理装置、尾、休息、Anomaly拒絶、心情が身体仕様の受入試験を満たす。

## 対象外

- バニラPawn renderer、apparel、健康、仕事、UIの再実装
- HAR旧セーブの変換器とHAR互換レイヤ
- バニラPawn renderer、健康tracker、apparel、仕事、UIを所有し直す独自Race基盤
- VEF投影の撤去。これはFactoryとStorage表示の別変更として扱う

## 外部参照の利用境界

[Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race非HAR種族実装パターン.md)は、HARを必須所有者にせず、独自の人型Race、身体、render tree、Gene、Xenotypeを構成できることを確認する外部参照として使用する。Vivi RaceのDef、C#、DLL、テクスチャ、名称、数値はShionの実装資産にしない。外部実装の再利用は、対象ファイルのライセンスまたは作者許諾と、Shionの所有境界を個別に確認した場合だけ行う。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 製品境界: [製品ファミリーの新しい境界](/design/07-製品ファミリーの新しい境界.md)
- α版: [α版 — 最初の公開候補](/roadmap/04-α版-—-最初の公開候補.md)
- 作業順: [次の作業順](/roadmap/09-次の作業順.md)
- 工業先行開発: [工業先行開発マイルストーン](/roadmap/11-工業先行開発マイルストーン.md)
- Shion: [シオンという人類](/world/03-シオンという人類.md)
- 狐娘型身体: [狐娘型の共有身体](/world/28-狐娘型の共有身体.md)
- 無性機械身体: [シオンの無性機械身体](/world/29-シオンの無性機械身体.md)
- 診断契約: [RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)
- 身体仕様: [Shion標準遠征身体の実装仕様](/design/56-Shion標準遠征身体の実装仕様.md)
- 外部実装参照: [Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race非HAR種族実装パターン.md)
