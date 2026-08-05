---
type: "Decision Log Entry"
title: "確定#244：Tierによる全ステータス補正ルールを修正——特性を考慮しない基礎ステータスは人間（Tier0基準値）を下回らない、−Tierは+10%/Tierボーナスが単に無いだけで追加のマイナス補正は掛からない"
description: "Tierによる全ステータス補正ルールを修正——特性を考慮しない基礎ステータスは人間（Tier0基準値）を下回らない、−Tierは+10%/Tierボーナスが単に無いだけで追加のマイナス補正は掛からないを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0244"
canonical_scope: "decision-history"
source_section: "確定#244"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#244：Tierによる全ステータス補正ルールを修正——特性を考慮しない基礎ステータスは人間（Tier0基準値）を下回らない、−Tierは+10%/Tierボーナスが単に無いだけで追加のマイナス補正は掛からない

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §6、シオン/Shion_バランス基準書_v1.md §4.1、シオン/Shion_コンセプト設計書_v2.md]
Claude.aiレビューコメント（CoreMOD資料v1§6「Tierによる全ステータス補正（確定・統一ルール）」ブロックを選択、指示「特性を考えない場合はステータスが人間より下回る事は無い（−Tierでも減ることはありませんだってステータス零とか何の役にも立たない）」）を受け、既存の矛盾を修正。旧文言は「+Tierなら+10%×段数、−Tierなら−10%×段数」と−Tierに実際の負の補正を掛けていたが、これは同じ§6内の別文「−Tierの"痛み"は基礎ステータスの崩壊ではなく、①ランダムな弱点の自動付与、②弱点負債pt、の2点に集約される」と矛盾していた。修正後は**+Tierのみ+10%×段数のボーナスが乗り、−Tierはこのボーナスが単に無い（0%のまま）——特性を考慮しない基礎ステータス自体は人間（Tier0基準値）を下回らない**という整理に統一。−Tier個体の弱さは引き続き弱点の自動付与・弱点負債ptという特性側のメカニクスのみで表現される。CoreMOD資料v1§6の本文に加え、バランス基準書v1§4.1の同ルールへの参照文（旧文言「負のTierでは−10%」を含んでいた）、コンセプト設計書v2の「全ステータス+10%/Tier」節（旧文言「下限フロア0.2〜0.3」を含んでいた——このフロア自体、今回の修正で不要になった）も整合するよう修正。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#243：「必要素材種類数」仕様をプロジェクト全体から廃棄——確定#169由来のTier別必要素材種類数表・関連文言をCoreMOD資料/バランス基準書/資源植物資料/コンセプト設計書の4資料から削除](/decisions/decision-0243.md)
- 同じ出典の次項: [確定#245：身体ロードアウトのインプラント（標準を除く）は必ず濃縮真空エネルギー＋液化メカナイトを消費すると確定](/decisions/decision-0245.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#244`
