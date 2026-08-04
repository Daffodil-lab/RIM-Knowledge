---
type: "Gameplay Specification"
title: "13. Assembly責務"
description: "αでは、Kombinatとの開始接続、最低限の初期化、エラー表示に必要な責務だけを実装する。"
tags:
  - "shion"
  - "independent-colony"
  - "gameplay"
  - "kombinat"
  - "pawn"
  - "red-star"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "colony/13-Assembly責務"
canonical_scope: "independent-colony"
source_section: "13. Assembly責務"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md"
    title: "Shion Race: Core — 独立開拓団 設定・実装仕様 v1"
---

# 13. Assembly責務

## 13.1 `Shion.Core.dll`

αでは、Kombinatとの開始接続、最低限の初期化、エラー表示に必要な責務だけを実装する。次のうちProfile、身体Runtime、救援クエスト等はβで追加する。

- 独立開拓団プロフィール
- Scenarioと開始初期化
- 開拓団状態の保存
- シオン固有Pawn／身体／建築／UI
- 通常遠征用Kombinat Adapter
- 独立開拓団の救援クエスト
- プレイヤー向け説明とエラー表示

## 13.2 Kombinat Runtime Assembly

- 資源Def
- Account別残高
- Facility能力、対応Pattern、割当、進捗
- Request、Plan、Job、Batch、Output Claim
- 目標在庫、消費表示、優先度付き流通
- データ検証と同一ビルドの保存・復元
- 公開API

## 13.3 参照方向

```text
Shion.Core.dll
  → Kombinatの公開Application境界

Kombinat Runtime
  -X→ Shion.Core.dll concrete types
```

Kombinat側で「独立開拓団」「シオン」「Red Star」を判定しない。

---

## 関連項目

- 上位索引: [colony](/colony/index.md)
- 同じ出典の前項: [12. 目標パッケージ構造](/colony/12-目標パッケージ構造.md)
- 同じ出典の次項: [14. 最小データモデル](/colony/14-最小データモデル.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- Shion Race: Core — 独立開拓団 設定・実装仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md`） — `13. Assembly責務`
