---
type: "Decision Log Entry"
title: "確定#240：コロニードクトリンをHoi4 2026年時点の最新仕様（1.17+「No Compromise, No Surrender」後のドクトリン再編）に合わせて二層構造へ更新——グランドドクトリン（4択・排他）＋ドクトリン軌道（4分野・独立選択・習熟度制）"
description: "コロニードクトリンをHoi4 2026年時点の最新仕様（1.17+「No Compromise, No Surrender」後のドクトリン再編）に合わせて二層構造へ更新——グランドドクトリン（4択・排他）＋ドクトリン軌道（4分野・独立選択・習熟度制）を確定した決定履歴。"
tags:
  - "decision-log"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0240"
canonical_scope: "decision-history"
source_section: "確定#240"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#240：コロニードクトリンをHoi4 2026年時点の最新仕様（1.17+「No Compromise, No Surrender」後のドクトリン再編）に合わせて二層構造へ更新——グランドドクトリン（4択・排他）＋ドクトリン軌道（4分野・独立選択・習熟度制）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §7.3、シオン/Shion_コンセプト設計書_v2.md §11]
ユーザー指示「hoi4のドクトリン最近のアプデでかなり変わっているからより最新の参照で」を受け、WebSearch＋web_fetchでHoi4公式Wiki「Land doctrine」ページを調査（[[feedback-meiko-workflow]]の「ツール込みで」再検証と同種の要求と判断し実際にツールで裏取り）。判明した現行仕様（1.17で導入・「No Compromise, No Surrender」以降さらに拡充）：①**グランドドクトリン**（Mobile Warfare/Superior Firepower/Grand Battleplan/Mass Assaultの4つ、名称自体は確定#239時点から変更なしと確認）は引き続き排他選択で1つのみ有効、変更すると陸軍フォルダの習熟度が全リセットされる。②新たに**ドクトリン軌道**（Infantry／Artillery & Combat Support／Armor／Operationsの4分野）が並立し、「グランドドクトリンは軌道の選択肢に影響しない」——どのグランドドクトリンでも軌道は共通の選択肢から自由に選べ、各軌道は同時に1つの下位選択のみ有効。③軌道は選んで終わりではなく、該当分野の部隊を実戦・訓練で運用することで「習熟度（Mastery）」が蓄積し、習熟が進むほど恩恵が強まる仕組み。この最新仕様を反映し、確定#239のコロニードクトリンを二層構造へ更新：**①グランドドクトリン**（物量/機動戦/火力偏重/堅陣防御、名称・方針は確定#239のまま）＋**②ドクトリン軌道**（歩兵／砲兵・支援／機甲／作戦の4分野、グランドドクトリンとは独立に選択・CoreMODには車両が無いため機甲軌道は個人重装甲で代替表現・実際の運用で習熟度が育つ）。グランドドクトリンの乗り換えは軌道習熟度の全リセットを伴う恒久コミットメントという性格を維持。CoreMOD資料v1§7.3を全面更新、コンセプト設計書v2§11の該当箇所も追記。習熟度の蓄積式・各軌道のボーナス数値・排他制の実装手段はPhase9で確定。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#239：確定#237「設計ドクトリン」（個体単位・非拘束）とは別に、コロニー全体で一度だけ選ぶHoi4式排他選択「コロニードクトリン」（物量/機動戦/火力偏重/堅陣防御の4択）を新設](/decisions/decision-0239.md)
- 同じ出典の次項: [確定#241：ドクトリン軌道「機甲」のCoreMOD対応効果を具体化——個人重装甲の装甲値強化＋重装甲特有の移動デバフ軽減（移動バフ）](/decisions/decision-0241.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#240`
