---
type: "Product Design"
title: "74. カエラヴィMODのCore・拡張製品境界"
description: "カエラヴィMODは、バニラと公式DLCの既存状態へ単体で投影できる種族・身体・通常装備をCoreへ置き、横断状態、台帳、政治前例、戦役、自動化を拡張MODへ分離する。"
tags:
  - "caelavi"
  - "caelum"
  - "design"
  - "architecture"
  - "implementation"
  - "gameplay"
  - "economy"
  - "ui"
  - "rimworld"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelavi-mod-core-extension-boundary"
canonical_scope: "product-architecture"
content_layer: "implementation"
generated:
  by: "process:user-decision"
  at: "2026-08-18T00:00:00Z"
  precision: "date"
normative_basis:
  - "/design/07-製品ファミリーの新しい境界.md"
  - "/design/59-バニラ優先カエラヴィ種族実装境界.md"
  - "/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md"
  - "/design/63-フリーカ・コーラと軍用複合刺激剤の実装境界.md"
  - "/design/64-カエラヴィ個人債務Scenario.md"
  - "/design/65-帝国軍務教範の状態機械.md"
  - "/design/66-帝国軍務教範の一括操作境界.md"
  - "/design/67-Mark・Credit・債務・税のWorld台帳.md"
  - "/design/73-総力進化戦争のIdeology・軍務履行ループ.md"
---

# 74. カエラヴィMODのCore・拡張製品境界

カエラヴィMODは、バニラと公式DLCの既存機構へ単体で投影できる要素をCore MODへ置き、それ以外をCore前提の拡張MODへ置く。Coreは通常のPawn、Thing、建築、Recipe、Gene、Xenotype、薬物、Ideology要素を成立させる。拡張MODは、複数の正本を束ねる状態、政治的判断、台帳、戦役、自動化、専用管理画面を所有する。

この境界は、既存の世界設定・種族実装・債務・軍務教範・財務台帳・総力進化戦争ループの内容を再定義しない。各概念の正本は既存ownerに残し、本書はそれらをどの製品へ配置するかだけを所有する。Shion Race: Core、Kombinat、Red Star、The Hiveの製品境界も変更しない。

## 判定基準

### Coreへ置く条件

次の条件をすべて満たす要素をCoreへ置く。

- Caelavi Coreと採用済みの公式DLCだけで成立する。
- `ThingDef`、`PawnKindDef`、`FactionDef`、`RecipeDef`、`GeneDef`、`XenotypeDef`、`HediffDef`、`Ideology`、通常の`Job`、`Quest`、`Ritual`、標準Pawn描画など、既存の公開機構へ投影できる。
- 変化後の状態を、バニラ／公式DLCのtracker、Def、個別のPawn、Thing、建築、Recipe、方針が正本として所有する。
- 単体のPawn、Thing、建築、薬物、方針、静的Scenarioとして通常プレイへ参加できる。
- Core独自の状態がある場合も、単体要素の定義・表示・生成・使用・保存に限定される。
- 全Pawn、全Map、全World Pawnを毎Tick走査する独自処理を成立条件にしない。

### 拡張MODへ置く条件

次のいずれかに該当する要素を拡張MODへ置く。

- 複数Pawn、Map、Faction、World上の主体をまたぐ永続状態を正本として所有する。
- `MapComponent`、`WorldComponent`、Profile、状態機械、Transaction、前例Record、台帳、戦役進行を追加する。
- 一括命令、横断自動化、専用Relay、隊形、Queue、トップレベル管理UIを必要とする。
- 政治的判断、占領、返済、信用枠、軍功、税、支援、戦後前例、勝敗進行など、単体Pawnや単体Thingを超える結果を確定する。
- 既存のバニラ機構を呼び出していても、その結果を独自の横断状態へ記録し、後続の制度・戦役・台帳へ接続する。
- 外部MODのAPI、Def、Assembly、保存形式との接続を必要とする。

バニラAPIを使用しているかどうかだけでは判定しない。判定の第一条件は、APIが更新する状態の所有者である。単体状態をバニラまたは公式DLCが所有する薄いAdapterはCoreに置けるが、複数主体を束ねる正本と遷移を追加する処理は拡張MODに置く。

## 依存方向

依存先を右に置く。

```text
拡張MOD → カエラヴィCore
対象MOD別互換アドオン → カエラヴィCoreまたは拡張MOD + 対象MOD
```

Coreは拡張MODを要求しない。拡張MODはCoreの公開Def、安定ID、公開状態だけを利用し、CoreのPawn、Thing、tracker、Recipe、Gene、Xenotypeの正本を置き換えない。対象MOD別互換アドオンは対象MODがない環境で読み込まず、Coreと拡張MODの通常機能を壊さない。

## 現行要素の初期分類

