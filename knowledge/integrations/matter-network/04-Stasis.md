---
type: "Integration Boundary"
title: "4. Stasis"
description: "Matter NetworkのStasis挙動は上流固有の参考情報であり、Core独自システムへ自動継承しない。"
tags:
  - "kombinat"
  - "matter-network"
  - "integration"
organization_groups:
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "integrations/matter-network/04-Stasis"
canonical_scope: "matter-network-integration-boundary"
source_section: "4. Stasis"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md"
    title: "Matter Network上流保護境界"
---

# 4. Stasis

Matter Network保管中に腐敗、温度、Thing Tick、Comp Tick、充放電、孵化等が進まない挙動は、上流固有の参考情報として扱う。Coreのα版仕様ではない。

冷蔵庫その他の保存設備でも保存可能な物を長期間保存できることは、Kombinatの問題、balance blocker、互換事故として扱わない。Stasisで時間進行を止められることだけを理由に、Thingの入庫を拒否しない、追加費用を課さない、危険物分類を追加しない。

上流が個別のThingを受け入れるか、どの状態で復元するかはMatter Networkの挙動に従う。

Core独自システムは、Stasisを自動的に再現しない。保管中の時間進行を止めるか、対象別に進めるか、別設備へ分離するかは独自システムの設定・バランス・互換要件から決め、Core側で試験する。

## 関連項目

- 上位索引: [integrations/matter-network](/integrations/matter-network/index.md)
- 同じ出典の前項: [3. 上流由来の欠陥](/integrations/matter-network/03-上流由来の欠陥.md)
- 同じ出典の次項: [5. Kombinatが追加できる領域](/integrations/matter-network/05-Kombinatが追加できる領域.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 正規保管基盤: [Core独自保管・接続システム](/design/51-Core独自保管接続システムの実装境界.md)

## 出典

- Matter Network上流保護境界（退役済み原本: `retired-source://project/docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md`） — `4. Stasis`
