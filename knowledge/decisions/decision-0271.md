---
type: "Decision Log Entry"
title: "確定#271：3Dプリンター・液体装薬注入機は有人稼働／無人稼働の二種類を持つと確定"
description: "Dプリンター・液体装薬注入機は有人稼働／無人稼働の二種類を持つを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0271"
canonical_scope: "decision-history"
source_section: "確定#271"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#271：3Dプリンター・液体装薬注入機は有人稼働／無人稼働の二種類を持つと確定

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §12.12・§12.13]
ユーザー指示「有人稼働と無人稼働の二種類ある有人稼働は普通の作業台と同じ感覚で扱える（品質は変わる工芸スキルが必要）」を受け、確定#270で「無人稼働のみ」としていた3Dプリンター（§12.12）・液体装薬注入機（§12.13）の稼働方式を訂正——実際には**有人稼働／無人稼働の二種類が併存**する。**有人稼働**：通常の作業台（バニラ`Bill`/`BillGiver`）と同じ感覚で扱う——技師pawnが工芸（Crafting）スキルを用いて手動操作し、バニラの`QualityUtility`同様スキル依存で品質が変動する（壊れかけ〜幻の一品まで通常の品質ロールが起こりうる）。**無人稼働**：確定#270のとおり、プレイヤーが対象を指定するだけで自動稼働し標準品質（Normal）で固定——スキルによる上振れ/下振れは発生しない。両モードとも稼働資源（液化メカナイト・濃縮真空エネルギー、電力不要）は共通。無人稼働は資源さえあれば標準品質を安定供給できる手段、有人稼働は品質に賭けたい場合の選択肢として併存する位置づけとした。液体装薬注入機の未確定リストから「無人稼働か技師配置が要るか」を解決済みとして削除した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#270：3Dプリンターの無人稼働仕様を確定、新設・液体装薬注入機を追加](/decisions/decision-0270.md)
- 同じ出典の次項: [確定#272：観測・通信装備（TZOFEH/KESHER）とステルス装備（NISTAR/MISTOR/MAGENシリーズ）を新設、既存装備にステルス性補正を追加](/decisions/decision-0272.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#271`
