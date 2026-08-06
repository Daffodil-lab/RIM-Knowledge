---
type: "Decision Log Entry"
title: "確定#330：Recommendations項目4「ブループリント/プリセット」を確定——ブループリントは非実装（生産は黒字設計で代替）、プリセットは遠隔拠点建築のみ（手動選択も可）"
description: "Recommendations項目4「ブループリント/プリセット」を確定——ブループリントは非実装（生産は黒字設計で代替）、プリセットは遠隔拠点建築のみ（手動選択も可）を確定した決定履歴。"
tags:
  - "decision-log"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0330"
canonical_scope: "decision-history"
source_section: "確定#330"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#330：Recommendations項目4「ブループリント/プリセット」を確定——ブループリントは非実装（生産は黒字設計で代替）、プリセットは遠隔拠点建築のみ（手動選択も可）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.7]

ユーザー指示「ブループリント/プリセットによる複雑性の段階開示　ブループリントなんて物は無い流通網はシンプルだから生産を全て黒字にするといい　プリセットは遠隔拠点を建てる際建築プリセットを用意するが自分で決める事も出来る」を受け、以下を確定：

- **ブループリント（保存可能な工場レイアウト）は実装しない**：Tower Ledgerの流通網（§13.1）は固定スループット・単純な中継塔ネットワークとしてシンプルに設計されている（確定#309）ため、複雑な生産チェーン最適化を要求しない。代わりに**生産は基本的に黒字（必要量を上回る供給）になるよう設計する**方針とする。
- **プリセットは遠隔拠点（§13.6）の建築にのみ用いる**：遠隔拠点建築時にあらかじめ用意された建築プリセットから選んで即座に機能させられる。ただしプレイヤーが個別に設備構成を自分で決めることも可能——強制ではない。
- `シオン/Shion_地場_仕様書_v1.md`§13へ新規「### 13.7 複雑性の段階開示：ブループリントは非実装、プリセットは遠隔拠点建築のみ（確定#330）」として追加。これによりレポートRecommendations 1〜4がすべて反映された。
- **未確定として明記**：具体的なプリセットの種類・内容、プリセット選択UIの実装方式、生産を「黒字」に保つための具体的な数値設計方針。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#329：第二コアの機能として「本拠点消滅時の再出発拠点」を確定](/decisions/decision-0329.md)
- 同じ出典の次項: [確定#331：Recommendations項目5「必須だが調整可能」の二段構えを確定——遠隔拠点＋休眠遺構の再起動だけで簡易ルートとして成立させる](/decisions/decision-0331.md)
- 正史: [正史](/world/index.md)
- 制作・開示規則: [制作・開示規則](/authoring/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#330`
