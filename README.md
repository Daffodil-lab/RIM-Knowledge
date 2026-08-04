# Shion Race: Core — プロジェクト案内

> **更新日:** 2026-07-26  
> **知識形式:** Open Knowledge Format 0.2

プロジェクトの正規入口は[`knowledge/index.md`](knowledge/index.md)です。世界設定、製品設計、要件、監査、バックストーリー、決定履歴を一件一ファイルへ分割し、各ファイルの先頭にYAML frontmatter、末尾に関連リンクと出典を付けています。

## 読み始め

1. [`knowledge/governance/authority-and-lifecycle.md`](knowledge/governance/authority-and-lifecycle.md) — 権威順位と状態。
2. [`knowledge/navigation/index.md`](knowledge/navigation/index.md) — 時代・組織・状態・主題から探す横断索引。
3. [`knowledge/navigation/overhaul/index.md`](knowledge/navigation/overhaul/index.md) — candidate、re-audit、under-reviewだけを集めた改稿ダッシュボード。
4. [`knowledge/governance/contradiction-policy.md`](knowledge/governance/contradiction-policy.md) — オーバーホール中の矛盾判定。
5. [`knowledge/contradictions/index.md`](knowledge/contradictions/index.md) — 一件ごとの矛盾監査台帳。
6. [`knowledge/world/index.md`](knowledge/world/index.md) — 現行正史。
7. [`knowledge/design/index.md`](knowledge/design/index.md) — 製品と全体設計。
8. [`knowledge/roadmap/index.md`](knowledge/roadmap/index.md) — α、β、1.0の計画。

## 移行後の扱い

- 事実の正本は`knowledge_role: source-of-truth`と`canonical_for`で判定します。
- `summary`や`projection`は事実を再定義せず、`canonical_owner`で示した所有者へ従います。
- 領域ごとの唯一の所有者は[`knowledge/governance/ownership-map.md`](knowledge/governance/ownership-map.md)に定義しています。
- 旧原本、旧`docs/`、旧`Kombinat/`コード、図版、アーカイブ、廃止候補の実体は削除済みです。
- 削除済み資料の由来は[`knowledge/sources/index.md`](knowledge/sources/index.md)に`retired-source://project/...`形式の墓標識別子として保存しています。
- 墓標識別子はリンク、現行権威、原本文面の復元保証ではありません。
- 保守ツールは[`knowledge/tools/`](knowledge/tools/)に置きます。

## 保守

```powershell
node knowledge/tools/refine-okf-descriptions.mjs --check
node knowledge/tools/build-okf-navigation.mjs --check
node knowledge/tools/normalize-retired-source-links.mjs --check
node knowledge/tools/validate-okf.mjs
node knowledge/tools/audit-okf-overlap.mjs
node knowledge/tools/audit-okf-contradictions.mjs
```

概念を追加・更新した後は、`node knowledge/tools/refine-okf-descriptions.mjs --write`、`node knowledge/tools/build-okf-navigation.mjs --write`、`node knowledge/tools/normalize-retired-source-links.mjs --write`を実行します。旧原本は削除済みなので、全件再移行は行いません。`knowledge/tools/build-okf.mjs`は初回移行の履歴として残した実行禁止ツールです。
