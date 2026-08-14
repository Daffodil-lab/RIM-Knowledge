---
type: "Implementation Specification"
title: "67. Mark・Credit・債務・税のWorld台帳"
description: "カエルム経済のMark、同盟Credit、個人債務、税義務を非Thingの固定小数World台帳へ集約し、専用口座と冪等Transactionで決済する。"
tags:
  - "caelavi"
  - "caelum"
  - "union"
  - "design"
  - "implementation"
  - "economy"
  - "currency"
  - "performance"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelum-world-financial-ledger"
canonical_scope: "product-architecture"
content_layer: "implementation"
normative_basis:
  - "/world/39-同盟通貨.md"
  - "/world/66-カエルムMark.md"
  - "/world/67-CreditとMarkの二国間清算.md"
  - "/world/58-カエルムの対同盟債務.md"
  - "/world/60-カエラヴィ個人債務.md"
  - "/design/23-パフォーマンス方針.md"
  - "/design/64-カエラヴィ個人債務Scenario.md"
generated:
  by: "process:user-decision"
  at: "2026-08-14T00:00:00Z"
  precision: "date"
---

# 67. Mark・Credit・債務・税のWorld台帳

`CaelumFinancialLedger`は、プレイヤー共同体が保有するCaelum Mark、同盟Credit、カエルム政府への個人債務、税義務を所有する唯一の`WorldComponent`である。MarkとCreditは物理貨幣ではなく、台帳上の決済残高と信用・資源利用権であり、Silver stackまたは資産価値へ変換して保存しない。

## 数値表現と交換比率

- MarkとCreditは、それぞれ`1単位 = 100 minor unit`の符号付き64 bit整数で保存する。
- 加算、減算、乗算、税計算、交換はchecked整数演算を使い、floatとdoubleを正本計算へ使用しない。
- 公定価額は`1 Mark = 1 Silver`、二国間清算比率は`1 Credit = 100 Mark`とし、`CurrencyRateDef`へ整数の分子・分母で保持する。
- MarkからCreditへの自由交換は許さない。Creditを付与できるTransaction種別をDefへ列挙し、認定済みCreditをMark建て価額へ清算する方向だけを標準経路とする。
- 端数は取引ごとの`RoundingPolicyDef`で明示し、既定は受取側へ過払いしないminor unit未満切捨てとする。切捨て額もTransactionへ記録する。
- 負残高を許すのは信用枠から生成した明示的な債務口座だけとし、通常のMark口座とCredit口座を不足時に自動当座貸越へ変えない。

桁あふれ、無効な交換比率、負数禁止口座の負転、通貨不一致を検出したTransactionは全体を拒否する。上限値、0、近似値へ丸めない。

## 正本Record

| Record | 内容 |
|---|---|
| `FinancialAccountRecord` | 口座ID、所有主体、通貨、用途、利用可能残高、予約残高、状態 |
| `PersonalDebtRecord` | 債務ID、債務者、債権者、Mark開始元本、未返済元本、返済累計、Profile |
| `TaxLiabilityRecord` | 税ID、課税根拠、課税標準、税率、Mark税額、期限、支払状態 |
| `LedgerTransactionRecord` | Transaction ID、全仕訳、予約、CommitまたはRollback、時刻、根拠Record |
| `CurrencyRateRecord` | 使用した公定比率Def、分子、分母、丸め結果 |

共同体は少なくとも通常Mark口座、同盟Credit口座、文化輸出Credit決済口座、債務代理返済口座、支援信用枠口座を別IDで持つ。UI上で合算表示できるが、用途制限を失う一つの残高へ統合しない。

債務元本、税額、Credit利用枠、Mark残高は互いの派生値ではない。納税は債務を減らさず、軍功はMarkまたはCreditを生成せず、Credit使用は同盟が認める支援権を消費する。Mark建て債務元本の返済TransactionはMarkだけを受け付け、Creditを返済へ充当せず、CreditをMarkへ換金して返済する経路も設けない。二国間の公定比率は認定取引の価額記録と支援清算に使い、自由交換または元本返済権を意味しない。

