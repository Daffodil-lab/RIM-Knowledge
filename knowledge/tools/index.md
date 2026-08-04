# OKF保守ツール

保守ツールは`knowledge/tools/`に置く。コマンドはプロジェクトルートから実行する。

## 標準更新

```powershell
node knowledge/tools/refine-okf-descriptions.mjs --write
node knowledge/tools/build-okf-navigation.mjs --write
node knowledge/tools/normalize-retired-source-links.mjs --write
```

## 標準検査

```powershell
node knowledge/tools/refine-okf-descriptions.mjs --check
node knowledge/tools/build-okf-navigation.mjs --check
node knowledge/tools/normalize-retired-source-links.mjs --check
node knowledge/tools/validate-okf.mjs
node knowledge/tools/audit-okf-overlap.mjs
node knowledge/tools/audit-okf-contradictions.mjs
```

## 個別保守

- [説明・ファセット整備](refine-okf-descriptions.mjs)
- [横断ナビゲーション生成](build-okf-navigation.mjs)
- [退役済み出典識別子の正規化](normalize-retired-source-links.mjs)
- [OKF構造検査](validate-okf.mjs)
- [領域横断重複監査](audit-okf-overlap.mjs)
- [設定矛盾監査](audit-okf-contradictions.mjs)
- [バックストーリー審査確定](finalize-backstory-review.mjs)
- [バックストーリー正史残件処理](resolve-backstory-canon-residuals.mjs)
- [バックストーリー層分離](separate-backstory-layers.mjs)

`build-okf.mjs`は削除済み原本から初回移行するための旧生成器であり、現在は実行禁止である。現行`knowledge/`の再生成や上書きには使用しない。
