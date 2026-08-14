---
type: "Implementation Specification"
title: "70. カエルム帰還Ending"
description: "軍功閾値によるServiceReturnとMark元本完済によるDebtFreeReturnを別Endingとして判定し、通常のバニラ脱出ではカエルム契約を解消しない。"
tags:
  - "caelavi"
  - "caelum"
  - "design"
  - "implementation"
  - "gameplay"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelum-return-endings"
canonical_scope: "product-mechanics"
content_layer: "implementation"
normative_basis:
  - "/world/60-カエラヴィ個人債務.md"
  - "/world/70-遠征共同体債務履行契約.md"
  - "/world/71-軍務貢献認定と帰還権.md"
  - "/design/64-カエラヴィ個人債務Scenario.md"
  - "/design/69-カエルム軍功認定契約.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 70. カエルム帰還Ending

カエルム帰還Endingは、プレイヤー共同体が代理返済契約から正規に帰還する二つの独立した完了経路を提供する。`ServiceReturn`は軍功、`DebtFreeReturn`はMark建て債務元本だけを判定し、一方の達成を他方の達成として記録しない。

## Ending Def

`CaelumReturnEndingDef`は各Endingについて次を明示する。

| データ | 内容 |
|---|---|
| `endingId` | `ServiceReturn`または`DebtFreeReturn`の安定ID |
| `contractSelector` | 対象となる共同体代理返済契約 |
| `serviceThresholdMinor` | ServiceReturnに必要な軍功。DebtFreeReturnでは値を持たない |
| `debtScope` | DebtFreeReturnで0を要求する個人債務Recordの範囲 |
| `taxClearancePolicyId` | 税を別途審査する場合だけ指定する方針 |
| `returnTransportProfileId` | 帰還に使用するGravshipまたは別の明示的輸送 |
| `creditsProfileId` | Ending名、説明、Credits表示 |

閾値、対象契約、債務範囲、輸送、Credits Profileを解決できない場合は別Endingまたはバニラ脱出へ置換せず、帰還要請を拒否する。税は債務元本へ合算せず、`taxClearancePolicyId`が存在する時だけ独立条件として表示する。

## ServiceReturn

`ServiceReturn`は共同体の認定軍功がDefの閾値以上であることを条件とする。

- 債務の開始元本、未返済元本、返済累計を変更しない。
- 返済額が0 Markでも達成できる。
- 未返済元本が開始元本と同額でも達成できる。
- Ending完了は軍務契約上の帰還許可であり、債務免除、完済、元本減額として記録しない。
- 完了Recordは帰還時点の未返済元本と返済累計をそのまま保存する。
- `DepartureCommitted`時、帰還Pawnの未返済`PersonalDebtRecord`は削除せず、債権者を変えずに`PostReturnPersonalDebt`状態へ移す。同時にEnding専用の契約改訂Recordを作り、帰還Pawnの`obligationId`だけを活動中の`ColonyRepaymentContract`から除外する。
- 帰還後の個人債務はカエルム政府と本人・家門の関係として存続する。共同体に帰還後も支払いを続けさせる場合は、Ending前に別の継続代理返済契約を明示し、帰還Endingから黙って生成しない。
- 帰還しないPawnと、その者に属する義務は活動中の共同体契約へ残す。全員帰還して対象義務がなくなった契約だけを`ClosedByAuthorizedReturn`へ移す。

## DebtFreeReturn

`DebtFreeReturn`は`debtScope`に含まれる全`PersonalDebtRecord.outstandingMarkMinor`が0であることを条件とする。

- 軍功は0でも達成できる。
- Credit、Silver資産、未使用信用枠を元本残高の代わりに数えない。
- 支払予約中、争議中、対象不明の債務を0とみなさない。
- 税義務は債務と別に表示し、Defが税清算を要求しない限りDebtFree判定へ黙って混ぜない。

## 帰還状態機械

```text
Ineligible → Eligible → ReturnAuthorized → Boarding → DepartureCommitted → Completed
                 ↘ Suspended                ↘ Cancelled
```