## Transaction境界

全決済は次の状態を進む。

```text
Draft → Validated → Reserved → Committed
                   ↘ Rejected
             Reserved → RolledBack
```

`Validated`は全口座、通貨、残高、用途制限、税、交換比率、参照先を固定する。`Reserved`は利用可能残高だけを減らし、相手口座または債務をまだ更新しない。`Committed`は一つのJournal操作で全仕訳を確定する。同じTransaction IDの再送は保存済み結果を返す。

MarkまたはSilver決済の源泉徴収は、総額から税額を引き、受取額とカエルム政府税Recordを同時に確定する一つのTransactionとする。Credit認定取引はGross Creditを全額記帳し、同じMark-equivalentからMark建て`TaxLiabilityRecord`を別発生させ、Creditを控除または換金しない。税Defを解決できない場合は無税として通さず、課税対象取引を拒否する。

## 資産価値との境界

- 台帳Record、Mark、Credit、未使用信用枠、軍功は`Thing`を生成せず、`MarketValue`、`WealthWatcher`、Caravan mass、Raid pointsへ加算しない。
- Mark紙幣、Credit token、不換紙幣の物理通貨Defを作らない。
- CreditまたはMarkで受領した物資、設備、Pawn用装備、胚、卵子等は、Mapまたは所有Containerへ実在した時点から通常のバニラ資産価値を持つ。
- 物理Silverはバニラ資産であり、Markとの交換成立後に消費または受領したSilverの増減は通常どおり資産価値へ反映される。

## 保存、失敗結果、性能

- 全正本Record、次の予定税期限、未完予約、Journal sequenceをWorld saveへ保存する。
- ロード時はJournalから未完予約を再構築し、結果不明の支払を再実行しない。
- 参照不能な口座、通貨、税Def、債務、所有主体を別口座へ移さず、対象Transactionを`RecoveryRequired`にする。
- 口座残高、債務残高、期限QueueをID索引し、画面表示のために全Transaction履歴を毎回再集計しない。
- 取引、税期限、契約変更、支援配送、軍功認定をイベント駆動で記帳し、Worldまたは全Pawnを毎Tick走査しない。
- Journal表示はページ化し、閉じている間は行整形を行わない。

## 受入条件

1. 認定済み1 CreditについてMark建て価額100を記録し、実Mark残高を自動生成せず、100 Markだけを保有してもCreditを生成できないこと、minor unit端数、最大想定債務、桁あふれ拒否を整数だけで再現できる。
2. 同じTransaction IDを保存・ロードを挟んで再送しても残高、税、債務を二重更新しない。
3. Mark、Credit、債務、税を増減してもコロニー資産価値が変化せず、配送された物理品だけが通常資産になる。
4. 税、返済、文化輸出、支援購入がそれぞれ指定専用口座へ記帳され、用途制限を越えて自動相殺されない。
5. 10万件のJournalを持つ保存で、通常残高照会が履歴件数に比例せず、待機中の毎Tick処理を追加しない。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- Markの正史: [カエルムMark](/world/66-カエルムMark.md)
- Creditの正史: [同盟Credit](/world/39-同盟通貨.md)
- 二国間清算: [CreditとMarkの二国間清算](/world/67-CreditとMarkの二国間清算.md)
- 個人債務Scenario: [カエラヴィ個人債務Scenario](/design/64-カエラヴィ個人債務Scenario.md)
- 支援注文: [カエルム支援注文と信用枠の状態機械](/design/68-カエルム支援注文と信用枠の状態機械.md)
- 軍功認定: [カエルム軍功認定契約](/design/69-カエルム軍功認定契約.md)
- 文化輸出査定: [買い手別文化輸出査定と源泉税](/design/72-買い手別文化輸出査定と源泉税.md)
- 性能方針: [性能方針](/design/23-パフォーマンス方針.md)
