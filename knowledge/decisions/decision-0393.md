---
type: "Decision Log Entry"
title: "確定#393：β版Pawn Foundry、補充可能個体、登録再実体化、Clone Colony"
description: "β版Pawn Foundry、補充可能個体、登録再実体化、Clone Colonyを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "pawn"
  - "independent-colony"
  - "equipment"
  - "canon"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0393"
canonical_scope: "decision-history"
source_section: "確定#393"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#393：β版Pawn Foundry、補充可能個体、登録再実体化、Clone Colony

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――β版で必要に応じたPawn生産を可能にする。必要な装備、改造、能力を持たせ、無料で保管できるようにする。Pawnはゲーム上補充可能な工業製品・コマとし、遺体回収、蘇生、怪我の回復も低コストにする。未登録個体は死亡回収後に個体情報をセーブから消し、ランダム適合生成、既定・登録・一から設計した個体の保存生産、Cloneを可能にする。]

- β版のCoreへPawn Foundryを追加し、適合するランダムPawn、Defで用意した既定個体、プレイヤーが一から作った設計、登録個体、Cloneを生産できるようにした。
- 通常Pawnの生産、修復、再起動、再実体化、Cloneを、資源と設備がある限り回数制限なく反復できる工業とした。世界で一度しか得られない必須資源や有限加入枠へ依存させない。
- Body、Module、外装、Gene、Trait、Skill、Passion、Ability、Hediff、具体／抽象装備を役割に合わせた一つの配備要求へまとめる。必須構成が欠ける場合は完成Pawnとして出現させない。
- 生存Pawnを、資源、通貨、専用容量、保管料、継続TickなしのDormant状態へ無料保管し、同じ個体と装備を再配備できるようにした。
- 負傷修復、回収遺体の再起動、Registered Individualの再実体化を、標準新規Pawn生産より低コストにする方針を固定した。
- 適合生成の既定出力をEphemeral Pawnとした。死亡後、遺体回収・再資源化が完了した時点で、Pawn、Corpse、World Pawn、Relation、Archive、個体参照付き履歴をセーブ正本から除去する。
- Registered IndividualとAuthored Individualは`Individual Archive`を残す。同じ`individualId`の活動中またはDormant実体は同時に一体だけとし、死亡後は同じ一人として再実体化できる。
- CloneはRegistered IndividualまたはSaved Pawn Designを原型とし、各Cloneへ別の`individualId`とPawn load IDを与える。生成後の経験、関係、傷、改造、装備を個別化し、同じ原型のCloneを任意数同時生産できる。
- 一人の登録シオンと、そのCloneだけで構成したコロニーを正式な受入シナリオとした。
- ゲーム上のPawnは補充可能な工業ユニットとして扱うが、作中の起動済みシオンは生成方式、登録状態、Clone元にかかわらず独立人格である。登録の有無を権利・身分差へ変換しない。
- Pawn、Individual Archive、Clone Lineage、Dormant Record、遺体はCore Pawn Runtimeが所有する。KombinatはBody、Module、装備、消耗品の生産要求だけを扱い、PawnをNetwork Storageへ格納せず第四の主画面も追加しない。
- β詳細要件書`シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`を新設し、GEN-001〜008、REG-001〜010、DOR-001〜007、REC-001〜009、INT-001〜006、UX-001〜006、SAVE-001〜006、PERF-001〜004と受入シナリオA〜Jを固定した。

反映先：`シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`、`シオンShion_正史コア_v2.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`Kombinat_実装仕様書_v3.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#392：Kombinatを生産・消費・流通へ集約した汎用工業とする](/decisions/decision-0392.md)
- 同じ出典の次項: [確定#394：Kombinat完成図の仮想シミュレーション、未知MOD互換契約、復旧不能・無限容量の封鎖](/decisions/decision-0394.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#393`
