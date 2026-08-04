---
type: "External Specification Reference"
title: "Open Knowledge Format 0.2 日本語規範解説"
description: "公式Open Knowledge Format 0.2の必須構造、出典、検証、鮮度、実行証明とRIM拡張の関係を日本語で確認できる参照資料。"
tags:
  - "okf"
  - "specification"
  - "japanese"
  - "governance"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "GoogleCloudPlatform/knowledge-catalog okf/SPEC.md"
generated:
  by: "process:codex-okf-v02-date-precision-update"
  at: "2026-08-04T18:44:05+09:00"
sources:
  - id: "official-okf-v02"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
    last_modified: "2026-07-24"
---

# Open Knowledge Format 0.2 日本語規範解説

この文書は、GoogleCloudPlatformの公式英語版Open Knowledge Format 0.2を、RIMで使う人が日本語で判断できるように整理した非公式の日本語解説である。解釈が食い違う場合は、固定コミットの[公式仕様](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md)を優先する。

原資料はApache License 2.0で公開されている。この文書は原資料を日本語化し、RIM固有の運用との対応を追記した派生資料であり、公式訳ではない。

## 規範語

- **MUST / REQUIRED（必須）**: 満たさなければOKF 0.2適合とは扱えない。
- **SHOULD / RECOMMENDED（推奨）**: 正当な理由がある場合は省略できるが、理由と影響を理解して判断する。
- **MAY / OPTIONAL（任意）**: 必要な場合に追加できる。

## 1. バンドルと概念ファイル

OKFバンドルはMarkdownファイルの集合である。通常の概念ファイルはUTF-8で保存し、本文の前にYAML frontmatterを置く。常に必須なのは`type`だけであり、用途に応じて追加キーを置ける。

```yaml
---
type: "Design Decision"
title: "出力バッファの所有者"
status: stable
---
```

未知の追加キーは拡張として許容する。したがって、RIMの`authority`、`knowledge_role`、`canonical_for`、`canonical_owner`等はOKF 0.2と両立する。

## 2. 予約ファイル

- `index.md`: 人とツールが領域へ入るための索引。下位の`index.md`にはfrontmatterを置かない。
- ルート`index.md`: `okf_version`を宣言できる。宣言する場合、frontmatterにはこのキーだけを置く。
- `log.md`: 日付付き変更記録。frontmatterを置かず、`YYYY-MM-DD`の見出しを新しい順に並べる。

予約ファイルは概念数に含めず、索引や履歴として扱う。

## 3. 生成来歴

ツールや処理が内容を生成・変換した場合は`generated`を置ける。`generated`を置く場合、実行主体の`by`が必須である。`at`を置く場合はISO 8601日時にする。RIMでは時差解釈を固定するためタイムゾーン付きを推奨する。

```yaml
generated:
  by: "process:rim-okf-navigation"
  at: "2026-08-04T18:07:08+09:00"
```

`generated`は人による正しさの確認を意味しない。生成と検証は別の事実である。

元資料に日付しかなく実時刻を復元できない場合、RIMはOKF拡張として`precision: "date"`を同じ`generated`内へ置く。`at`の`T00:00:00Z`は日付を機械可読にするための表現であり、実際の更新時刻ではない。

```yaml
generated:
  by: "process:rim-legacy-migration"
  at: "2026-07-26T00:00:00Z"
  precision: "date"
```

## 4. 出典

出典は`sources`のリストへ記録する。各出典では`resource`が必須であり、`id`、`title`、`author`、`usage_count`、`last_modified`等を追加できる。

```yaml
sources:
  - id: "official-okf-v02"
    resource: "https://example.invalid/SPEC.md"
    title: "Open Knowledge Format 0.2"
    last_modified: "2026-07-24"
```

本文で`[^official-okf-v02]`のような脚注識別子を使う場合、対応する`sources.id`を用意する。`usage_count`を記録する場合は、何日間・どの期間の利用数かを`usage_window`で示す。

削除済み原本を示すRIMの`retired-source://project/...`は、実体が消えた後も由来を保持する`resource`として扱う。

## 5. 検証、状態、鮮度

`verified`は、誰がいつ内容を出典と照合したかを表す。単一イベントのマッピングまたは複数イベントのリストで記録し、各イベントに`by`と`at`を置く。

```yaml
verified:
  - by: "process:okf-schema-check/1.0"
    at: "2026-08-04T18:07:08+09:00"
  - by: "human:reviewer-id"
    at: "2026-08-04T18:30:00+09:00"
```

人の確認は`human:<id>`、自動処理は`process:<id>`または`<producer>/<version>`で区別する。自動検査の成功を、人が内容を読んだ証拠へ置き換えてはならない。

`status`は`draft`、`stable`、`deprecated`のいずれかであり、省略時は`stable`として扱う。`stale_after`は内容を再確認すべき日を`YYYY-MM-DD`で示す。期限を過ぎても自動的に誤りになるわけではないが、再検証対象になる。

## 6. リンクと耐障害性

概念間は標準Markdownリンクで接続する。OKFの一般消費者は、任意メタデータの欠落や壊れたリンクがあっても、読める他の情報を処理し続けることが推奨される。

RIMはこれに加えて、正本の所有関係と内部リンクを保つため、ローカル検証で壊れたリンクをエラーにする。この厳格化はRIMバンドルの品質規則であり、OKF 0.2の相互運用要件を変更しない。

## 7. 実行証明付き計算

計算結果を再現可能な知識として保存する場合、`type: "Attested Computation"`を使う。`runtime`は必須であり、入力`parameters`、計算本体`computation`、実行主体`executor`、証明主体`attester`も記録することが推奨される。

```yaml
---
type: "Attested Computation"
runtime: "nodejs:24"
parameters:
  bundle: "knowledge/"
computation: "knowledge/tools/validate-okf-v02.mjs"
executor: "process:github-actions"
attester: "process:github-actions"
---
```

通常の設計文書や正史設定にこの型を付ける必要はない。計算条件と結果を一体で再利用したい記録に限定する。

## 8. RIMにおける適合層

RIMでは正規化と二つの検証層を分ける。

1. `normalize-okf-v02-datetimes.mjs`: 日付だけの旧生成来歴を、日付精度を保つRIM拡張付き日時へ正規化する。
2. `validate-okf-v02.mjs`: 公式OKF 0.2の構造、来歴、出典、検証、鮮度、実行証明を日本語で検査する。
3. `validate-okf.mjs`: RIM固有の正本所有、役割、説明文、リンク、バックストーリー要件を検査する。

通常モードは公式の必須違反だけで失敗し、推奨事項は警告する。厳格モードは警告も失敗扱いにする。

```powershell
node knowledge/tools/normalize-okf-v02-datetimes.mjs --check
node knowledge/tools/validate-okf-v02.mjs
node knowledge/tools/validate-okf-v02.mjs --strict
node knowledge/tools/validate-okf-v02.mjs --json
```

CIは通常モードを使う。既存資料を一括して`verified`へ変更せず、実際に出典照合した概念だけへ検証イベントを追加する。

## 関連項目

- RIMのメタデータ正本: [RIM OKFメタデータ契約](/governance/metadata-contract.md)
- 更新手順: [OKF知識の更新手順](/governance/editing-workflow.md)
- 検証コマンド: [OKF保守ツール](/tools/index.md)
- 公式英語版: [Open Knowledge Format 0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/3fcbb9f828c2f23d109c855ee403c3a4c81f3a96/okf/SPEC.md)
- ライセンス: [Apache License 2.0](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/LICENSE.md)
