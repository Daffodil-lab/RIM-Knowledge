---
type: "Gameplay Specification"
title: "15. ScenarioDefとPawn生成"
description: "XMLで表現できるThing、人数、文章をC番号へ直書きしない。"
tags:
  - "shion"
  - "independent-colony"
  - "gameplay"
  - "kombinat"
  - "pawn"
  - "equipment"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "colony/15-ScenarioDefとPawn生成"
canonical_scope: "independent-colony"
source_section: "15. ScenarioDefとPawn生成"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md"
    title: "Shion Race: Core — 独立開拓団 設定・実装仕様 v1"
---

# 15. ScenarioDefとPawn生成

## 15.1 XMLで持つもの

- ScenarioDefの表示名と説明
- 開始人数
- Pawn生成条件
- 具体指定できる初期Thing
- `ShionBodyConfigurationProfileDef`と`ShionLoadoutProfileDef`の参照
- 初期研究または研究タグ
- `ScenPart_ShionExpeditionProfile`の指定

## 15.2 C#で持つもの

- 独立開拓団Profileの適用
- 身体構成の生成、互換検証、Pawnごとの保存
- 装備ファミリーエントリの候補解決と原子的なThing生成
- Kombinat口座初期化
- 保存済みProfileの取得
- 初期化失敗の診断
- 最小の状態表示

XMLで表現できるThing、人数、文章をC#へ直書きしない。

## 15.3 技能保証

三人全体が最低限の開始可能性を持つよう、生成後監査を行う。

必要領域:

- 建設
- 工芸または知力
- 医療または栽培
- 社交または調査相当

全員を高技能にしない。RimWorldの通常プレイで不足を補う余地を残す。

技能保証の具体値はバランステストで決める。

---

## 関連項目

- 上位索引: [colony](/colony/index.md)
- 同じ出典の前項: [14. 最小データモデル](/colony/14-最小データモデル.md)
- 同じ出典の次項: [16. Field Ledger Terminal](/colony/16-Field-Ledger-Terminal.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)

## 出典

- Shion Race: Core — 独立開拓団 設定・実装仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md`） — `15. ScenarioDefとPawn生成`
