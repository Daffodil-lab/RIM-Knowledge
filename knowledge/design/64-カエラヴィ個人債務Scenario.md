---
type: "Implementation Specification"
title: "64. カエラヴィ個人債務Scenario"
description: "カエラヴィ個人債務Scenarioは、身分または家門のDebtProfileからMark建て義務を明示的に解決し、共同体が本人に代わって返済する契約として開始する。"
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
  - "/world/66-カエルムMark.md"
  - "/world/70-遠征共同体債務履行契約.md"
  - "/design/23-パフォーマンス方針.md"
  - "/design/24-UIと情報予算.md"
  - "/design/67-Mark・Credit・債務・税のWorld台帳.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 64. カエラヴィ個人債務Scenario

カエラヴィ個人債務Scenarioは、開始Pawnの身分または家門に対応する`CaelumDebtProfileDef`から個人別のMark建て債務を作り、プレイヤー共同体が本人に代わってカエルム政府へ返済する`ColonyRepaymentContract`を開始する。債権者はカエルム政府であり、同盟ではない。共同体は債務者本人を所有せず、返済受託者として台帳上の支払義務を引き受ける。

## DebtProfile

各Scenarioは、使用する`CaelumDebtProfileDef`と、それを選択する身分・家門規則を明示する。

| データ | 内容 |
|---|---|
| `debtProfileId` | Profileの安定したDef ID |
| `assignmentBasis` | `Status`または`House` |
| `principalScope` | `PerPerson`または明示済みの`HouseShare` |
| `principalMarkMinor` | 個人へ登録するMark元本の最小単位整数 |
| `creditorId` | カエルム政府を示す債権者ID |
| `taxPolicyId` | 採用する場合だけ指定する別建て税方針 |
| `supportFacilityProfileId` | 利用可能な支援信用枠。初期支援品そのものではない |
| `registrationPolicyId` | 出生、加入、家門登録後の債務割当規則 |
| `returnPolicyId` | 軍功帰還と完済帰還を判定する規則 |

身分Profileは一般市民、男爵、伯爵、辺境伯、侯爵、大公、公爵、皇族等の表示区分を持てるが、金額を階級名から計算しない。家門Profileは、家の既存債務から当人へ割り当てる正確なMark額または持分をDefに持つ。`HouseShare`を等分と推定せず、同じ家門債務を全員へ重複登録しない。

一致するProfileが複数ある場合の優先順位もScenario Defに列挙する。Profile不在、同順位競合、負数、固定小数精度不一致、桁あふれがあるScenarioは開始を拒否する。一般市民、一億Mark、0 Mark等へ黙って置換しない。

登録時に解決した`debtProfileId`と元本を債務Recordへ固定する。開始後の叙爵、降爵、婚姻、家門移動は既存元本を自動再計算せず、変更する場合は理由と差額を持つ契約改訂Transactionを必要とする。

## 個人債務と共同体契約

World台帳は次を正本として保存する。

| Record | 所有するデータ |
|---|---|
| `PersonalDebtRecord` | `obligationId`、`debtorId`、身分・家門、Profile、開始元本、未返済元本、返済累計、登録時点 |
| `ColonyRepaymentContract` | `contractId`、共同体ID、支払口座ID、対象`obligationId`一覧、債権者、発効時点、契約状態 |
| `ContractAmendmentRecord` | 対象契約、追加・除外する義務、差額、根拠、承認時点 |

Scenario開始時は次の順で作成する。

1. 開始Pawnごとに身分・家門情報とProfileを解決する。
2. 全Profile、Mark精度、債権者、登録方針、支払口座を検証する。
3. 各債務者へ一件の`PersonalDebtRecord`を作る。
4. 共同体の専用支払口座を指定した`ColonyRepaymentContract`へ義務を登録する。
5. 全件を一つの開始TransactionとしてCommitし、その後にScenario初期支援を生成する。

いずれか一件を解決できない場合はPawnだけを無債務で開始せず、開始Transaction全体を拒否して理由を表示する。加入または出生後の登録は`registrationPolicyId`を使い、Profileを解決できない個人を`登録保留`として表示する。保留を0 Markの義務として確定しない。

