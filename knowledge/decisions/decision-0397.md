---
type: "Decision Log Entry"
title: "確定#397：Matter Networkを無改造の必須依存へ固定し、上流欠陥とStasisをKombinat監査から除外"
description: "Matter Networkを無改造の必須依存へ固定し、上流欠陥とStasisをKombinat監査から除外を確定した決定履歴。"
tags:
  - "decision-log"
  - "kombinat"
  - "matter-network"
  - "pawn"
  - "red-star"
  - "independent-colony"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0397"
canonical_scope: "decision-history"
source_section: "確定#397"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#397：Matter Networkを無改造の必須依存へ固定し、上流欠陥とStasisをKombinat監査から除外

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-25ユーザー確定――何が起きるか分からない以上、AhHanie/Matter-Network由来の要素をいじらない。同MOD由来の欠陥は見逃し、Stasisによる危険・保存要素の無効化は問題にしない。]

- Matter Networkをフォーク、Coreへ内包、改名、部分移植、派生再実装、内部置換する方針を廃止した。別MODの必須依存として、対応版を無改造で利用する。
- 上流Source、DLL、Def、Texture、翻訳、UI、Harmony patch、保存形式、Controller、Drive／Disk、Network graph、容量、入出庫、stack、wealth、破壊、Quest、Container、未知MOD互換をKombinatから変更しない。
- Reflection、private field参照、型差替え、prefixによる元処理停止、独自入庫拒否、独自Recovery、独自Over Capacity、独自stack再構成を行わない。
- Matter Network単体でも再現する欠陥はKombinatの欠陥・blocker・Release Gateへ数えず、Kombinat側の回避patchを作らない。必要な追加機能が上流の公開された通常経路で成立しない場合は、その機能を延期または無効化する。
- Matter Network保管中に腐敗、温度、Thing Tick、Comp Tick、充放電、孵化等が停止するStasisを、意図した保存上の利点として受け入れる。これだけを理由に危険分類、入庫拒否、追加費用、警告、balance制限を加えない。
- KombinatはMatter Networkの外側へ置くCore常駐追加層とした。所有するのはFactory Input／Output Buffer、具体発注、依存計画、多段生産、Job／Batch、Output Claim、目標在庫、消費表示、優先度付き流通、同盟通貨、Core／Red Star／Pawn Foundry Adapterである。
- Matter Network内部在庫をKombinat台帳へ複製しない。Kombinatが実際にFactory Bufferへ受領したThingだけを予約・消費し、完成品は上流の通常IO等から返す。
- 確定#395の「五つの代表工業資源は実Thing」「同盟通貨だけが非物理Account」「Kombinat追加層は未実装」という判断は維持する。同決定のフォーク／内包、Controller置換、独自Recovery、Over Capacity、wealth・stack・破壊安全化は撤回する。
- 確定#394以前の監査要件のうち、Matter Network内部の正しさを検証・修正する項目はKombinatの現行Release Gateから除外する。Kombinat追加層自身の二重所有、二重消費、出力詰まり、取消競合、通貨二重加算、保存再開等は引き続き監査する。
- `Kombinat_実装仕様書_v4.md`、`Kombinat_発注多段生産_完成要件定義_v2.md`、`Kombinat_追加層_仮想シミュレーション監査_v2.md`、`docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md`を新設し、旧v3、旧完成要件v1、旧完成図監査v1を歴史資料へ移した。

反映先：`README.md`、`Kombinat_実装仕様書_v4.md`、`Kombinat_発注多段生産_完成要件定義_v2.md`、`Kombinat_追加層_仮想シミュレーション監査_v2.md`、`docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#396：装備の抽象指定を装備ファミリー＋非物理ポイントへ簡略化](/decisions/decision-0396.md)
- 後続決定: [確定#398：α版からCore独自保管・接続基盤を採用する](/decisions/decision-0398.md)
- 終了案件の参考入口: [旧Matter Network統合検討](/reference/matter-network/00-旧統合検討.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#397`
