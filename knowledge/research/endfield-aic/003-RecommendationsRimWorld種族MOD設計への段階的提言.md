---
type: "Research Reference"
title: "Recommendations(RimWorld種族MOD設計への段階的提言)"
description: "Recommendations(RimWorld種族MOD設計への段階的提言)は、まず「固定スループット＋詰まり可視化」を核に据える。"
tags:
  - "research"
  - "endfield"
  - "aic"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "Recommendations(RimWorld種族MOD設計への段階的提言)"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md"
    title: "アークナイツ:エンドフィールド AICシステム 設計分析レポート"
---

# Recommendations(RimWorld種族MOD設計への段階的提言)

1. まず「固定スループット＋詰まり可視化」を核に据える。搬送(パイプ/コンベア)の速度を単一固定値にし、過剰供給が視覚的な滞留として現れる仕組みを最優先で実装する。これが最小コストで「手腕が報われる」学習ループを生む。基準:プレイヤーがレシピ比を暗算で解けるよう、レシピ時間と搬送速度を整数比で設計する。
2. 次にリソース種類を3〜4種に絞る。RimWorldは元来アイテム種が多いので、種族MOD固有の変換チェーンは「少数の固有中間素材」に集約し、深さ(3〜4段)はあっても幅は狭く保つ。閾値:1つの最終製品に必要な固有中間素材が5種を超えたら簡略化を検討。
3. インフラ敷設を探索/マップ解放と結合させる。電力網や搬送網の延伸が、単なる効率化でなく「新エリア・ギミック・報酬」の解除鍵になるループを設計する。これがEndfield最大の差別化要因であり、MODの独自性を最も高める投資対効果の高い施策。
4. ブループリント/プリセット機能で複雑性を段階開示する。「自分で組みたい層」と「即座に機能させたい層」の両方に対応するため、機能するプリセットレイアウトを標準提供し、共有可能にする。これにより工場苦手層の離脱を防ぐ。
5. 「必須だが調整可能」の二段構えにする。固有システムを進行の主経路に置きつつ、その関与度をプレイヤーが調整できる逃げ道(簡易モード・自動化オプション)を用意する。ベンチマーク:テスターの中で「システムが複雑すぎて離脱」が一定割合を超えたら、プリセットの拡充かチュートリアルの整理で対応(Endfieldはチュートリアル過多で逆に批判された点に注意——説明は「触らせて学ばせる」設計を優先)。
6. リセット型進行には必ず新メカニクスを添える。地域/バイオームごとに素材をリセットする場合、単なる素材名の差し替えでなく、新しい制約(流体・気体・特殊環境など)を伴わせ「作業感」を回避する。

## 関連項目

- 上位索引: [research/endfield-aic](/research/endfield-aic/index.md)
- 同じ出典の前項: [Details(設計分析としての示唆)](/research/endfield-aic/002-Details設計分析としての示唆.md)
- 同じ出典の次項: [Caveats](/research/endfield-aic/004-Caveats-エンドフィールド工業参考.md)
- 制作・開示規則: [制作・開示規則](/authoring/index.md)

## 出典

- アークナイツ:エンドフィールド AICシステム 設計分析レポート（退役済み原本: `retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md`） — `Recommendations(RimWorld種族MOD設計への段階的提言)`
