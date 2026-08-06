---
type: "Decision Log Entry"
title: "確定#327：地域開発度（Regional Development）メトリクスを追加。ワールドマップ大規模遺構コンプレックスの代替発生経路「変わり者の工場長」イベントを追加"
description: "地域開発度（Regional Development）メトリクスを追加。"
tags:
  - "decision-log"
  - "pawn"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0327"
canonical_scope: "decision-history"
source_section: "確定#327"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#327：地域開発度（Regional Development）メトリクスを追加。ワールドマップ大規模遺構コンプレックスの代替発生経路「変わり者の工場長」イベントを追加

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.3・§13.5]

ユーザー指示「地域開発度メトリクス——中継塔の設置数・輸送上限アップグレード状況等に応じた指標を用意し、一定値に達すると新しい資源ノードが追加されたり、既存ノードの産出効率が上がったりする。またワールドマップ上の大規模遺構コンプレックスがセンサー系設備を使わずとも勝手に発生するイベント変わり者の工場長が発生する」を受け、以下を確定：

- **地域開発度**：中継塔の設置数・輸送上限アップグレード状況等に応じて上昇する指標を新設。一定値に達すると新しい資源ノードが追加されたり、既存ノードの産出効率が上がったりする——Endfieldの「Regional Development」（レポート§6）の翻案。`シオン/Shion_地場_仕様書_v1.md`§13へ新規「### 13.5 地域開発度（Regional Development・確定#327）」として追加。
- **「変わり者の工場長」イベント**：§13.3のワールドマップ上の大規模遺構コンプレックスは、プレイヤーがセンサー系設備を導入していなくても、ランダムイベント「変わり者の工場長」によって自発的に発生することがある——気まぐれなシオン/Shion（確定#292）の一種として遺構に居座った個体が「工場長」を自称し、その存在自体がコンプレックスの出現・クエスト化のトリガーとなる。センサー検出（能動的発見）と本イベント（受動的発生）の二経路が並存する。§13.3へ追記。
- **未確定として明記**：地域開発度の算出式・閾値段階・管理粒度・UI表示方法、「変わり者の工場長」の具体的なキャラクター設定・イベント発生条件・センサー検出との頻度バランス。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#326：探索⇄工業の循環（資源ノード発見）を確定——バニラ非製造資源・対応MOD資源の効率的な入手経路として位置づけ](/decisions/decision-0326.md)
- 同じ出典の次項: [確定#328：遠隔拠点（第二マップを生成しない工場/設備展開）を追加——資源ノード対応生産・非対応時の扱い・砲兵陣地/航空基地/軌道エレベーター等の設備群](/decisions/decision-0328.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#327`
