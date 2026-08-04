---
type: "Research Reference"
title: "Caveats"
description: "Caveatsは、数値仕様の出典:ベルト速度30個/分、パイプ2 unit/秒、電力値(Thermal Bank/バッテリー)、制御ポート上限1〜5000等は、公式コミュニティwiki(endfield.wiki.gg)とGame8/GameWith等の攻略サイト…。"
tags:
  - "research"
  - "endfield"
  - "aic"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "Caveats"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md"
    title: "アークナイツ:エンドフィールド AICシステム 設計分析レポート"
---

# Caveats

- 数値仕様の出典:ベルト速度30個/分、パイプ2 unit/秒、電力値(Thermal Bank/バッテリー)、制御ポート上限1〜5000等は、公式コミュニティwiki(endfield.wiki.gg)とGame8/GameWith等の攻略サイト、およびプレイヤー検証に基づく。Hypergryphの一次公式ドキュメントで全数値が確認されたわけではなく、パッチで変動しうる(実際に電力延長距離は1.0.2で90m→100m/40m→50mに変更された)。
- Splitter/Convergerの内部分配アルゴリズム(厳密なラウンドロビンか需要ベースか)、バックプレッシャーの正確な挙動、専用の優先度制御の有無は、名前のある一次情報源では確定記述が見つからず「情報なし」。公式説明は「evenly divides」「smart sorting module」という抽象表現に留まる。流体の動的再配分挙動はプレイヤー検証であり公式仕様ではない。
- 評価の時点依存性:本レポートのレビュー評価は主に1.0(1月)〜Homecoming(7月)時点のもの。ライブサービスゲームのため、工業システムの評価は今後のアップデートで変動する。特に「中〜終盤でガチャが支配的」「工場が浅い」という批判は、その後のコンテンツ追加(Contingency Contract、Echoes of War等)で状況が変わりうる。
- バージョン日付:Homecoming(7月16日)等の将来アップデート情報は、リリース前のプレスリリース/開発者コメントに基づく記述を含み、実装後に細部が変わる可能性がある。
- RimWorldへの応用提言は、Endfieldが3Dリアルタイム・広大マップ前提であるのに対しRimWorldは2Dタイル・限定マップである点で、そのまま移植できない要素(物理的見通し依存の給電、広域ジップライン等)を含む。設計「思想」の抽出として読まれたい。

## 関連項目

- 上位索引: [research/endfield-aic](/research/endfield-aic/index.md)
- 同じ出典の前項: [Recommendations(RimWorld種族MOD設計への段階的提言)](/research/endfield-aic/003-RecommendationsRimWorld種族MOD設計への段階的提言.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- アークナイツ:エンドフィールド AICシステム 設計分析レポート（退役済み原本: `retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md`） — `Caveats`
