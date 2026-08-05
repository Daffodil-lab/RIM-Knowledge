---
type: "Decision Log Entry"
title: "確定#339：仮称2件を最終確定——「Shion Race: 地場」→「Shion Race: Kombinat」、「分身」→「Shion Race: The Hive」"
description: "仮称2件を最終確定——「Shion Race: 地場」→「Shion Race: Kombinat」、「分身」→「Shion Race: The Hive」を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "red-star"
  - "the-hive"
  - "canon"
organization_groups:
  - "kombinat-communities"
  - "red-star"
  - "the-hive"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0339"
canonical_scope: "decision-history"
source_section: "確定#339"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#339：仮称2件を最終確定——「Shion Race: 地場」→「Shion Race: Kombinat」、「分身」→「Shion Race: The Hive」

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_Kombinat_仕様書_v1.md（旧・シオン/Shion_地場_仕様書_v1.md）・シオン/Shion_実装計画書_v1.md・シオン/Shion_コンセプト設計書_v2.md・シオン/Shion_CoreMOD資料_v1.md・アークナイツ_エンドフィールドAIC設計分析レポート_v1.md]

ユーザー指示（複数ターンにわたる対話）：

> さて名前決めをしよう
>（AskUserQuestionで対象範囲確認：「一個一個やろうか」）
> Shion Race: 地場は単独で分かる名前が良い　文学作品由来だと単品としてみると分かりにくい分身もそう言う意味ではやめよう
>（AskUserQuestionでRed Starの扱いを確認：「Shion Race: Red Starは一応拡張MODなんで」→対象外に確定）
>（AskUserQuestionで現行名維持の可否を確認：「いや、別の候補も検討したい」）
> 拡張MOD達はさておき他のMODは名前で分からないと困る
>（この一般原則を受け、AIモデル側が「工業である事が分かる名前」の候補を提案）
> Shion Race: 地場は　Shion Race　○○（工業である事をが分かる名前）　分身は　Shion Race○○（どうしよ）
>（AIモデル側が「Kombinat」「ハイブ」を推奨候補として提示）
> Shion Race　The　ハイブとかで
>（「Kombinat」候補を提示）
> Kombinatで

**確定内容**：

- **「Shion Race: 地場」（仮称・旧称：Shion Race: 無零花）を「Shion Race: Kombinat」へ改称**——CoreMOD/Shion Race: The Hiveと同じ「骨格級MOD」は、拡張MOD群のような文学作品由来の名称ではなく、機能が名前だけで分かる名称にするという原則（Shion Race: Red Starのみ拡張MOD扱いのためこの原則の対象外）。「Kombinat」は国営工場・兵器廠を意味し、同盟のソ連工業国家的な世界観とも噛み合う。
- **「分身」（原題：Двойник〔The Double〕・ドストエフスキー・旧称/開発コード：Shion Nexus）を「Shion Race: The Hive」（通称：ハイブ）へ改称**——文学引用による命名を取りやめ、作中で既に定着していた「通称ハイブ」を正式名に格上げ。CoreMOD「The Manufactured Utopia...」と同じ「The」を冠する構えに揃えた。「Shion Race:」冠称も新たに付与——従来は分身のみ冠称なしだったが、骨格級MODとしての位置づけを明示するため統一。
- legacy用語（「地場濃度ゲージ」「ゼロ点エネルギー地場システム」等、放棄済み旧§12メカニクスの固有名詞）はMOD名の改称対象外——引き続き「地場」表記のまま残置する。これらはMOD名ではなく、旧仕様の歴史的記録としての固有名詞であるため。

**反映箇所**：

- `シオン/Shion_地場_仕様書_v1.md`の内容を`シオン/Shion_Kombinat_仕様書_v1.md`へ移設し、MOD名としての「地場」「分身」参照を全て「Kombinat」「Shion Race: The Hive（ハイブ）」へ更新（legacy用語は保持）。旧ファイルは削除許可が得られなかったため、冒頭に廃止・リダイレクト注記を追加した廃止スタブとして残置。
- `シオン/Shion_実装計画書_v1.md`：MODファミリー一覧表の該当行（CoreMOD・Shion Race: 地場・分身・Red Star各行）を更新。
- `シオン/Shion_コンセプト設計書_v2.md`：§17「分身」節見出しおよび本文を更新。
- `シオン/Shion_CoreMOD資料_v1.md`：§12移設済み注記を更新。
- `アークナイツ_エンドフィールドAIC設計分析レポート_v1.md`：資料区分の注記を更新。
- `シオン/Shion_資源植物_ミチューリン農芸公社資料_v1.md`：MOD名参照なし（全て「地場濃度」等のlegacy用語のみ）のため変更なし。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#338：仮称MOD名2件を文学作品名へ正式化——「スローターハウス5」「月を売った男」](/decisions/decision-0338-確定-仮称-名-件を文学作品名へ正式化-スローターハウス-月を売.md)
- 同じ出典の次項: [確定#340：母星「Купина」・球状星団「Твердь」の命名、および旧帝国の真アルコテック文明設定](/decisions/decision-0340-確定-母星-球状星団-の命名-および旧帝国の真アルコテック文明設.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#339`