| 要素 | 配置 | 境界 |
|---|---|---|
| `CA_Caelavi`、Human継承、標準Pawn、通常健康・仕事・装備・Portrait | Core | `ThingDef ParentName="Human"`と標準Pawn処理を維持する。種族識別、Gene描画、保存は既存の種族実装ownerへ従う。 |
| 六系統のGene／Xenotype、`CA_FunctionalWings`、`CA_OpenAirSacs` | Core | Biotechの`GeneDef`、`XenotypeDef`、標準render node、公式環境評価へ投影する。独自の全Pawn常駐状態や並行曝露を持たない。 |
| 軍務ゼノジャームのGene、xenogerm工程、排他・代謝規則 | Core | 既存のBiotech xenogerm工程とGene効果として単体Pawnへ適用する。軍務教範の部隊状態や軍功台帳は所有しない。 |
| 通常の武器、防具、服、家具、食事、設備、Recipe、通常研究 | Core | 通常の`ThingDef`、`RecipeDef`、Bill、WorkGiver、研究、資産価値へ接続する。専用Relayや横断在庫台帳は含めない。 |
| フリーカ・コーラ、軍用複合刺激剤、通常の薬物方針 | Core | バニラの薬物、Hediff、Ingest、Recipe、DrugPolicyを拡張する単体コンテンツとして扱う。軍務態勢からの一括服用は拡張側へ置く。 |
| バニラIdeologyの既存Meme、Precept、Role、Ritualの単体利用 | Core | 既存のIdeology正本へ投影し、国家全体の政治状態や前例台帳を追加しない。 |
| `CA_Meme_TotalEvolutionaryWar`、`CA_Precept_*`、戦後前例、世界戦勝記念日 | 拡張MOD | 固有Ideology、当事者Memory、Event、Ritual、軍功・支援・戦後判断を接続する横断ループを所有する。 |
| カエラヴィ個人債務Scenario、`PersonalDebtRecord`、`ColonyRepaymentContract` | 拡張MOD | Scenarioを入口にWorld台帳、共同体契約、返済Transaction、帰還判定を開始する。単発の開始Pawn生成だけをCoreへ移してはならない。 |
| 帝国軍務教範の状態機械・一括操作・Profile・Relay・隊形 | 拡張MOD | バニラ方針やJobを呼び出しても、`MapComponent`、`WorldComponent`、Queue、遷移、結果Record、管理UIを独自に所有する。 |
| Mark、Credit、債務、税のWorld台帳 | 拡張MOD | 複数口座、Journal、Transaction、税、元本、Credit、軍功の分離と保存を所有する。既存の各財務正本を複製・合算しない。 |
| 支援注文、信用枠、軍功認定、帰還Ending | 拡張MOD | 支援要請、Raid／Quest認定、信用枠、債務、帰還条件を独自の状態機械と正規Transactionへ接続する。 |
| 文化輸出、買い手別査定、源泉税、文化後援 | 拡張MOD | バニラ品質・Thing売却を利用しても、真正性Record、買い手Policy、Credit／Mark清算、税Transactionを追加する。 |
| 外部MOD互換、Vehicle Framework／Combat Extended等のAdapter | 別アドオン | 対象MODごとに依存と保存・Def接続を分離し、Coreや主要拡張の必須依存にしない。 |

## 保存・失敗・性能条件

- Coreは、バニラ／公式DLCの保存責務または単体Pawn・Thing・建築の保存へ状態を委ねる。Core独自値は単体要素に限定する。
- 拡張MODは、横断Record、安定ID、状態遷移、Transaction、ロード後の再構築、不明結果の再確認を所有する。Core状態を第二の台帳へ複製しない。
- Core要素のDef、Gene、Xenotype、Recipe、描画nodeが欠落した場合、別の系統・別の薬物・別の装備へ黙って縮退させず、生成またはロードの失敗理由を返す。
- 拡張MODの台帳、軍務、支援、前例、戦役は、無効な参照、重複Transaction、保存途中の不明結果を黙って確定せず、拒否または再確認待ちへ置く。
- Coreは待機中に全Pawn、全Map、全World Pawnを走査しない。拡張MODはイベント、dirty契機、有界Queue、対象Record索引を使い、性能予算を実装後に同一セーブの無効・有効差分で測定する。

## 本書が変更しない事項

本書は、既存の各ownerが定めるGene配列、Race値、飛行条件、軍務ゼノジャームの効果、債務額、台帳Transaction、教範状態遷移、Ideologyの選択肢、支援枠、文化査定、外部MOD APIを変更しない。個別のpackageId、Assembly名、拡張MODの正式名称、公開版の分割数は専用の配布仕様で確定する。

## 関連項目

- 製品ファミリー: [製品ファミリーの新しい境界](/design/07-製品ファミリーの新しい境界.md)
- 種族境界: [バニラ優先カエラヴィ種族実装境界](/design/59-バニラ優先カエラヴィ種族実装境界.md)
- 標準身体: [カエラヴィ標準身体の実装仕様](/design/60-カエラヴィ標準身体の実装仕様.md)
- 軍務ゼノジャーム: [カエラヴィ軍務ゼノジャーム共通実装契約](/design/62-カエラヴィ軍務ゼノジャーム共通実装契約.md)
- 個人債務: [カエラヴィ個人債務Scenario](/design/64-カエラヴィ個人債務Scenario.md)
- 軍務教範: [帝国軍務教範の状態機械](/design/65-帝国軍務教範の状態機械.md)、[帝国軍務教範の一括操作境界](/design/66-帝国軍務教範の一括操作境界.md)
- 財務台帳: [Mark・Credit・債務・税のWorld台帳](/design/67-Mark・Credit・債務・税のWorld台帳.md)
- 総力進化戦争: [総力進化戦争のIdeology・軍務履行ループ](/design/73-総力進化戦争のIdeology・軍務履行ループ.md)
- 所有者規則: [知識所有者マップ](/governance/ownership-map-知識所有者マップ.md)

## 出典

- ユーザー決定「バニラの延長線にある要素だけをCore MODへ置き、他の要素は拡張MODへ分類する」
- 現行のカエラヴィ種族、身体、軍務、債務、台帳、文化、Ideology各正本
