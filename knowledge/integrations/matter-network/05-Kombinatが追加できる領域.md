---
type: "Integration Boundary"
title: "5. Kombinatが追加できる領域"
description: "KombinatはCore独自保管システムの外側で発注・生産・通貨を所有し、Matter Network互換は任意Adapterへ隔離する。"
tags:
  - "kombinat"
  - "matter-network"
  - "integration"
  - "pawn"
  - "red-star"
  - "independent-colony"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "integrations/matter-network/05-Kombinatが追加できる領域"
canonical_scope: "matter-network-integration-boundary"
source_section: "5. Kombinatが追加できる領域"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md"
    title: "Matter Network上流保護境界"
---

# 5. Kombinatが追加できる領域

KombinatはCore独自保管・接続システムの外側へ追加し、次を所有する。

- Production Request
- 目標在庫と発注Queue
- Recipe依存計画
- Kombinat専用Factory
- Factory Input／Output Buffer
- 多段生産、中間品、Batch、取消、再試行
- 消費表示と流通目標
- 同盟通貨Account
- 独立開拓団、Red Star、Pawn Foundryからの要求
- 上記専用UI、保存、診断

物理入力はCore独自EndpointからKombinat Factoryの物理Bufferへ直接渡す。完成品も同じ公開転送契約から独自Storageへ戻す。

保管内部の在庫をKombinat独自台帳へ複製しない。Kombinatの予約は、Kombinatが実際にFactory Bufferへ受領したThing、またはCore独自基盤が取引ID付きで供給を確定した範囲だけを正本にする。

Matter Network向け任意Adapterを将来作る場合も、同じ公開契約へ変換できる操作だけを許す。正式APIで成立しない操作は実装せず、内部へpatchして成立させない。KombinatのDomain型をMatter Networkの型へ依存させない。

## 関連項目

- 上位索引: [integrations/matter-network](/integrations/matter-network/index.md)
- 同じ出典の前項: [4. Stasis](/integrations/matter-network/04-Stasis.md)
- 同じ出典の次項: [6. 配布と版](/integrations/matter-network/06-配布と版.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正規保管基盤: [Core独自保管・接続システム](/design/51-Core独自保管接続システムの実装境界.md)

## 出典

- Matter Network上流保護境界（退役済み原本: `retired-source://project/docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md`） — `5. Kombinatが追加できる領域`
