---
type: "Decision Log Entry"
title: "確定#251：コロニードクトリンによるユニット製造コスト補正、および3Dプリンターのレシピ自動生成＋変換効率の可変化を確定"
description: "コロニードクトリンによるユニット製造コスト補正、および3Dプリンターのレシピ自動生成＋変換効率の可変化を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0251"
canonical_scope: "decision-history"
source_section: "確定#251"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#251：コロニードクトリンによるユニット製造コスト補正、および3Dプリンターのレシピ自動生成＋変換効率の可変化を確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §7.3③・§12.12、シオン/Shion_実装計画書_v1.md 表A/表B]
ユーザー指示「ユニットコストにドクトリンで補正値かけれる？　あと3Dプリンタによる変換レートもレシピを自動生成して上げ下げできる？」を受け、2点とも実現可能と判断し設計を確定。①**ドクトリンによる製造コスト補正**：§4.1で確定済みのTier製造コスト複利式（±10%／Tier）を変更せず、その計算結果にコロニードクトリン（グランド／サブ＋習熟度レベル）由来の追加乗算レイヤーを1段差し込む方式とした。補正の大きさはHoi4本家の「物量ドクトリンで設計コスト−100%」のような極端な数値をそのまま輸入せず、確定#250で定めたC90アンカー（単一ステータス+10〜25%レンジ）に揃えたマイルドな補正に留める——例として「物量」グランドドクトリン＋歩兵系サブドクトリンの習熟度進行で、量産用途（−Tier〜Tier0）個体の製造コストが段階的に最大25%程度軽減される、という設計とした。CoreMOD資料v1§7.3に新設した③項として追記。②**3Dプリンターのレシピ自動生成＋変換効率可変化**：対象品目が「ほぼ全品目」という設計方針上、個別RecipeDefの手動整備は非現実的なため、`Dialog_ManufacturePawn`と同格の薄DLL例外として`SpecialInjector_PrinterRecipes`（起動時にホワイトリストThingDefを走査し1品目=1レシピを機械生成、既存の変換レート式Mass+MarketValue/10を適用）を新設する方針を確定。さらに「上げ下げできるか」という要求に応えるため、変換レートの1/10係数自体を固定値ではなく乗算StatDef「変換効率」として切り出し、研究・施設Quality・コロニードクトリンなどが独立に変動させられるようにした——効率補正は個々のRecipeDefにはハードコードせず、施設側のカスタム`RecipeWorker_PrinterConvert`が製造時に一括参照・適用する設計とすることで、ホワイトリスト更新のたびにレシピを再生成する必要がないようにした。CoreMOD資料v1§12.12に追記。実装計画書v1の表A・表Bに新規3項目（`StatPart_DoctrineProductionCost`／`SpecialInjector_PrinterRecipes`／`RecipeWorker_PrinterConvert`）を追加し、いずれも既存の薄DLL例外群（Dialog_ManufacturePawn等）と同格の位置づけとして整理した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#250：コロニードクトリンの数値設計アンカーをバランス基準書v1§4.3（C90）として新設——単一ステータス+10〜25%レンジ・多種類のステータスへ分散、という原則を確定](/decisions/decision-0250.md)
- 同じ出典の次項: [確定#252：個人名/セル暗号/読みをバニラNameTriple（名前/姓/ニックネーム）へ正式対応づけ——単一名整形方式を撤回](/decisions/decision-0252.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#251`
