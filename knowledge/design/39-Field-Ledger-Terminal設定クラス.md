---
type: "Setting Class Catalog"
title: "39. 工業管制塔設定クラス"
description: "工業管制塔は、独立遠征共同体がコンビナートの生産、消費、流通と同盟通貨へ触れるための現地端末である。"
tags:
  - "shion"
  - "design"
  - "setting"
  - "facility"
  - "kombinat"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/field-ledger-terminal-setting-class"
canonical_scope: "product-architecture"
content_layer: "setting-class"
generated:
  by: "process:rim-canonical-owner-audit"
  at: "2026-07-26T00:00:00Z"
  precision: "date"
---

# 39. 工業管制塔設定クラス

工業管制塔は、独立遠征共同体がコンビナートの生産、消費、流通と同盟通貨へ触れるための現地端末である。コアMODからコンビナートへ入る最初の可視入口として使われ、選択時に登録済みの全管理ページと全操作へ到達できる。現行α版では独立遠征共同体向けの表示名を「工業管制塔」とする。将来、役割や由来の異なる端末を追加する場合は、同名の性能差へ押し込まず別の設定クラスとして審査する。

工業管制塔は全機能への操作入口を所有するが、在庫、通貨、台帳そのものを所有しない。破壊されても、端末の外部に正本として維持される共同体の台帳や通貨が同時に消滅する設備ではない。

独立遠征共同体向けに採用されたことと、現地で複雑な内部型を意識せず工業を運営する目的は確定する。発注者、設計組織、製造者、開発経緯、目的達成の歴史的評価、利用者評価、現在の同盟全域での配備状況、外形、材質、寸法は未確定である。

表示項目、操作、警告、内部識別子、`Gizmo`、建築定義、サイズ、耐久、電力、材料、工数、製造時間、破壊時処理は実装所有者が定める。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 実装所有者: [工業管制塔](/colony/16-Field-Ledger-Terminal-工業管制塔.md)
- 工業実行基盤: [コンビナート](/kombinat/index.md)
- 同盟通貨: [同盟通貨](/world/39-同盟通貨.md)
- 設定と実装: [設定クラスと実装値の分離](/authoring/15-設定クラスと実装値の分離.md)
- 表示言語: [日本語優先表記規則](/authoring/23-日本語優先表記規則.md)
