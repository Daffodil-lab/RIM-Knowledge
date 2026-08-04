---
type: "Decision Log Entry"
title: "確定#391：Kombinat遠距離物流の保護延期、AE2系準拠、αのローカルNetwork再構成"
description: "Kombinat遠距離物流の保護延期、AE2系準拠、αのローカルNetwork再構成を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "red-star"
  - "independent-colony"
  - "canon"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0391"
canonical_scope: "decision-history"
source_section: "確定#391"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#391：Kombinat遠距離物流の保護延期、AE2系準拠、αのローカルNetwork再構成

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――遠距離物流を一時的に放棄し、多くの仕様をApplied Energistics 2とその好評なアドオンに準拠する。]

- Map間、拠点間、WorldObject間のRoute、輸送中Cargo、到着容量Lease、費用、危険、無限距離Terminalを、α、β、Core／Red Star 1.0の完成条件から外した。
- 遠距離物流は廃棄せず、旧Transfer状態、Cargo Escrow、搬送主体、取消、喪失、到着Lease、受入候補、再開ゲートを`docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md`へ保全した。
- 再開承認まで、遠距離物流用の空Assembly、API、保存field、UIタブ、互換予約を先行実装しない。
- αのKombinatを、AE2型のローカルNetwork Storage、Drive／Cell、ad-hoc／Controller、有限Service Capacity、modular Terminal、Import／Export／Storage Bus、Network Interface、Subnetwork、自動生産へ再構成した。
- MEGA Cellsの大容量／Bulk Cell、ExtendedAEの高速I/O・Filter・大容量Provider、AdvancedAEの面別入力・非消費材料・seed付き再帰生産、AE2 Import Export Cardの携帯端末同期、Applied FluxのNetwork内エネルギーを段階拡張の参考に採用した。
- 無限距離・dimension間Terminalを提供するAEInfinityBoosterは、今回の延期境界と衝突するため参照記録だけに留めた。
- αの生産基盤へPattern Provider、Crafting Executor、一Executor一Job、blocking、output lock、Provider優先度、Seeded Recursive Pattern、Output Limitを追加した。
- AE2およびアドオンの名称、外見、固有数値、コードは複製せず、責務分離と操作意味だけを準拠対象とした。RimWorldのThing identity、Quest参照、資産価値、停止保存を優先する。
- 確定#389の「倉庫・物流・多段生産」と確定#390の「到着容量Leaseを含むA〜M」は、本確定により「ローカルNetwork Storage・I/O・Subnetwork・多段生産」と新しいA〜Mへ更新された。

反映先：`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`Kombinat_実装仕様書_v3.md`、`docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#390：Kombinat停止保存、資産価値、破壊時保全、性能優先方式](/decisions/decision-0390.md)
- 同じ出典の次項: [確定#392：Kombinatを生産・消費・流通へ集約した汎用工業とする](/decisions/decision-0392.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#391`
