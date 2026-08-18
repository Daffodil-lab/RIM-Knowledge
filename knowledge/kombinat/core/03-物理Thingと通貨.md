---
type: "Implementation Specification"
title: "3. 物理Thingと非物理台帳"
description: "物理材料と製品は実在するRimWorld Thingであり、同盟Credit、カエルムMark、債務、租税は意味と所有者を分けた非物理Account／Ledgerとして保存する。"
tags:
  - "kombinat"
  - "implementation"
  - "equipment"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "kombinat/core/03-物理Thingと通貨"
canonical_scope: "kombinat-component-boundary"
content_layer: "implementation"
normative_basis:
  - "/world/33-代表工業資源.md"
  - "/world/39-同盟通貨.md"
  - "/world/60-カエラヴィ個人債務.md"
  - "/world/66-カエルムMark.md"
  - "/world/69-カエルム文化後援・交易・課税原則.md"
  - "/design/38-代表工業資源の実装境界.md"
  - "/design/67-Mark・Credit・債務・税のWorld台帳.md"
  - "/world/41-エネルギー結晶.md"
source_section: "3. 物理Thingと通貨"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_実装仕様書_v4.md"
    title: "Shion Race: Core — Kombinat実装仕様書 v4"
---

# 3. 物理Thingと非物理台帳

物理材料、工業資源、食料、薬品、武器、防具、固有品は実在するRimWorld `ThingDef`／`Thing`である。Kombinat独自の抽象資源残高へ変換しない。Coreの五つの代表工業資源は、[代表工業資源](/world/33-代表工業資源.md)が所有するCell、エネルギー結晶、構造材、保守資材、弾薬結晶とする。

α版から材料、中間品、完成品の保管をCore独自保管・接続システムに一元化する。Kombinatは実Thingを保持せず、進行中Jobが参照する入力予約、出力予定、Operation IDだけを持つ。台帳表示はStorageの実在庫と予約を集計する。

[同盟Credit](/world/39-同盟通貨.md)は一般通貨ではなく、共同体の能力、履行実績、制度上の信頼に応じて、同盟資源と権限をどこまで任せられるかを表す非物理的な`AllianceCreditAccount`として実装する。カエルムMarkは決済残高、個人債務は元本と返済、租税は賦課・源泉徴収・納付を所有する独立Ledgerとする。一つの数値へ換算して意味を統合しない。

各Account／Ledgerは次を持つ。

- 安定した`accountId`または`ledgerId`
- `owner`と組織単位の`scope`
- 64 bit整数の利用可能量、予約量、残高または債務額
- `status`
- transaction historyの有限要約
- initialization profile

同盟Creditの認定、予約、使用、返還、カエルムMarkの決済、債務返済、租税徴収、実Thingの受渡しは、同じ取引に含まれる範囲を一つの冪等Transactionとしてcommitする。事前検証、残高予約、Thing予約のいずれかが失敗した場合は全変更を拒否し、Creditだけを減らす、Markだけを渡す、債務だけを減らす、税だけを記録する、Thingだけを移すという部分結果を残さない。

非物理Account／LedgerはRimWorldのMapまたはコロニー資産価値へ算入しない。CreditまたはMarkを使って受領した物資、装備、建築物その他の実Thingは、受領後にバニラの通常規則で資産価値へ算入する。

同盟Credit、カエルムMark、債務、租税を通常Recipeから生成しない。物理証票との交換を実装する場合は、証票の受領と対象Ledgerの変更を同じ冪等Transactionへ結び付ける。

## 関連項目

- 上位索引: [kombinat/core](/kombinat/core/index.md)
- 同じ出典の前項: [2. 状態分類](/kombinat/core/02-状態分類.md)
- 同じ出典の次項: [4. Kombinat追加層の中核型](/kombinat/core/04-Kombinat追加層の中核型.md)
- 設定所有者: [代表工業資源](/world/33-代表工業資源.md)
- 設定所有者: [同盟Credit](/world/39-同盟通貨.md)
- カエラヴィ個人債務: [カエラヴィ個人債務](/world/60-カエラヴィ個人債務.md)
- カエルム側の決済単位: [カエルムMark](/world/66-カエルムMark.md)
- World台帳実装: [Mark・Credit・債務・税のWorld台帳](/design/67-Mark・Credit・債務・税のWorld台帳.md)
- 資源実装: [代表工業資源の実装境界](/design/38-代表工業資源の実装境界.md)
- 保管・接続基盤: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- 統合境界: [内政台帳とNetwork Storageの統合境界](/design/54-内政台帳とNetwork-Storageの統合境界.md)

## 出典

- Shion Race: Core — Kombinat実装仕様書 v4（退役済み原本: `retired-source://project/Kombinat_実装仕様書_v4.md`） — `3. 物理Thingと通貨`
