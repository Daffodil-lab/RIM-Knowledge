---
type: "Implementation Specification"
title: "56. Shion標準遠征身体の実装仕様"
description: "Shion標準遠征身体の器官、能力値、欠損状態、休息、Anomaly拒絶、心情と将来拡張点を定める。"
tags:
  - "shion"
  - "design"
  - "implementation"
  - "pawn"
  - "body"
  - "anomaly"
organization_groups:
  - "independent-frontier"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/shion-standard-expedition-body"
canonical_scope: "product-mechanics"
content_layer: "implementation"
normative_basis:
  - "/world/03-シオンという人類.md"
  - "/world/28-狐娘型の共有身体.md"
  - "/world/29-シオンの無性機械身体.md"
  - "/design/52-バニラ優先Shion種族実装境界.md"
generated:
  by: "process:user-decision"
  at: "2026-07-31T00:00:00Z"
  precision: "date"
---

# 56. Shion標準遠征身体の実装仕様

Shion標準遠征身体は、人間と同じ外皮、頭部、四肢、骨格、顎、舌を持つ製造身体である。外皮の内側では、生物学的な心臓、脳、腎臓、肺、胃、肝臓を使用せず、リアクター、人工脳、二基の流体再処理装置と循環媒体Cellが機能する。目、狐耳、鼻は健康UIでもその名称を維持する。

## 身体と欠損状態

| 対象 | 正常状態 | 一部または全損時 |
| --- | --- | --- |
| リアクター | 動力源 | 破壊で死亡 |
| 人工脳 | 意識と情報処理 | 破壊で死亡 |
| 流体再処理装置二基 | 能力100% | 一基喪失で能力50%と免疫獲得速度低下、二基喪失で生存したまま移動不能 |
| Cell | 出血する循環媒体 | 完全喪失で生存したまま移動不能。自然回復する |
| 狐尾 | 姿勢制御と表示 | 喪失時のMoveSpeedを正常値の85%にし、尾を描画しない |
| 狐耳二基 | 聴覚と表示 | 両方喪失時に耳を描画しない |

傷は出血して自然治癒するが、永久的な傷跡を形成しない。痛み倍率は100%である。身体耐久力はHuman基準の150%とする。

## 基本能力

| 項目 | 採用値 |
| --- | ---: |
| Mass | 30 kg |
| MoveSpeed | 5 |
| CrawlSpeed | 1 |
| FilthRate | 0 |
| Flammability | 0% |
| WorkSpeedGlobal | 150% |
| SocialImpact | 150% |
| RangedCooldownFactor | 75% |
| AimingDelayFactor | 75% |
| ImmunityGainSpeed | 2,500% |
| CarryingCapacity | 100 |
| PawnBeauty | 3 |
| MarketValue | 3,000 |
| RoyalFavorValue | 20 |
| SocialIdeoSpreadFrequencyFactor | 500% |
| CertaintyLossFactor | 50% |

通常の感染症に罹患しない。生殖能力を持たず、生物学的に老化しない。Food Needと栄養失調は持たないが、OmnivoreHumanの食性を残し、自発的に食べた対象の生食や種類を理由に不満を持たず、食中毒を起こさない。肉と皮の産出量は、明示的な採取決定が行われるまで0とする。

## 休息

Rest Needは存在し、通常どおり眠る。疲労と睡眠要求は残す一方、Rest値に正の下限を設け、極度の疲労だけを理由とする衰弱を起こさない。Food Needを持たないため、バニラ栄養失調の心情を二倍にする条件は発生しない。将来Cellまたは保守資源の欠乏Needを採用する場合、その欠乏に専用心情を割り当てる。

## Anomaly境界

ShionはShamblerにならず、Inhumanizedを維持せず、モノリスまたはオベリスク由来の有機的な追加身体部位を維持せず、Anomalyから有効な複製個体を得られない。Shambler拒絶はRaceProperties、既知の変異拒絶はGene Defの免疫一覧と追加身体部位除去で実装する。複製処理が候補Pawnを生成した場合は、`Pawn_Shion`が公開`Notify_DuplicatedFrom`で識別し、`SpawnSetup`直後に消去する。動作に寄与しない専用marker Hediffは持たない。

## 心情と意気込み拡張

Shionは「人間よりも人間らしい」により常時心情+8を得る。奴隷であるShionは、身体の自己所有と人格を否定された状態として専用心情-46を追加で得る。

将来の専用意気込みは、心情値から`WorkSpeedGlobal`倍率を求めるDef所有`SimpleCurve`へ接続する。意気込みの段階、文章、倍率が採用されるまで曲線は全域1.0とし、現在の基本作業速度150%を変えない。必要娯楽種別+3は拡張値として保持するが、バニラにPawn単位の必要種別数がないため、意気込みまたは専用Needの仕様と同時に動作を確定する。

## 状態遷移と保存

`正常 → 一基流体再処理喪失 → 二基喪失による移動不能 → 一基復旧`

`正常 → 出血 → Cell喪失増加 → 完全喪失による移動不能 → 自然回復`

欠損部位、Cell喪失、流体再処理停止、Gene、XenotypeはPawn健康状態として保存する。ロード後の保守処理は同じ状態から再開し、停止Hediffを重複生成しない。

## 失敗結果と性能条件

- 身体Defに二基の流体再処理装置がない場合は通常状態へ黙示的縮退せず、検証失敗にする。
- リアクターまたは人工脳の破壊が死亡にならない場合と、Cellまたは流体再処理の完全喪失が死亡になる場合は実装不具合とする。
- Anomaly保護が解決できない場合は複製や有機変異を許可せず、ロードまたは受入検証の失敗として扱う。
- 健康保守はShion自身だけを対象とする。出血変換はGene tickで即時に行い、その他の状態確認は60 tick間隔とし、MapとPawn一覧を走査しない。

## 関連項目

- 上位境界: [バニラ優先Shion種族実装境界](/design/52-バニラ優先Shion種族実装境界.md)
- Shion: [シオンという人類](/world/03-シオンという人類.md)
- 共有身体: [狐娘型の共有身体](/world/28-狐娘型の共有身体.md)
- 無性身体: [シオンの無性機械身体](/world/29-シオンの無性機械身体.md)
- 診断: [RimWorldログ・性能診断契約](/design/53-RimWorldログ・性能診断契約.md)
