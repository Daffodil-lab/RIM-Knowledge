---
type: "Decision Log Entry"
title: "確定#390：Kombinat停止保存、資産価値、破壊時保全、性能優先方式"
description: "Kombinat停止保存、資産価値、破壊時保全、性能優先方式を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "red-star"
  - "the-hive"
  - "independent-colony"
  - "canon"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
  - "the-hive"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0390"
canonical_scope: "decision-history"
source_section: "確定#390"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#390：Kombinat停止保存、資産価値、破壊時保全、性能優先方式

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――Kombinat保管中は腐敗と温度を進行させず、CompをTickさせない。Map資産価値へ算入する。Provider破壊時は保全する。コンテナ入りThing、Quest品、名前付き品を格納可能とし、発展性と互換性を高くする。その他の問題は最も性能の良い方式を優先する。]

- 保管Thingは元のRimWorld `Thing` instanceをKombinat管理`IThingHolder`へ移す停止保存とし、独自DTOへ平坦化しない。
- 停止保存中は腐敗、温度、劣化、自然回復、充放電、燃料消費、孵化、成長、`Thing.Tick`、各種`CompTick`を進行させない。
- コンテナ入りThing、Quest対象、名前付き品、品質、素材、耐久、biocode、遺伝情報、内容物、load ID、外部参照を保存往復で維持する。
- Resourceと停止保存ThingをMapまたは所属WorldObjectの資産価値へ算入し、入出庫等のeventで差分更新する。
- Provider破壊時は内容をMapへ一括排出、削除、複製せず、Inventory NodeとThing Holderを`RecoveryPending`へ再所属させる。復旧まで利用不能だが、所有総量と資産価値へ残す。
- Resource数量型をcheckedな符号付き64 bit整数へ固定した。
- 性能優先方式として、差分Topology、Controller処理予算、Port Token Bucket、一Executor一Job、有界DAG Planner、stable ID順の原子的frontier予約、Policy単位Autostock、明示的Network結合、有限監査windowを採用した。
- α受入シナリオをA〜Mへ拡張し、停止保存、複雑Thing、同時Autostock、予約競合と再計画、到着容量Lease、Network結合、offline診断、長期履歴圧縮を追加した。
- αの汎用要件からRed StarとThe Hiveの固有名を外し、用途制限と外部Work Providerという中立境界へ置き換えた。

反映先：`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`Kombinat_実装仕様書_v3.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#389：MVP廃止、α公開候補、β終了条件、完成前セーブ互換](/decisions/decision-0389-確定-廃止-公開候補-終了条件-完成前セーブ互換.md)
- 同じ出典の次項: [確定#391：Kombinat遠距離物流の保護延期、AE2系準拠、αのローカルNetwork再構成](/decisions/decision-0391-確定-遠距離物流の保護延期-系準拠-のローカル-再構成.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#390`
