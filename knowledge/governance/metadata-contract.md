---
type: "Governance Rule"
title: "RIM OKFメタデータ契約"
description: "各概念ファイルの先頭にはYAML frontmatterを置く。"
tags:
  - "okf"
  - "governance"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/metadata-contract"
canonical_scope: "okf-governance"
source_section: "RIM OKFメタデータ契約"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# RIM OKFメタデータ契約

各概念ファイルの先頭にはYAML frontmatterを置く。

## 必須

- `type`: OKF必須の概念種別。

## RIM標準

- `title`: 表示名。
- `description`: 一文要約。
- `tags`: 横断分類。
- `status`: `draft | stable | deprecated`。
- `authority`: RIM内の権威区分。
- `knowledge_role`: 所有者、要約、投影、要件、検証、記録等の役割。
- `content_mode`: `positive-specification | history`。省略時は`positive-specification`として扱い、変更経緯を所有する履歴資料だけ`history`を指定する。
- `content_layer`: `setting-class | implementation`。世界内の意味を所有する設定クラスか、ゲーム上の値と処理を所有する実装かを、分離が必要な概念で示す。
- `canonical_for`: このファイルが正本として所有する主題。
- `canonical_scope`: 所有する上位領域。
- `canonical_owner`: 要約・投影・参照が従う唯一の所有者。
- `normative_basis`: 要件や検証が具体化する上位規範。
- `granularity`: section、requirement、record、decision、pointer等の粒度。
- `source_section`: 元文書内の見出しまたはレコードID。
- `generated`: 移行処理の実行主体と時刻。
- `sources`: 出典ファイル。
- `overhaul_state`: `under-review`の場合、この概念は改稿候補として隔離中。
- `canon_review`: カタログ項目の正史採否。`candidate | re-audit | accepted | rejected`。
- `eras`: この概念が明示的に属する時代ID。推測では付けない。
- `organization_groups`: 横断索引用に正規化した組織大分類。複数指定可能。
- `organization_names`: 出典に記録されたOrigin／Relation等の生の組織名。
- `conflict_class`、`conflict_state`、`blocking`: 矛盾監査台帳の分類、処置状態、完成阻害の有無。

未知の追加キーは保持し、`type`がない概念ファイルを作らない。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle.md)
- 同じ出典の次項: [知識所有者マップ](/governance/ownership-map.md)
- 矛盾判定: [オーバーホール中の矛盾判定規則](/governance/contradiction-policy.md)
- 横断索引: [横断ナビゲーション](/navigation/index.md)
- 設定と実装の分離: [設定クラスと実装値の分離](/authoring/15-設定クラスと実装値の分離.md)
- 現行資料の記述: [現行資料の正仕様記述](/governance/positive-specification-policy.md)
