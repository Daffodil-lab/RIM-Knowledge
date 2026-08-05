---
type: "Decision Log Entry"
title: "確定#389：MVP廃止、α公開候補、β終了条件、完成前セーブ互換"
description: "MVP廃止、α公開候補、β終了条件、完成前セーブ互換を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "red-star"
  - "the-hive"
  - "independent-colony"
  - "equipment"
  - "canon"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
  - "the-hive"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0389"
canonical_scope: "decision-history"
source_section: "確定#389"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#389：MVP廃止、α公開候補、β終了条件、完成前セーブ互換

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――MVPを放棄する。α版はKombinatの倉庫・物流・多段生産を満たし、CoreのうちXMLで作れる限りの最低限の種族MODとして遊べる最初の公開候補とする。それ以外はβへ送り、Core MODとRed Starの完成宣言をβ終了条件とする。βを含む完成前はセーブデータ互換を考慮しなくてよい。]

- MVP／Foundationを独立した完成段階と出荷目標から廃止した。
- α版を、完成したKombinatの倉庫・物流・多段生産と、XML／Defで作れる最小のCore種族MODを一体化した最初の公開候補とした。
- 高度な身体Module、抽象装備解決、派閥Profile、生活・救援クエスト、Red Star、The Hive等をβへ移した。
- βはCore MODとRed Starの双方が完成宣言されるまで終了しない。The HiveはCoreへ統合された後期任意モジュールなのでCore完成宣言に含める。
- α／βでも同一ビルドの保存・ロードは必須だが、異なる版のセーブ互換、Migration、旧DefName・API・Scribeキー維持は要求しない。
- 版間セーブ互換の責任は1.0完成宣言から開始し、1.0がα／βの旧セーブを読み込む義務は負わない。

反映先：`シオンShion_Core_最終仕様_更新計画_v1.md`、`Kombinat_実装仕様書_v3.md`、`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`シオンShion_正史コア_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#388：618種バックストーリー、人工知能定義、特殊部隊・市民文化](/decisions/decision-0388-確定-種バックストーリー-人工知能定義-特殊部隊-市民文化.md)
- 同じ出典の次項: [確定#390：Kombinat停止保存、資産価値、破壊時保全、性能優先方式](/decisions/decision-0390-確定-停止保存-資産価値-破壊時保全-性能優先方式.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#389`