1. 台帳snapshotを固定してEnding条件を検証する。
2. 達成経路、軍功、元本、返済額、税、帰還対象Pawnを事前表示する。
3. プレイヤーが帰還要請を確定すると`ReturnAuthorized` Recordを作る。
4. 指定輸送へPawnと許可された積荷をプレイヤーが搭乗させる。
5. 出発成立時にEnding用TransactionをCommitし、同じ出発を再処理しない。
6. ServiceReturnでは帰還Pawnの義務を`PostReturnPersonalDebt`へ移し、共同体契約のEnding改訂を同じTransactionでCommitする。
7. 完了Recordを保存し、経路別Creditsを開始する。

搭乗取消、輸送破壊、帰還対象不在、契約状態変化では`Completed`にせず、条件を再検証する。Ending判定は対象Pawnを強制搭乗させず、残留者と対象外義務を事前表示する。

## 通常脱出との境界

宇宙船、Royalty、Archonexus、Anomaly、Odyssey等の通常バニラEndingまたは単なるMap外脱出は、`ColonyRepaymentContract`、債務元本、軍功、税、帰還許可を変更しない。バニラCredits開始をカエルム帰還成功として捕捉せず、`CaelumReturnCompletionRecord`を作らない。

カエラヴィが宇宙船でRimWorldを離れても契約は未解決のままである。バニラEndingとの同時成立を望む場合も、先にカエルム帰還の`DepartureCommitted`を完了する必要がある。

## Completion RecordとCredits

`CaelumReturnCompletionRecord`は次をWorld saveへ保存する。

- `completionId`、Ending ID、契約ID、完了tick
- 帰還Pawnと残留PawnのID
- 完了時の軍功、開始元本、未返済元本、返済累計、税状態
- 利用輸送と出発結果
- `ServiceReturn`では債務未完済のまま帰還したこと
- 帰還Pawnごとの`PostReturnPersonalDebt` ID、共同体契約から除外した義務ID、帰還後の債務者・債権者
- `DebtFreeReturn`では対象元本が0であること

Creditsは`軍功による帰還`または`完済による帰還`を明記し、支払額、軍功、帰還人数を表示する。ServiceReturnのCreditsへ`完済`または`債務免除`と表示しない。

## 性能と受入条件

- 条件は債務、軍功、税の正本残高がdirtyになった時と帰還画面を開いた時だけ再評価し、全Pawnまたは全Transactionを毎Tick走査しない。
- 軍功閾値達成・返済0・元本不変でServiceReturnを完了できることを確認する。
- 軍功0・全対象元本0でDebtFreeReturnを完了できることを確認する。
- 通常宇宙船脱出と全バニラEndingで債務Recordと契約状態が変わらず、カエルム完了Recordが作られないことを確認する。
- 同じ出発を保存・ロード後に再通知してもCompletion RecordとCreditsを二重生成しない。
- Boarding中の債務追加、税状態変化、Gravship破壊、帰還取消で不正にCompletedへ進まないことを確認する。
- ServiceReturn後も帰還Pawnの未返済元本、債権者、返済累計が`PostReturnPersonalDebt`へ同値で残り、活動中の共同体契約だけから除外されることを確認する。
- 一部だけが帰還した場合、帰還しないPawnの義務と共同体代理返済契約を変更しないことを確認する。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 個人債務Scenario: [カエラヴィ個人債務Scenario](/design/64-カエラヴィ個人債務Scenario.md)
- 世界内帰還権: [軍務貢献認定と帰還権](/world/71-軍務貢献認定と帰還権.md)
- 軍功認定: [カエルム軍功認定契約](/design/69-カエルム軍功認定契約.md)
- 財務台帳: [Mark・Credit・債務・税のWorld台帳](/design/67-Mark・Credit・債務・税のWorld台帳.md)
- 支援と帰還輸送: [カエルム支援注文と信用枠の状態機械](/design/68-カエルム支援注文と信用枠の状態機械.md)
- 軍務履行のゲームループ: [総力進化戦争のIdeology・軍務履行ループ](/design/73-総力進化戦争のIdeology・軍務履行ループ.md)
