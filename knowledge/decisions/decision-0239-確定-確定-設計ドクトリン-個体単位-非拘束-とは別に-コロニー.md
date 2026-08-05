---
type: "Decision Log Entry"
title: "確定#239：確定#237「設計ドクトリン」（個体単位・非拘束）とは別に、コロニー全体で一度だけ選ぶHoi4式排他選択「コロニードクトリン」（物量/機動戦/火力偏重/堅陣防御の4択）を新設"
description: "確定番号237「設計ドクトリン」（個体単位・非拘束）とは別に、コロニー全体で一度だけ選ぶHoi4式排他選択「コロニードクトリン」（物量/機動戦/火力偏重/堅陣防御の4択）を新設を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "independent-colony"
  - "canon"
organization_groups:
  - "independent-frontier"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0239"
canonical_scope: "decision-history"
source_section: "確定#239"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#239：確定#237「設計ドクトリン」（個体単位・非拘束）とは別に、コロニー全体で一度だけ選ぶHoi4式排他選択「コロニードクトリン」（物量/機動戦/火力偏重/堅陣防御の4択）を新設

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §7.3、シオン/Shion_コンセプト設計書_v2.md §11]
ユーザー指示「コロニーが保有しているHoi4式の排他選択ツリーもドクトリンも追加して」を受け実施。確定#237の「設計ドクトリン」は個体ごとに自由に使い分けられる非拘束の指針だったが、ユーザーは加えて**コロニー（開拓団）そのものが恒久的に持つ、Hoi4の国家教義のような排他選択ツリー**を明示的に要求。これを受け、Hoi4land doctrineの代表4系統（Mobile Warfare／Superior Firepower／Mass Assault／Grand Battleplan）を翻案した**物量／機動戦／火力偏重／堅陣防御**の4択を新設。研究ツリー上で1つを選ぶと残り3つは以後選択不可という、同盟本国のような大国ではなく独立開拓団という小規模集団の規模に合わせた恒久コミットメントとして位置づけた。7.1「設計ドクトリン」（個体単位・都度選び直せる非拘束の任意提案）と7.3「コロニードクトリン」（コロニー単位・一度だけの恒久排他選択）は明確に階層が異なる別メカニクスであることを両資料に明記。CoreMOD資料v1§7.3に新設、コンセプト設計書v2§11に要点を追記。排他制の具体的な実装手段（`ResearchProjectDef`の相互排他化等）・各ボーナス数値はPhase9で確定。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#238：CoreMODの「職級を持たない汎用個体」に、職級より緩く効果も小さい「任務」ラベルを新設——⑤識別・命名タブで役割を自己申告できる仕組み](/decisions/decision-0238-確定-の-職級を持たない汎用個体-に-職級より緩く効果も小さい.md)
- 同じ出典の次項: [確定#240：コロニードクトリンをHoi4 2026年時点の最新仕様（1.17+「No Compromise, No Surrender」後のドクトリン再編）に合わせて二層構造へ更新——グランドドクトリン（4択・排他）＋ドクトリン軌道（4分野・独立選択・習熟度制）](/decisions/decision-0240-確定-コロニードクトリンを-年時点の最新仕様-後のドクトリン再編.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#239`
