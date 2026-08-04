---
type: "Governance Rule"
title: "現行資料の正仕様記述"
description: "履歴資料以外の文書は、採用済みの構造、状態、振る舞い、境界、失敗時結果、性能条件を正の仕様として記述する。"
tags:
  - "okf"
  - "governance"
  - "authoring"
  - "specification"
status: stable
authority: canonical
knowledge_role: governance
granularity: requirement
canonical_for: "governance/positive-specification-policy"
canonical_scope: "okf-governance"
generated:
  by: "process:positive-specification-policy"
  at: "2026-07-27"
---

# 現行資料の正仕様記述

履歴資料以外の文書は、現在採用されている仕様だけを本文に記述する。文書は対象が何であり、誰が所有し、どの入力を受け、どの状態へ遷移し、どの結果を返すかを直接示す。

## 現行資料

現行資料は次を記述する。

- 採用済みの名称、責務、所有者、データ、処理経路
- 成立条件、容量、権限、性能予算
- 正常時の状態遷移
- 失敗時に維持される所有状態とプレイヤーへ返す結果
- 実装順、受入条件、検証方法
- 他の正本との参照関係

境界は、対象システム自身の責務と公開契約で表現する。搬送境界であれば「送信元コンテナから受信先コンテナへ直接移す」、所有境界であれば「各Thingは常に一つの権威所有者に属する」のように記述する。

## 履歴資料

次の情報は履歴資料が所有する。

- 旧仕様、旧名称、旧構成
- 不採用案、廃止要素、比較表
- 移行過程、由来、変更理由
- 過去の依存関係と互換経緯
- 調査時点の判断過程

履歴資料は`authority: historical`、決定記録、移行記録、監査記録のいずれかとして識別する。現行資料から履歴情報を参照する場合は、本文へ再掲せず標準Markdownリンクまたは`source`系メタデータで接続する。

## 記述の変換

現行資料の文は、比較対象や除外対象ではなく採用対象を主語にする。

| 履歴へ置く情報 | 現行資料へ置く正仕様 |
|---|---|
| 旧方式との差分 | 現在の処理経路 |
| 採用しなかった依存先 | 現在の所有者と公開契約 |
| 禁止事項の列挙 | 許可される入力、状態遷移、出力 |
| 旧名称 | 現在の正式名称 |
| 失敗例の羅列 | 失敗時に保証される状態と通知 |

## 適用範囲

この規則は、設定、設計、要件、実装仕様、ロードマップ、UI資料、試験仕様、スキル、作業手順、プレイヤー向け解説へ適用する。物語内の台詞や描写は作品本文として扱い、設定事実を所有する説明部分にこの規則を適用する。

## 関連項目

- 上位索引: [運用規則](/governance/index.md)
- 権威判定: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle.md)
- 更新手順: [OKF知識の更新手順](/governance/editing-workflow.md)
- メタデータ: [RIM OKFメタデータ契約](/governance/metadata-contract.md)
- 一件一ファイル: [一件一ファイルとリンク規則](/governance/atomicity-and-links.md)
