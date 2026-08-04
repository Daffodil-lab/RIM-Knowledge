---
type: "Implementation Specification"
title: "7. Stasis"
description: "Core独自基盤は保管中の時間進行方針を自ら所有し、Matter NetworkのStasisを自動継承しない。"
tags:
  - "kombinat"
  - "implementation"
  - "matter-network"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "kombinat/core/07-Stasis"
canonical_scope: "kombinat-component-boundary"
source_section: "7. Stasis"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_実装仕様書_v4.md"
    title: "Shion Race: Core — Kombinat実装仕様書 v4"
---

# 7. Stasis

Matter NetworkのStasisはCore α版の仕様ではない。Core独自保管・接続システムが保管中の時間進行方針を所有する。

腐敗、温度、Thing Tick、Comp Tick、充放電、孵化等が停止することを問題扱いしない。冷蔵庫等で保存可能な物を長期間保存できることは、追加費用、危険分類、入庫拒否の理由にしない。

Kombinat FactoryはThingを保持しない。生産入力、中間品、完成品の時間進行は、それらを所有するCore独自Storageの方針へ従う。

Core独自保管・接続システムはMatter NetworkのStasis挙動を自動継承しない。保管中のTick、腐敗、温度、劣化、充放電、孵化等をどう扱うかをCore側の仕様と試験で決定する。

## 関連項目

- 上位索引: [kombinat/core](/kombinat/core/index.md)
- 同じ出典の前項: [6. 無人生産](/kombinat/core/06-無人生産.md)
- 同じ出典の次項: [8. 消費と流通](/kombinat/core/08-消費と流通.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)
- 正規保管仕様: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)

## 出典

- Shion Race: Core — Kombinat実装仕様書 v4（退役済み原本: `retired-source://project/Kombinat_実装仕様書_v4.md`） — `7. Stasis`
