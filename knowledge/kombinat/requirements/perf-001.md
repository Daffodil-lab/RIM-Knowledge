---
type: "Requirement"
title: "PERF-001 Event駆動"
description: "MUST: Queue、Factory、Buffer、Accountの変化をeventで処理し、定常処理を索引と有界Queueから実行する。"
tags:
  - "kombinat"
  - "requirements"
  - "production"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: requirement
granularity: requirement
canonical_for: "kombinat/requirements/perf-001"
canonical_scope: "kombinat-requirements"
source_section: "PERF-001 Event駆動"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat_発注多段生産_完成要件定義_v2.md"
    title: "Kombinat発注・多段生産 完成要件定義 v2"
---

# PERF-001 Event駆動

`MUST`: Queue、Factory、Buffer、Accountの変化をeventで処理し、定常処理は索引と有界Queueから実行する。全Job、全Recipe、Core Storage内部在庫、Map全体の走査は明示的な再構築または診断へ限定する。

## 関連項目

- 上位索引: [kombinat/requirements](/kombinat/requirements/index.md)
- 同じ出典の前項: [SAV-004 同一ビルド](/kombinat/requirements/sav-004.md)
- 同じ出典の次項: [PERF-002 Planner](/kombinat/requirements/perf-002.md)

## 出典

- Kombinat発注・多段生産 完成要件定義 v2（退役済み原本: `retired-source://project/Kombinat_発注多段生産_完成要件定義_v2.md`） — `PERF-001 Event駆動`
