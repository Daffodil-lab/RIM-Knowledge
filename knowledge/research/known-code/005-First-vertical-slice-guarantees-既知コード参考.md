---
type: "Research Reference"
title: "First vertical-slice guarantees"
description: "1. Five canonical inventory resources are Defs; population, labor, bandwidth, capacity, research, fame, and defense readiness are not…。"
tags:
  - "kombinat"
  - "implementation"
  - "code-reference"
organization_groups:
  - "kombinat-communities"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "First vertical-slice guarantees"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md"
    title: "Known-code extraction record"
---

# First vertical-slice guarantees

1. Five canonical inventory resources are Defs; population, labor, bandwidth,
   capacity, research, fame, and defense readiness are not inventory.
2. A reservation admits all requested resource lines or none.
3. Commit deducts each line at most once.
4. Release returns availability without changing the owned balance.
5. A committed reservation cannot be released, and a released reservation
   cannot be committed.
6. A direct balance adjustment cannot spend assets held by active
   reservations.
7. World save data has an explicit version and rebuilds non-canonical caches
   after load.

## 関連項目

- 上位索引: [research/known-code](/research/known-code/index.md)
- 同じ出典の前項: [Rejected from the runtime](/research/known-code/004-Rejected-from-the-runtime-既知コード参考.md)
- 同じ出典の次項: [Next extraction](/research/known-code/006-Next-extraction-既知コード参考.md)

## 出典

- Known-code extraction record（退役済み原本: `retired-source://project/Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md`） — `First vertical-slice guarantees`
