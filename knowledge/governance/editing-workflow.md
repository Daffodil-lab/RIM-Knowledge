---
type: "Governance Rule"
title: "OKF知識の更新手順"
description: "OKF知識の更新手順は、ルート索引から対象領域を選ぶ。"
tags:
  - "okf"
  - "governance"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/editing-workflow"
canonical_scope: "okf-governance"
source_section: "OKF知識の更新手順"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# OKF知識の更新手順

1. [ルート索引](/index.md)から対象領域を選ぶ。
2. [現行資料の正仕様記述](/governance/positive-specification-policy.md)に従い、現行資料へ採用済みの仕様を記述し、変更経緯を履歴資料へ記録する。
3. 一件の変更は一つの概念ファイルへ行う。
4. 関連する概念へ標準Markdownリンクを追加する。
5. 意味が変わった場合は`generated.at`を更新する。
6. 人が出典と照合した場合だけ`verified: { by: human:<id>, at: <ISO 8601> }`を追加する。
7. `node knowledge/tools/refine-okf-descriptions.mjs --write`で内容要約とファセット荷札を更新する。
8. `node knowledge/tools/build-okf-navigation.mjs --write`で横断索引と改稿ダッシュボードを再生成する。
9. `node knowledge/tools/normalize-retired-source-links.mjs --write`で削除済み原本への相対パスを墓標識別子へ正規化する。
10. 三ツールの`--check`と`node knowledge/tools/validate-okf.mjs`で要約、派生索引、出典識別子、frontmatter、リンクを検証する。
11. 現行概念を唯一の更新先とし、由来と変更経緯を決定記録へ保存する。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [一件一ファイルとリンク規則](/governance/atomicity-and-links.md)
- 横断索引: [横断ナビゲーション](/navigation/index.md)
- 保守ツール: [OKF保守ツール](/tools/index.md)
- 現行資料の記述: [現行資料の正仕様記述](/governance/positive-specification-policy.md)
