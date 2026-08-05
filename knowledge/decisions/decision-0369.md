---
type: "Decision Log Entry"
title: "確定#369：ロアからゲーム内フレーバーへの変換台帳"
description: "ロアからゲーム内フレーバーへの変換台帳を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0369"
canonical_scope: "decision-history"
source_section: "確定#369"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#369：ロアからゲーム内フレーバーへの変換台帳

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-16ユーザー要請――確定ロアをゲーム内フレーバーテキストへ落とし込めるようにする。]

- `docs/36_LORE_TO_FLAVOR_TEXT_BRIDGE.md` を新設し、確定正史／プレイヤー公開可の文章を `FlavorID`、表示先、公開区分、語り手層、出典付きの短文へ変換する規約と初期カタログを追加。
- `lore/01`〜`lore/12`を説明、研究、建築、アイテム、イベント、Q&A等へ割り当てる変換表を追加し、用途別分冊から表示文を再利用できるようにした。
- 公式層、匿名のソフェル層、第三者層を分離し、秘匿・未確定・廃止設定・外部参考を通常のゲーム内表示へ出さない境界を明記。
- これは新しい正史や実装仕様ではなく、XML、Def、C#、公開APIを変更しない制作橋渡し資料とする。

反映先：`シオンShion_ロア設定資料_開発者向け_v1.md`、`シオンShion_ロア設定資料_プレイヤー向け_v1.md`、`lore/README.md`、`docs/36_LORE_TO_FLAVOR_TEXT_BRIDGE.md`。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#368：帝国の降伏、吸収、ソフェル継承、帝国式建築](/decisions/decision-0368.md)
- 同じ出典の次項: [確定#370：配置先に迷う場合のバックストーリー／研究フォールバック](/decisions/decision-0370.md)
- 正史: [正史](/world/index.md)
- 制作・開示規則: [制作・開示規則](/authoring/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#369`
