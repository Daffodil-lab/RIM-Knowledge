# OKF保守ツール

保守ツールは`knowledge/tools/`に置く。コマンドはプロジェクトルートから実行する。

## 標準更新

コードを読まない利用者向けの目的、処理順、書込み範囲、失敗時結果は[OKF統合保守コード解説](/governance/okf-maintenance-code-guide-OKF統合保守コード解説.md)に記載する。

```powershell
node knowledge/tools/maintain-okf.mjs --write
```

日時精度、説明とファセット、横断索引、退役済み出典識別子を固定順に更新し、その後に標準検査をすべて実行する。

## 標準検査

```powershell
node knowledge/tools/maintain-okf.mjs --check
```

ファイルを変更せず、日時精度、説明、索引、出典、OKF 0.2互換性、RIM固有構造、領域横断重複、設定矛盾を検査する。

RIM固有構造検査は、全概念が一つ以上の登録済み主題荷札を持つこと、表記形式、重複、未登録語彙、権威・状態語彙の誤用がないことも検査する。

## 個別保守

- [統合更新・検査](maintain-okf.mjs)
- [説明・ファセット整備](refine-okf-descriptions.mjs)
- [横断ナビゲーション生成](build-okf-navigation.mjs)
- [所属MOD区分のoverride台帳](project-scope-overrides.json)
- [退役済み出典識別子の正規化](normalize-retired-source-links.mjs)
- [OKF日時精度の正規化](normalize-okf-v02-datetimes.mjs)
- [概念ファイル名の日本語併記](localize-okf-filenames.mjs)
- [OKF構造検査](validate-okf.mjs)
- [公式OKF 0.2互換性検査（日本語）](validate-okf-v02.mjs)
- [領域横断重複監査](audit-okf-overlap.mjs)
- [設定矛盾監査](audit-okf-contradictions.mjs)
- [Google上流OKF追随チェック](check-okf-upstream.mjs)
- [RIM-native Visualize](visualize-okf.mjs)

上流追随と可視化の自己検査は次で実行する。可視化HTMLは標準保守では生成しない。

```powershell
node knowledge/tools/check-okf-upstream.mjs --self-test
node knowledge/tools/visualize-okf.mjs --self-test
```

`build-okf.mjs`は削除済み原本から初回移行するための旧生成器であり、現在は実行禁止である。現行`knowledge/`の再生成や上書きには使用しない。

`finalize-backstory-review.mjs`、`resolve-backstory-canon-residuals.mjs`、`separate-backstory-layers.mjs`は、参考資料凍結前の一回限りの旧処理であり、現在は実行禁止である。`knowledge/reference/backstories/`を改稿せず、必要な内容は現行所有者へ新規作成する。

`audit-okf-overlap.mjs --check`は監査結果を表示し、30%以上の領域横断包含ペアが一件でもあれば終了コード1を返す。引数なしでは結果表示だけを行う。

`localize-okf-filenames.mjs --write`は、現行運用中で英語または技術IDだけの概念ファイル名へ日本語表題を追加し、Markdownリンクと所有者参照を同期する。`authority: reference`、`historical`、`catalog`の凍結資料は改名対象外とする。`--plan`で改名前の対応表を確認し、`--check`で現行概念の日本語のないファイル名を検出する。

## 公式OKF 0.2互換性検査

`validate-okf-v02.mjs`は日本語で結果を表示する。通常モードは公式仕様の必須違反で失敗し、推奨事項は警告として残す。改善監査では`--strict`、外部処理との連携では`--json`を使う。

```powershell
node knowledge/tools/validate-okf-v02.mjs
node knowledge/tools/validate-okf-v02.mjs --strict
node knowledge/tools/validate-okf-v02.mjs --json
```

仕様の意味と例は[Open Knowledge Format 0.2 日本語規範解説](/research/okf/00-Open-Knowledge-Format-v0.2-日本語解説.md)を参照する。

## 日付だけの生成来歴

旧資料の`generated.at: YYYY-MM-DD`は、元の日付を維持したまま`YYYY-MM-DDT00:00:00Z`へ正規化し、`generated.precision: "date"`で実時刻が不明であることを明示する。現在時刻への置換や時刻の推測は行わない。

```powershell
node knowledge/tools/normalize-okf-v02-datetimes.mjs --write
node knowledge/tools/normalize-okf-v02-datetimes.mjs --check
```
