# OKF保守ツール

保守ツールは`knowledge/tools/`に置く。コマンドはプロジェクトルートから実行する。

## 標準更新

```powershell
node knowledge/tools/normalize-okf-v02-datetimes.mjs --write
node knowledge/tools/refine-okf-descriptions.mjs --write
node knowledge/tools/build-okf-navigation.mjs --write
node knowledge/tools/normalize-retired-source-links.mjs --write
```

## 標準検査

```powershell
node knowledge/tools/normalize-okf-v02-datetimes.mjs --check
node knowledge/tools/refine-okf-descriptions.mjs --check
node knowledge/tools/build-okf-navigation.mjs --check
node knowledge/tools/normalize-retired-source-links.mjs --check
node knowledge/tools/validate-okf-v02.mjs
node knowledge/tools/validate-okf.mjs
node knowledge/tools/audit-okf-overlap.mjs
node knowledge/tools/audit-okf-contradictions.mjs
```

## 個別保守

- [説明・ファセット整備](refine-okf-descriptions.mjs)
- [横断ナビゲーション生成](build-okf-navigation.mjs)
- [退役済み出典識別子の正規化](normalize-retired-source-links.mjs)
- [OKF日時精度の正規化](normalize-okf-v02-datetimes.mjs)
- [OKF構造検査](validate-okf.mjs)
- [公式OKF 0.2互換性検査（日本語）](validate-okf-v02.mjs)
- [領域横断重複監査](audit-okf-overlap.mjs)
- [設定矛盾監査](audit-okf-contradictions.mjs)
- [Google上流OKF追随チェック](check-okf-upstream.mjs)
- [RIM-native Visualize](visualize-okf.mjs)
- [バックストーリー審査確定](finalize-backstory-review.mjs)
- [バックストーリー正史残件処理](resolve-backstory-canon-residuals.mjs)
- [バックストーリー層分離](separate-backstory-layers.mjs)

`build-okf.mjs`は削除済み原本から初回移行するための旧生成器であり、現在は実行禁止である。現行`knowledge/`の再生成や上書きには使用しない。

## Google上流チェックとVisualize

```powershell
node knowledge/tools/check-okf-upstream.mjs --self-test
node knowledge/tools/check-okf-upstream.mjs --check
node knowledge/tools/visualize-okf.mjs --self-test
node knowledge/tools/visualize-okf.mjs
```

上流チェックは`knowledge/tools/okf-upstream.json`の固定commitとGitHub API上の`main` commitをread-onlyで比較する。Visualizeは`knowledge/`の概念をRIM-nativeなHTMLへ変換し、既定では`knowledge/navigation/okf-viz.html`へ出力する。上流のVisualizeはOKF必須仕様ではない。

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
