---
type: "Governance Rule"
title: "RIM OKFメタデータ契約"
description: "RIM概念ファイルのOKF 0.2標準メタデータと正本所有拡張の必須構造を定める。"
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
  by: "process:codex-okf-v02-date-precision-update"
  at: "2026-08-04T18:44:05+09:00"
sources:
  - id: "official-okf-v02"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
    last_modified: "2026-07-24"
---

# RIM OKFメタデータ契約

各概念ファイルの先頭にはYAML frontmatterを置く。

## 必須

- `type`: OKF必須の概念種別。

## OKF 0.2標準

- `generated`: 生成・変換処理の来歴。置く場合は`by`を必須とし、`at`はISO 8601日時にする。RIMでは時差解釈を固定するためタイムゾーン付きを推奨する。
- `sources`: 出典のリスト。各出典では`resource`を必須とし、`id`、`title`、`author`、`usage_count`、`last_modified`を追加できる。
- `usage_window`: `usage_count`を集計した期間。
- `verified`: 出典照合を行った主体と時刻。自動検査と人の確認を別イベントとして記録する。
- `status`: `draft | stable | deprecated`。省略時は`stable`。
- `stale_after`: 再確認日を示す`YYYY-MM-DD`。
- `runtime`: `type: "Attested Computation"`で必須となる実行環境。
- `parameters`、`computation`、`executor`、`attester`: 実行証明付き計算の入力、計算本体、実行主体、証明主体。

未知の追加キーは保持する。OKF標準キーの構造とRIM拡張キーの意味を混同しない。

## RIM標準

- `title`: 表示名。
- `description`: 一文要約。
- `tags`: 横断分類。
- `status`: OKF標準の状態をRIMの権威判定にも使用する。
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
- `generated`: OKF標準構造を使い、RIMの生成器または移行処理の実行主体と時刻を記録する。
- `generated.precision`: 元記録が日付だけで実時刻を復元できない場合に`date`を置くRIM拡張。`generated.at`は同日`T00:00:00Z`で表し、この時刻を実際の更新時刻として解釈しない。
- `sources`: OKF標準構造を使い、現存する出典と`retired-source://project/...`の由来墓標を記録する。
- `overhaul_state`: `under-review`の場合、この概念は改稿候補として隔離中。
- `reference_review`: 参考資料としての採否。`candidate | re-audit | reference-only | accepted | rejected`。`reference-only`は現状が実用未達で、再利用を保証しない参考保管を表す。バックストーリーでは必須とし、正史・実装・出荷の採否には使用しない。
- `canon_review`: 正本への採否を明示する必要があるカタログ項目だけに使用する。参考資料へ分類したバックストーリーには使用しない。
- `eras`: この概念が明示的に属する時代ID。推測では付けない。
- `organization_groups`: 横断索引用に正規化した組織大分類。複数指定可能。
- `organization_names`: 出典に記録されたOrigin／Relation等の生の組織名。
- `conflict_class`、`conflict_state`、`blocking`: 矛盾監査台帳の分類、処置状態、完成阻害の有無。

`verified`は実際に照合した事実だけを記録する。機械検査を`process:<id>`、人の確認を`human:<id>`として分離し、既存概念へ一括付与しない。

日付だけの旧`generated.at`は、日付情報を失わずOKF 0.2の日時形式へ合わせるため、`YYYY-MM-DDT00:00:00Z`と`precision: "date"`の組で保持する。既知の日付を現在時刻へ置換せず、未記録の時刻を推測しない。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle.md)
- 同じ出典の次項: [知識所有者マップ](/governance/ownership-map.md)
- 矛盾判定: [オーバーホール中の矛盾判定規則](/governance/contradiction-policy.md)
- 横断索引: [横断ナビゲーション](/navigation/index.md)
- 設定と実装の分離: [設定クラスと実装値の分離](/authoring/15-設定クラスと実装値の分離.md)
- 現行資料の記述: [現行資料の正仕様記述](/governance/positive-specification-policy.md)
- 参考資料: [参考資料の利用境界](/reference/00-参考資料の利用境界.md)
- OKF 0.2日本語解説: [Open Knowledge Format 0.2 日本語規範解説](/research/okf/00-Open-Knowledge-Format-v0.2-日本語解説.md)
- 互換性検証: [OKF保守ツール](/tools/index.md)
