---
type: "Technical Guide"
title: "OKF統合保守コード解説"
description: "maintain-okf.mjsは、OKF派生資料を固定順で更新し、構造、リンク、重複、矛盾を一括検査するローカル実行用の統合入口である。"
tags:
  - "code-reference"
  - "governance"
  - "maintenance"
  - "verification"
status: stable
authority: canonical
knowledge_role: projection
granularity: section
canonical_for: "governance/okf-maintenance-code-guide"
canonical_scope: "okf-governance"
canonical_owner:
  - "/governance/editing-workflow-知識の更新手順.md"
generated:
  by: "process:accessible-code-explanation-policy"
  at: "2026-08-06T16:43:14+09:00"
---

# OKF統合保守コード解説

## 一分要約

`maintain-okf.mjs`は、RIM-Knowledgeの保守作業を一つの入口へまとめるNode.jsスクリプトである。`--write`は説明、荷札、派生索引、退役済み出典識別子、矛盾台帳集計を更新してから全検査を実行する。`--check`はファイルを変更せず、現在の内容が同じ検査へ合格するか確認する。

このスクリプトは外部サイトへ接続せず、現在のリポジトリ内にある`knowledge/`だけを対象に、子スクリプトを固定順で一つずつ実行する。途中の子スクリプトが失敗すると、その時点で停止する。

## 動作の流れ

1. 実行時の引数が`--write`または`--check`のどちらか一つであることを確認する。
2. 現在位置に`knowledge/`と`knowledge/tools/`があることを確認し、別の場所からの誤実行を拒否する。
3. `--write`では、日時精度、説明とファセット、横断ナビゲーション、退役済み出典、矛盾台帳集計の五更新を順番に実行する。
4. 日時正規化器の自己試験を実行し、frontmatter内の対象だけを変換することを確認する。
5. 日時精度、説明、ナビゲーション、出典、OKF 0.2互換性、日本語ファイル名、RIM固有構造、領域横断重複、設定矛盾を順番に検査する。
6. 各処理は終了コード`0`で成功を返す。開始不能または`0`以外を返した処理がある場合、後続処理を実行せず、その終了コードで停止する。
7. 全処理が成功した場合だけ、統合保守の合格を表示する。

## 入力、出力、状態変更

| 項目 | 内容 |
|---|---|
| 主入力 | `knowledge/`内の概念Markdown、領域索引、矛盾台帳、保守用JSON |
| `--write`の出力 | 現行概念の説明・ファセット、`knowledge/navigation/`、件数等を持つ索引、退役済み外部原本の墓標表現、矛盾台帳索引の集計 |
| `--check`の出力 | コンソールへ出す合否、件数、警告、修正が必要なファイル名 |
| 変更しない対象 | C#、XML Def、画像、DLL、ゲーム保存、Git履歴、GitHub上のbranchやPull Request |
| 外部副作用 | ネットワーク接続、パッケージ導入、Git commit、pushを行わない |

## コード対応表

| ファイルまたは関数 | 役割 | 書込み範囲と失敗時結果 |
|---|---|---|
| `maintain-okf.mjs`の`usage()` | 引数の使い方を表示し、不正な組合せを拒否する | 対象ファイルを書き込まず終了する |
| `maintain-okf.mjs`の`run()` | Node.jsで子スクリプトを一つ実行し、標準出力と終了コードを引き継ぐ | 子処理が失敗すると後続処理を開始しない |
| `normalize-okf-v02-datetimes.mjs` | 日付だけの`generated.at`を同日0時UTCと`precision: date`の組へ正規化する | `--write`では該当概念だけを書き、`--check`では差分があれば失敗する |
| `refine-okf-descriptions.mjs` | 現行概念の説明と時代・組織ファセットを導出する | `reference`、`historical`、`catalog`を除外し、問題または未生成差分があれば失敗する |
| `build-okf-navigation.mjs` | 荷札から横断索引を再生成し、既存索引の件数と要約を同期する | 安全な絶対パスか確認後、`knowledge/navigation/`だけを削除して再作成する |
| `normalize-retired-source-links.mjs` | 存在しない`knowledge/`外の旧ローカル参照を`retired-source://`墓標へ変換する | 存在する参照と`knowledge/`内参照を維持し、`--check`では必要差分を報告する |
| `audit-okf-contradictions.mjs --write` | 矛盾ケースから索引内の件数、状態、分類、阻害件数を再集計する | 境界マーカー内の集計だけを書き換える |
| `validate-okf-v02.mjs` | 公式OKF 0.2の必須構造を検査する | 読取り専用で、必須違反があれば失敗する |
| `localize-okf-filenames.mjs --check` | 現行概念の日本語併記ファイル名を検査する | 統合保守では改名せず、必要な改名があれば失敗する |
| `validate-okf.mjs` | RIM固有メタデータ、正本所有、荷札、リンク、予約ファイルを検査する | 読取り専用で、構造違反または破損リンクがあれば失敗する |
| `audit-okf-overlap.mjs --check` | 異なる領域間の本文包含率を監査する | 30%以上の未管理重複があれば失敗する |

## 失敗時とrollback

`--write`は一括transactionではない。後半の検査が失敗した場合、それ以前の更新結果は作業ツリーに残る。自動rollbackは行わないため、作業者は`git diff`で変更範囲を確認し、原因を修正して再実行する。不要な変更を戻す場合は、対象commitをrevertするか、対象ファイルを明示して安全な復元手順を使う。

横断ナビゲーション生成器は`knowledge/navigation/`を再作成する前に、対象の絶対パスが`knowledge/`直下の想定領域であることを確認する。検査だけを行う場合は先に`--check`を使い、派生資料が古い場合だけ`--write`を実行する。

## 生成元と手編集境界

`knowledge/navigation/`は生成物であり、手編集しない。内容を変える場合は、概念の荷札、正本メタデータ、または`build-okf-navigation.mjs`を変更して再生成する。通常の概念本文とfrontmatterは正本であり、生成器が変更する項目と人が記述する項目を差分で確認する。

`build-okf.mjs`と、参考資料凍結前に使用した三つのバックストーリー処理スクリプトは統合保守から呼び出されず、現行`knowledge/`へ実行しない。

## 用語

- Node.js: JavaScript保守スクリプトを実行する環境。
- frontmatter: Markdown先頭の`---`で囲まれたメタデータ。
- 派生資料: 正本の荷札や内容から再生成できる索引・表示用資料。
- 終了コード: 処理が成功したかを親スクリプトへ返す整数。`0`が成功で、それ以外は失敗。
- rollback: 途中まで行われた変更を取り消し、実行前の状態へ戻すこと。

## 検査方法と未確認事項

```powershell
node knowledge/tools/maintain-okf.mjs --write
node knowledge/tools/maintain-okf.mjs --check
git diff --check
```

この検査は知識bundleの機械的一貫性を確認する。設定内容の妥当性、RimWorld内の動作、保存・読込、UI、性能、GitHub Actionsの実行結果は別に確認する。

## 関連項目

- 正本: [OKF知識の更新手順](/governance/editing-workflow-知識の更新手順.md)
- 解説規則: [コード解説の作成規則](/governance/code-explanation-policy-コード解説の作成規則.md)
- 人間の承認: [人間による承認境界](/governance/human-approval-boundary-人間による承認境界.md)
- 保守ツール索引: [OKF保守ツール](/tools/index.md)
