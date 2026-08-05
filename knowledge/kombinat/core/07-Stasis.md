---
type: "Implementation Specification"
title: "7. 保管中の時間進行"
description: "保管中の時間進行方針はCore独自Storageが対象別に所有し、Kombinatはその判定を維持する。"
tags:
  - "kombinat"
  - "implementation"
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

# 7. 保管中の時間進行

Core独自保管・接続システムは、腐敗、温度、Thing Tick、Comp Tick、充放電、孵化等を進めるか停止するかを対象別に定義し、保存・ロード後も同じ判定を維持する。

Kombinat FactoryはThingを保持しない。生産入力、中間品、完成品の時間進行は、それらを所有するCore独自Storageの方針へ従う。

Kombinatは時間進行状態を独自に上書きせず、未定義の対象または保存復元後の不一致を理由付きの欠陥として報告する。

## 関連項目

- 上位索引: [kombinat/core](/kombinat/core/index.md)
- 同じ出典の前項: [6. 無人生産](/kombinat/core/06-無人生産.md)
- 同じ出典の次項: [8. 消費と流通](/kombinat/core/08-消費と流通.md)
- 正規保管仕様: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)

## 出典

- Shion Race: Core — Kombinat実装仕様書 v4（退役済み原本: `retired-source://project/Kombinat_実装仕様書_v4.md`） — `7. Stasis`
