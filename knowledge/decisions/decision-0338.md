---
type: "Decision Log Entry"
title: "確定#338：仮称MOD名2件を文学作品名へ正式化——「スローターハウス5」「月を売った男」"
description: "仮称MOD名2件を文学作品名へ正式化——「スローターハウス5」「月を売った男」を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0338"
canonical_scope: "decision-history"
source_section: "確定#338"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#338：仮称MOD名2件を文学作品名へ正式化——「スローターハウス5」「月を売った男」

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_実装計画書_v1.md（MODファミリー一覧）・シオン/Shion_コンセプト設計書_v2.md・シオン/Shion_装備数値表_段0-2_v1.md]

ユーザー指示：

> さて名前決めをしよう
>（対象範囲の確認：「Tower Ledger統合工業システム（§13）のみ」ではなく、AskUserQuestionの選択肢のうち別項目を経て）「一個一個やろうか」
> Combat Extended互換パッチ（仮称）／Diaspora Tech company（仮称・構想段階）は取り敢えず文学作品から

拡張MOD群の命名慣習（小説・文学作品由来の名称で統一。実装計画書「拡張MOD名の命名方針」参照）に倣い、以下の2件を正式化した。候補はAIモデル側で提案し、AskUserQuestionでユーザーが確認・選択。

- **Combat Extended互換パッチ（仮称）** → **スローターハウス5**（原題：Slaughterhouse-Five・カート・ヴォネガット）。CEのアーマー貫通・実弾道系システム下での大幅な致死性強化という互換パッチの性質を、戦争の不条理・大量殺戮を扱う代表的な戦争文学のタイトルで表現。
- **Diaspora Tech company（仮称・構想段階）** → **月を売った男**（原題：The Man Who Sold the Moon・ロバート・A・ハインライン）。労働英雄勲章を得たГвоздикаが統合多技術を導入した上位互換武器線を開発する、というビジョナリー起業家による新技術商業化の物語構造が、原作の企業家主人公の構図と一致。**注意**：「Diaspora Tech company」という文字列自体は、Diaspora社の英語表記（在ロア企業名）としてはそのまま維持——資源植物資料・命名/言語設定資料・CoreMOD資料の研究ツリー（§9段1装備解禁研究「Diaspora Tech company」）・研究ツリー_統合v2.mermaid内の同名研究ノードは、MOD仮称ではなくこの在ロア企業名を指しているため改称対象外。

**反映箇所**：
- `シオン/Shion_実装計画書_v1.md`のMODファミリー一覧表：該当2行のMOD名列を新名称へ更新し、「旧称：〜・確定#338」を付記。Diaspora社の英語表記部分は「（英名：Diaspora Tech company）」という非改称の注記に修正。
- `シオン/Shion_コンセプト設計書_v2.md`：「Diaspora口径・装弾数一覧」節および注記内の2箇所のMOD参照を新名称（旧称併記）へ更新。
- `シオン/Shion_装備数値表_段0-2_v1.md`：残タスク一覧内の1箇所を新名称（旧称併記）へ更新。
- 在ロア企業名としての「Diaspora Tech company」（資源植物資料・命名/言語設定資料・CoreMOD資料研究ツリー・研究ツリー_統合v2.mermaid内）は非改称のまま維持。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#337：今回の開発目的をMVP（最小実行可能製品）までと明記（対象：Tower Ledger統合工業システム§13）](/decisions/decision-0337.md)
- 同じ出典の次項: [確定#339：仮称2件を最終確定——「Shion Race: 地場」→「Shion Race: Kombinat」、「分身」→「Shion Race: The Hive」](/decisions/decision-0339.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#338`
