---
type: "Implementation Specification"
title: "64. カエラヴィ個人債務Scenario"
description: "カエルム政府へ負う各カエラヴィの個人債務をInt64の台帳Recordとして開始し、Scenarioごとの初期支援、納税、返済へ接続する。"
tags:
  - "caelavi"
  - "caelum"
  - "design"
  - "implementation"
  - "gameplay"
  - "economy"
  - "currency"
  - "ui"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelavi-personal-debt-scenario"
canonical_scope: "product-mechanics"
content_layer: "implementation"
normative_basis:
  - "/world/58-カエルムの対同盟債務.md"
  - "/world/59-カエルムの戦争依存経済.md"
  - "/world/60-カエラヴィ個人債務.md"
  - "/design/23-パフォーマンス方針.md"
  - "/design/24-UIと情報予算.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 64. カエラヴィ個人債務Scenario

カエラヴィ個人債務Scenarioは、プレイヤー共同体に属する各カエラヴィがカエルム政府へ負う債務を開始条件として作成する。これはカエルム国家が同盟へ負う総債務そのものではなく、総債務を現在と将来のカエラヴィへ配賦した結果として、各個人へ割り当てられた支払義務である。

## 正本データ

債務は物理Silver stackではなく、World単位の台帳が個人別債務Recordを保存する。

| データ | 内容 |
|---|---|
| `obligationId` | 個人別債務を識別する安定ID |
| `debtorId` | 債務者であるカエラヴィ個人の安定ID |
| `creditorId` | カエルム政府を示す安定した債権者ID |
| `principalPerDebtorSilver` | 登録時に一個人へ割り当てる元本 |
| `outstandingSilver` | 未返済残高 |
| `paidSilver` | Commit済み返済累計 |
| `assignedAtTick` | 個人債務を登録した時点 |
| `taxPolicyId` | Scenarioが納税義務を採用する場合の方針Def |
| `nextDueTick` | 次の納期限。納税を採用しない場合は値を持たない |
| `supportProfileId` | Scenario固有の初期支援 |
| `transactionRecords` | 支払ID、要求額、予約額、Commit結果、失敗理由 |

Silver額は32 bit整数へ格納せず、少なくとも符号付き64 bit整数で保存、表示、加減算する。残高をPawnのHediff、Need、Memoryへ複製せず、World台帳の`debtorId`別Recordを唯一の所有者とする。

Scenario開始時に、対象Scenarioへ属する各カエラヴィへ一件ずつ債務Recordを作る。開始後に出生またはカエルム法上の個人登録が成立したカエラヴィにも、登録通知を契機として同じ一人分の元本を一度だけ割り当てる。加入、Map移動、Caravan移動、保存・ロードで既存`debtorId`のRecordを重複生成しない。離脱またはFaction変更だけで個人債務を消去しない。

## 候補プリセット

次の二値を候補プリセットとして提供する。

| 表示 | `principalPerDebtorSilver` |
|---|---:|
| 一億Silver | 100,000,000 |
| 百億Silver | 10,000,000,000 |

どちらも暗黙の既定値にしない。ScenarioまたはMOD設定が一個人分の債務額を明示しない場合、債務Scenarioを有効化せず、0、一億、百億のいずれにも黙って置換しない。カスタム値を許可する場合も、0以上かつInt64範囲内であることを検証する。複数人の合計を表示する時は、各RecordをInt64の検査付き加算で集計する。

## 初期支援と納税

初期支援の品目、数量、技術解禁、設備、口座残高は`supportProfileId`が所有し、債務額から自動生成しない。同じ債務プリセットでも、Gravship、地上拠点、軍務遠征等のScenarioごとに異なる初期支援を指定できる。

納税額、納期、猶予、滞納結果は`taxPolicyId`が所有する。税方針を持たないScenarioへ徴税官または納税イベントを自動追加しない。債務元本、通常税、延滞額、任意返済をUI上で別に表示し、一つの不明な減額へまとめない。

## 返済Transaction

返済はプレイヤーが指定した債務者と額について次の順で処理する。

1. 対象個人の現在の未返済残高と支払可能なSilverを確認する。
2. 債務者、支払元、額、支払後残高を事前表示する。
3. 一意の支払IDでSilverを予約する。
4. Silver消費と対象個人の債務残高減額を一回のCommitとして確定する。
5. 支払額、個人残高、共同体合計、次の納期を結果として返す。

同じ支払IDの再送は保存済み結果を返し、Silver消費と残高減額を二重実行しない。残高を超える支払要求は残額へ黙って切り下げず、確認画面へ有効な最大額を返す。

戦争、軍事貢献、占領地、芸術品輸出を自動的な返済額へ換算しない。換算を採用する場合は、別の明示的な価値評価契約とTransactionを必要とする。

## UI

Scenario説明と債務画面は最低限、次を日本語で表示する。

- 債権者がカエルム政府であること
- これはカエルム国家債務そのものではなく、プレイヤー側の割当債務であること
- 各債務者の開始元本、未返済残高、返済累計と共同体合計
- 初期支援が返済済み贈与ではなくScenario条件であること
- 納税を採用する場合の次回額、納期、猶予、滞納結果
- 支払いに使用するSilverの所有者と不足理由

一億、百億等の短縮表示と正確な整数表示を切り替えられるようにし、浮動小数点への変換で残高を丸めない。

## 保存と失敗結果

- `obligationId`、`debtorId`、登録時点、残高、支払記録、税方針、次回納期をWorld saveへ保存する。
- 未完Transactionを保存した場合、ロード後にSilverを自動再消費せず、予約と台帳結果から再確認する。
- 債権者、税方針、支援Profileを解決できない場合、別Factionまたは0額へ置換せずScenario初期化を拒否する。
- Silver不足では所有物を無作為売却せず、支払を開始しない。
- Int64範囲外、負数、桁あふれを検出した場合、残高を上限、0、負数へ丸めず取引を拒否する。
- 滞納結果を解決できない場合、即座に襲撃、称号喪失、Pawn没収等を発生させず、未処理義務と不足Defを表示する。

## 性能条件と受入条件

- 債務と税はWorld台帳の個人別Recordと予定イベントから処理し、全Pawn、全Silver、全Caravanを毎Tick走査しない。
- 出生、個人登録、加入通知で対象Pawn一人だけを検査し、`debtorId`索引から既存Recordを定数時間で確認する。
- 納期Queueは次回期限だけを索引し、債務画面を閉じている間は表示集計を更新しない。
- Silver集計は選択した支払経路の在庫Viewを使い、全Map Thingを独自走査しない。
- 一億と百億の両プリセットで複数人開始、出生・新規登録、部分返済、全額返済、支払失敗、保存・ロードを実行し、桁あふれ、債務Recordの二重生成、二重減額がないことを確認する。
- 税あり・税なし、異なる初期支援のScenarioが同じ債務正本を共有せず、それぞれ指定値から開始することを確認する。

## 関連項目

- 個人債務設定: [カエラヴィ個人債務](/world/60-カエラヴィ個人債務.md)
- 国家債務: [カエルムの対同盟債務](/world/58-カエルムの対同盟債務.md)
- 戦争経済: [カエルムの戦争依存経済](/world/59-カエルムの戦争依存経済.md)
- UI方針: [操作画面と情報予算](/design/24-UIと情報予算.md)
