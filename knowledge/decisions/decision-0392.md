---
type: "Decision Log Entry"
title: "確定#392：Kombinatを生産・消費・流通へ集約した汎用工業とする"
description: "Kombinatを生産・消費・流通へ集約した汎用工業とするを確定した決定履歴。"
tags:
  - "decision-log"
  - "kombinat"
  - "independent-colony"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0392"
canonical_scope: "decision-history"
source_section: "確定#392"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#392：Kombinatを生産・消費・流通へ集約した汎用工業とする

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――Kombinatは汎用的で比較的シンプルな工業であり、プレイヤーが一度に多くのことを考える必要はない。注意すべき点は生産、消費、適切な流通である。]

- Kombinatの通常プレイで同時に判断する主題を、「何をどれだけ作るか」「何がどこで消費されるか」「限られた品をどこへ先に流すか」の三つへ固定した。これはαだけの簡略化ではなく、完成版まで維持する製品不変条件である。
- 操作画面を一つのKombinat Terminalへ集約し、最上位Viewを生産、消費、流通の三つに限定した。
- αのStorageを一つの総容量で扱い、種類枠、Partition、Bulk Cell選択を通常操作から外した。Storage Tierは容量、消費電力、建造費だけで差別化する。
- 入出庫設備を一つのDistribution Endpointへ統合し、Supply、Receive、Bufferの三Modeで扱う。流通規則は対象、行先、最低量、目標量、優先度を中心とする。
- Consumer EndpointとConsumption Projectionを追加し、消費量、平滑化した消費率、不足までの予測時間を表示する。
- Production PatternはRecipe、Def、設備から自動登録する。Pattern Provider、Crafting Executor、予約、Batch、中間在庫は安全性と拡張性のため内部に残すが、通常プレイヤーへ媒体作成、割当、Executor選択を要求しない。
- Channel、Service Slot、Link Capacity、手動Subnetwork、Upgrade Card、専門Terminal群を通常稼働の前提から外した。互換する接続Networkは自動結合し、AccountまたはAccess Policyが競合する場合だけ単純な選択を求める。
- 確定#391のAE2系準拠は、中央保管、入出庫、backpressure、多段自動生産、中間品隔離という責務と内部設計を参照する意味へ限定した。AE2固有の認知負荷や操作画面は準拠対象にしない。
- 遠距離物流の保護延期、停止保存、資産価値算入、破壊時保全、複雑Thing互換、性能優先という既決定は維持する。

反映先：`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`Kombinat_実装仕様書_v3.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#391：Kombinat遠距離物流の保護延期、AE2系準拠、αのローカルNetwork再構成](/decisions/decision-0391.md)
- 同じ出典の次項: [確定#393：β版Pawn Foundry、補充可能個体、登録再実体化、Clone Colony](/decisions/decision-0393.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#392`
