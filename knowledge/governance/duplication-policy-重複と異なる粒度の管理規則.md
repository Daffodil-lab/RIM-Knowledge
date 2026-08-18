---
type: "Governance Rule"
title: "重複と異なる粒度の管理規則"
description: "同じ内容を異なる粒度で必要とする場合でも、事実の所有者は一つにする。"
tags:
  - "okf"
  - "governance"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/duplication-policy"
canonical_scope: "okf-governance"
source_section: "重複と異なる粒度の管理規則"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# 重複と異なる粒度の管理規則

同じ内容を異なる粒度で必要とする場合でも、事実の所有者は一つにする。

## 許される重なり

- `projection`: プレイヤー向け表現。必ず`canonical_owner`へ従う。
- `summary`: 索引や旧見出しからの導線。本文を複製せず所有者へリンクする。
- `requirement`: 上位設計を実装可能なMUSTへ具体化する。重なりが大きい場合は`normative_basis`を付ける。
- `verification`: 要件を試験可能なシナリオへ変換する。
- `historical-record`と`reference`: 経緯と外部根拠。現行事実を所有しない。

## 禁止

- 同じ事実を二つの`source-of-truth`へ記載する。
- Summary Pointerへ元の説明本文を残す。
- 文書ごとの定型的な「概要」を概念として量産する。
- `canonical_owner`なしに投影や要約を作る。

## 監査

`node knowledge/tools/audit-okf-overlap.mjs`は異なる領域間の本文を7文字shingleで比較し、小さい側の30%以上が一致する組を報告する。`normative_basis`で明示された具体化は管理済みとして除外する。監査結果は0組を保つ。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [知識所有者マップ](/governance/ownership-map-知識所有者マップ.md)
- 同じ出典の次項: [一件一ファイルとリンク規則](/governance/atomicity-and-links-一件一ファイルとリンク規則.md)
- 制作・開示規則: [制作・開示規則](/authoring/index.md)
