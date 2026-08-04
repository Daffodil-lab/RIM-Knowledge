---
type: "Requirement"
title: "PERF-004 保存"
description: "MUST: 500 Job、2,000 Batch履歴、10,000 Buffer Thingの保存・ロード時間、ファイル増分、GC allocationを記録する。"
tags:
  - "kombinat"
  - "requirements"
  - "production"
  - "matter-network"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: requirement
granularity: requirement
canonical_for: "kombinat/requirements/perf-004"
canonical_scope: "kombinat-requirements"
source_section: "PERF-004 保存"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_発注多段生産_完成要件定義_v2.md"
    title: "Kombinat発注・多段生産 完成要件定義 v2"
---

# PERF-004 保存

`MUST`: 500 Job、2,000 Batch履歴、10,000 Buffer Thingの保存・ロード時間、ファイル増分、GC allocationを記録する。

Core独自Storageの内部Thing数は保管基盤の性能fixtureで別途測り、KombinatのJob／Batch処理時間と混同しない。

## 関連項目

- 上位索引: [kombinat/requirements](/kombinat/requirements/index.md)
- 同じ出典の前項: [PERF-003 長期](/kombinat/requirements/perf-003.md)
- 同じ出典の次項: [A. 三段生産](/kombinat/requirements/044-A-三段生産.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)

## 出典

- Kombinat発注・多段生産 完成要件定義 v2（退役済み原本: `retired-source://project/Kombinat_発注多段生産_完成要件定義_v2.md`） — `PERF-004 保存`