死亡、行方不明、Faction離脱、Map移動、Caravan移動、宇宙船搭乗は債務または共同体の代理返済契約を消さない。契約からの除外は明示的な改訂、完済、またはカエルム帰還Endingの完了Recordだけが行う。

## 代理返済Transaction

返済は共同体の専用支払口座から、選択した一件または複数の個人債務へMarkを充当する。

1. 支払ID、共同体口座、対象義務、各充当額、税とは別の合計を確定する。
2. Mark残高と各未返済元本を検証し、支払額を予約する。
3. 口座引落しと債務元本減額を一つのWorld台帳TransactionとしてCommitする。
4. 個人別残高、共同体合計、返済累計を結果として返す。

同じ支払IDの再送は保存済み結果を返し、二重引落しと二重減額を行わない。残高を超える要求、債務を超える過払い、未登録義務、通貨不一致は切下げず拒否し、有効な最大額を表示する。物理Silverを直接消す処理は持たず、SilverをMarkへ交換する場合は別の成立済み交換Transactionを先に完了する。

## 軍功、税、支援との分離

- 軍功は独立した軍功認定Recordへ加算し、個人債務の元本、未返済残高、返済累計を変えない。
- 軍功帰還は返済額0 Mark、開始元本と同額の未返済残高でも達成できる。
- 同盟Creditは支援要請へ使用できるが、Mark建て債務元本へ充当または換金して返済できない。
- 税は`TaxLiabilityRecord`へ記録し、納税しても債務元本を減らさない。
- 初期支援および追加支援は支援注文と信用枠が所有し、債務元本から品目や数量を推測しない。
- 追加借入は新しい債務Recordまたは既存契約の明示的改訂として作り、支援受領だけで残高を黙って増やさない。

## UI

Scenario説明と債務画面は最低限、次を日本語で表示する。

- 債権者、共同体が代理返済者であること、本人の人格や身体を担保にしないこと
- 各個人の身分・家門、適用Profile、開始元本、未返済元本、返済累計
- 共同体合計、支払口座のMark残高、選択した充当順序
- 税、軍功、Credit、支援信用枠を債務元本とは別の欄で表示すること
- 軍功帰還と完済帰還の条件、および通常のバニラ脱出では契約が解消されないこと
- Profile未解決、口座不足、契約競合、桁あふれ等の拒否理由

短縮表示と正確な固定小数表示を切り替えられるようにし、floatまたはdoubleへ変換して元本を丸めない。

## 保存、性能、受入条件

- Profile ID、義務ID、契約ID、共同体口座、残高、返済Transaction、改訂RecordをWorld saveへ保存する。
- 未完Transactionはロード後に自動再引落しせず、予約とJournalから再確認する。
- 出生、加入、身分・家門登録、契約改訂、支払、帰還判定をイベント契機に処理し、全Pawnまたは全口座を毎Tick走査しない。
- 債務者索引、家門索引、契約索引から対象Recordを直接解決し、UI集計は画面表示時またはdirty時だけ更新する。
- Status、House、HouseShareの各Profile、複数人開始、未解決Profile、部分返済、完済、過払い拒否、軍功加算、死亡・離脱、保存・ロードを検証する。
- 軍功加算後も元本が不変であること、代理返済時だけ指定額が減ること、同じ支払IDで二重減額しないことを確認する。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 個人債務設定: [カエラヴィ個人債務](/world/60-カエラヴィ個人債務.md)
- 共同体契約: [遠征共同体債務履行契約](/world/70-遠征共同体債務履行契約.md)
- 国家債務: [カエルムの対同盟債務](/world/58-カエルムの対同盟債務.md)
- 財務正本: [Mark・Credit・債務・税のWorld台帳](/design/67-Mark・Credit・債務・税のWorld台帳.md)
- 追加支援: [カエルム支援注文と信用枠の状態機械](/design/68-カエルム支援注文と信用枠の状態機械.md)
- 軍功認定: [カエルム軍功認定契約](/design/69-カエルム軍功認定契約.md)
- 帰還Ending: [カエルム帰還Ending](/design/70-カエルム帰還Ending.md)
