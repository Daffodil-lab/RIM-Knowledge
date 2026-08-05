---
type: "Research Reference"
title: "10. Vivi Raceの非HAR種族実装パターン"
description: "Vivi RaceがHARを必須所有者にせず、バニラ人型処理、Biotech、独自身体、Pawn render tree、任意HAR互換を組み合わせる構成をShion向けに分類する。"
tags:
  - "research"
  - "reference-mod"
  - "rimworld"
  - "race"
  - "biotech"
  - "rendering"
  - "har"
status: stable
authority: reference
knowledge_role: reference
granularity: concept
canonical_for: "research/reference-mods/vivi-race-non-har-pattern"
canonical_scope: "external-implementation-reference"
generated:
  by: "process:source-inspection"
  at: "2026-07-30T00:00:00Z"
  precision: "date"
sources:
  - id: "vivi-workshop"
    resource: "https://steamcommunity.com/sharedfiles/filedetails/?id=3241577976"
    title: "Vivi Race"
  - id: "vivi-source"
    resource: "https://github.com/gguake/RWMod-Vivi"
    title: "gguake/RWMod-Vivi"
---

# 10. Vivi Raceの非HAR種族実装パターン

Vivi Raceは、HARを必須MODにせず独自の人型種族を成立させる外部実装参照である。2026年7月30日にWorkshop配布物と公開リポジトリの1.6用Def・Sourceを照合した。

## 確認した構成

| 層 | Vivi Raceの構成 |
|---|---|
| 必須環境 | RimWorld BiotechとHarmony |
| Race | `ThingDef ParentName="BasePawn"`へ`Humanlike`の思考、知性、食性、ライフステージを設定 |
| 健康・手術 | バニラ`Human`の`hediffGiverSets`と`recipes`をDef import |
| 身体 | 独自`BodyPartDef`、`BodyPartGroupDef`、`BodyDef` |
| 描画 | 独自`PawnRenderTreeDef`へ標準`PawnRenderNode`、標準worker、必要な独自workerを構成 |
| Biotech | 独自`GeneDef`と`XenotypeDef` |
| 固有挙動 | Comp、Hediff、Gene class、Harmony patch、同梱の独自補助層 |
| HAR | HARが存在する場合だけXML patchで`AlienRace.ThingDef_AlienRace`と互換設定を追加 |

この構成では、HARは基本Race、身体、描画、保存の所有者ではない。HAR互換は任意環境へだけ適用する外側のadapterである。

## Shionへ採用する知見

- `Human`継承と公式Geneで要件を満たすα版は、その構成を維持する。
- 専用狐耳・尾の描画が必要な場合は、公開render-tree機構と標準workerを優先し、足りない処理だけをCore所有workerにする。
- 身体部位としての損傷、切断、治療、能力影響が必要な場合だけ、Core所有`BodyDef`へ進む。
- 独自Raceを採用しても、バニラの仕事、健康、装備、レシピ、Gene、XenotypeへDefと公開APIで接続する。
- HAR互換adapterは、HAR非依存をα受入条件とするShionには追加しない。

## 採用しない資産

Vivi RaceのDef、C#、DLL、テクスチャ、名称、数値、独自補助層はShionの所有資産にしない。公開リポジトリは実装確認に使用し、コードまたは画像の再利用は対象ファイルのライセンスまたは作者許諾を確認した場合だけ個別に判断する。

## 性能確認

Vivi型の構成をShionへ導入する場合は、次を変更前後で比較する。

- 独自render treeとworker: `Pawn Renderer`、`Draw Dynamic Things`、Portrait、`UI Root OnGUI`
- Comp、Hediff、Gene class: `Thing Comps`、`Pawn Tick`、`Needs`
- Harmony: `Harmony Patches`、`Harmony Transpilers`、`Harmony Transpiled Methods`
- 高頻度呼出し: Stacktraceの主要経路と割合
- 停止: `Max For Frame/Tick`

測定とログ取得は[RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)に従う。

## 外部リンク

- [Vivi Race — Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3241577976)
- [RWMod-Vivi — GitHub](https://github.com/gguake/RWMod-Vivi)
- [About.xml](https://github.com/gguake/RWMod-Vivi/blob/master/Mod/About/About.xml)
- [Race_Vivi.xml](https://github.com/gguake/RWMod-Vivi/blob/master/Mod/v1.6/Defs/Race/Race_Vivi.xml)
- [Body_Vivi.xml](https://github.com/gguake/RWMod-Vivi/blob/master/Mod/v1.6/Defs/Race/Body_Vivi.xml)
- [PawnRenderTree.xml](https://github.com/gguake/RWMod-Vivi/blob/master/Mod/v1.6/Defs/Race/PawnRenderTree.xml)
- [HAR互換patch](https://github.com/gguake/RWMod-Vivi/blob/master/Mod/v1.6/Patches/Compatiblity/Compatiblity_HAR.xml)

## 関連項目

- 上位索引: [reference-mods](/research/reference-mods/index.md)
- 前項: [Final rule](/research/reference-mods/09-Final-rule.md)
- 正規種族境界: [バニラ優先Shion種族実装境界](/design/52-バニラ優先Shion種族実装境界.md)
- 診断契約: [RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)
