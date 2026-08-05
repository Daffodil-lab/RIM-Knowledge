---
type: "Governance Rule"
title: "知識の権威順位とライフサイクル"
description: "このOKFバンドルはRIMプロジェクト知識の入口であり、原子的な概念ファイルを現行の参照単位とする。"
tags:
  - "okf"
  - "governance"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/authority-and-lifecycle"
canonical_scope: "okf-governance"
source_section: "知識の権威順位とライフサイクル"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# 知識の権威順位とライフサイクル

このOKFバンドルはRIMプロジェクト知識の入口であり、原子的な概念ファイルを現行の参照単位とする。

## 判定順

同じ主題が複数ファイルに現れる場合、まず`knowledge_role`と`canonical_for`で所有者を判定する。`summary`、`projection`、`reference`は、その本文だけで事実を確定せず`canonical_owner`を辿る。

同じ役割・同じ主題で競合した場合に限り、次の権威順位を使う。

1. `authority: canonical` の概念。
2. `authority: catalog` の個別レコード。
3. `authority: reference` の調査・参照資料。
4. `authority: protected-draft` の保護された未確定案。
5. `authority: historical` の決定履歴。

「参考」は利用区分であり、`authority: reference`だけを指す語ではない。`authority: catalog`のバックストーリー、`authority: reference`の外部調査、`authority: historical`の旧案はいずれも[参考資料の利用境界](/reference/00-参考資料の利用境界.md)に従い得る。参考資料は各記録の由来と内容を保持するが、現行正本の事実を所有しない。

元の大型文書、調査資料、コード、図版、アーカイブ、廃止候補の実体は移行完了後に削除された。移行時の由来は`retired-source://project/...`形式の墓標識別子だけを残し、現行判断には使用しない。

## OKF外原本の退役

OKF外の統合原本、カタログ、履歴、補助原本には「現行正本」の地位を与えない。現行の設定・設計・要件・検証結果を確定できるのは、`knowledge/`内で`canonical_for`を所有する概念だけである。

`sources.resource`および本文の`retired-source://project/...`は出典追跡用の識別子であり、リンク、原本文面の保存、権威の委譲ではない。識別子だけから旧記述を推測して現行設定へ追加してはならない。新しい設定は現在の正規所有者へ新規概念として登録する。

退役区分、物理削除、移行完了の証跡は旧資料退役監査が所有する。削除済み原本を復元しない限り、墓標識別子は解決不能であることを正常状態とする。

## ライフサイクル

- `stable`: 現在参照してよい。
- `draft`: 未確定または保護延期中。
- `deprecated`: リンクと履歴のためだけに残す。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の次項: [RIM OKFメタデータ契約](/governance/metadata-contract-メタデータ契約.md)
- 退役監査: [旧資料退役監査](/authoring/21-旧資料退役監査.md)
- 参考資料: [参考資料の利用境界](/reference/00-参考資料の利用境界.md)
