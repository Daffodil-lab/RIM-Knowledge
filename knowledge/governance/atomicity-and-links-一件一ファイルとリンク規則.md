---
type: "Governance Rule"
title: "一件一ファイルとリンク規則"
description: "知識は、単独で参照・更新・廃止できる最小単位へ分ける。"
tags:
  - "okf"
  - "governance"
  - "backstory"
  - "canon"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/atomicity-and-links"
canonical_scope: "okf-governance"
source_section: "一件一ファイルとリンク規則"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# 一件一ファイルとリンク規則

知識は、単独で参照・更新・廃止できる最小単位へ分ける。

## 分割単位

- 正史・全体設計: 一つの章題。
- 要件: `UX-001`、`KX-001`等の一つのID。
- 決定履歴: 一つの`確定#N`。
- バックストーリー: 一つの`SHION_CNNN`または`SHION_ANNN`。
- 調査資料: 一つの調査主題。

## リンク

標準Markdownリンクを使う。概念間リンクはバンドルルート相対の`/path/to/concept.md`を使い、関係の意味をリンク周辺の文章で明記する。各概念は上位索引、同じ出典の前後項目、関係する領域索引、移行元の出典へ接続する。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [重複と異なる粒度の管理規則](/governance/duplication-policy-重複と異なる粒度の管理規則.md)
- 同じ出典の次項: [OKF知識の更新手順](/governance/editing-workflow-知識の更新手順.md)
- バックストーリー群: [バックストーリー群](/reference/backstories/index.md)
- 正史: [正史](/world/index.md)
