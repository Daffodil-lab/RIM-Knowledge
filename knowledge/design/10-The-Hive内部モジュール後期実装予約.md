---
type: "Product Design"
title: "10. The Hive内部モジュール（後期実装予約）"
description: "The Hiveは設計・正史を保護するが、現行の実装対象から外す。"
tags:
  - "shion"
  - "design"
  - "architecture"
  - "kombinat"
  - "pawn"
  - "the-hive"
  - "backstory"
  - "canon"
  - "alpha"
organization_groups:
  - "kombinat-communities"
  - "the-hive"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "design/10-The-Hive内部モジュール後期実装予約"
canonical_scope: "product-architecture"
source_section: "10. The Hive内部モジュール（後期実装予約）"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_統合資料_本文優先全体設計版_v2.md"
    title: "シオン／Shion 統合資料 — 本文優先・全体設計版 v2"
---

# 10. The Hive内部モジュール（後期実装予約）

The Hiveは設計・正史を保護するが、現行の実装対象から外す。以下は着手順を示すロードマップではなく、Core BaseとKombinatが安定した後に再開するための保存仕様である。

## 10.1 現行の正史位置

The Hiveは例外的な単一中枢構造である。端末や投影体は、独立した多数人格ではなく、一つの中枢人格が世界へ接続する身体・窓口として扱う。

通常シオン社会の代表、完成形、上位進化、種族全体の秘密の真実にはしない。

## 10.2 旧Shion Nexusからの継承

旧資料の「案Bハイブ版」を基礎として、次を継承する。

- 単一の真の中枢人格
- Core Projectionを最初の可視・操作身体とする考え
- Terminal Control Model
- Pawnを大量生成しないWorkerSlot
- Tower／中枢施設へ機能を内包するAlpha縮小案
- 端末、救護、シールド、物流を段階的に解禁する構造

次は名称と製品境界を変更する。

- 「Core前提の大型外部拡張」から「Core同梱の任意起動モジュール」へ変更。
- 公開上の別依存MODではなく、Core内Assembly／Defs／Feature Flagへ変更。
- Kombinatを独自複製せず、Core常駐Runtimeへ接続。

## 10.3 有効化条件

Hiveコンテンツは次のいずれかでのみ起動する。

- Hive専用開始シナリオ
- 明示的な研究／建築／クエスト選択
- 開発者用有効化

通常開始の初期生成、ランダムPawn、通常バックストーリー、通常勢力代表へ自動混入しない。

## 10.4 Alpha 0.1の最小閉路

```text
単一中枢人格
  → Core Projectionまたは中枢施設から操作
  → 1つのWorkerSlotを有効化
  → Kombinat施設へ作業率を供給
  → 五つの代表工業Thingの予約・加工・消費を一周
  → 端末停止とロード復帰を検証
```

Alpha 0.1では中枢建築に台帳表示、格納、Worker出力、救護／建設管理の入口を内包してよい。大規模な建築網を先に要求しない。

## 10.5 Hive固有状態

| 状態 | 種類 |
|---|---|
| Terminal Control Capacity | 同時端末制御の派生容量 |
| WorkerSlot | Pawnではない作業供給枠 |
| Record Integrity | 中枢記録と接続の健全性 |
| Core Projection | 操作・表現用の身体 |
| Mercy接続 | 救援機能。具体的消耗のみKombinat資源へ接続 |

これらをKombinatの標準在庫資源へ一括追加しない。

## 10.6 後続候補

- Nexus Quiet Floor／静止床
- 多数端末の制御と切替
- 中継塔を介した物流
- シールドリレー
- 救護／Mercyネットワーク
- 記録完全性の損傷と復旧
- 端末ごとの視覚・フレーバー差

いずれもCore正史の通常シオンを変形させる機能ではなく、Hive内部の拡張として実装する。

---

## 関連項目

- 上位索引: [design](/design/index.md)
- 同じ出典の前項: [9. Kombinat内部Runtime](/design/09-Kombinat内部Runtime.md)
- 同じ出典の次項: [11. Red Star（製品境界保留）](/design/11-Red-Star製品境界保留.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- バックストーリー群: [バックストーリー群](/backstories/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン／Shion 統合資料 — 本文優先・全体設計版 v2（退役済み原本: `retired-source://project/シオンShion_統合資料_本文優先全体設計版_v2.md`） — `10. The Hive内部モジュール（後期実装予約）`
