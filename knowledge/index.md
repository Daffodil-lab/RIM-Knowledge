---
okf_version: "0.2"
---

# RIM Project Knowledge

Shion Race: Core、Kombinat、関連する世界設定・仕様・履歴を一件一ファイルで収めたOKFバンドルです。

## 読み始め

1. [現行正本ビュー](navigation/state/authority/canonical/) — 通常参照層の一つ。`authority: canonical`の現行正本を一覧する。
2. [現行カタログビュー](navigation/state/authority/catalog/) — 通常参照層の一つ。`authority: catalog`の現行カタログを一覧する。
3. [正本優先の通常参照方針](governance/canonical-first-reading-policy.md)
4. [権威順位とライフサイクル](governance/authority-and-lifecycle.md)
5. [知識所有者マップ](governance/ownership-map.md)
6. [横断ナビゲーション](navigation/)
7. [改稿ダッシュボード](navigation/overhaul/)
8. [オーバーホール中の矛盾判定規則](governance/contradiction-policy.md)
9. [矛盾監査台帳](contradictions/)
10. [正史・世界観](world/)
11. [全体設計](design/)
12. [リリース計画](roadmap/)

## 領域

- [制作・開示](authoring/) — 32件
- [バックストーリー](backstories/) — 845件
- [人物](characters/) — 55件
- [矛盾監査](contradictions/) — 3件
- [独立開拓団](colony/) — 30件
- [決定履歴](decisions/) — 379件、`authority: historical`かつ`status: deprecated`のリンク維持履歴層
- [全体設計](design/) — 59件
- [運用規則](governance/) — 10件
- [外部連携境界](integrations/) — 8件
- [Kombinat](kombinat/) — 86件
- [横断ナビゲーション](navigation/) — 荷札から生成した派生索引
- [Pawn生産・保管・再生](pawn/) — 91件
- [プレイヤー向け設定](player-facing/) — 13件
- [調査・参照](research/) — 117件、各ファイルの`knowledge_role`と`authority`に従う補助層。`reference`は証拠・来歴、`protected-draft`は未確定・保護案であり、現行仕様や検証根拠ではない
- [リリース計画](roadmap/) — 12件
- [退役済み出典識別台帳](sources/) — 削除済み原本・コード・図版の墓標
- [OKF保守ツール](tools/) — 概念・索引・監査の保守
- [正史・世界観](world/) — 45件

## 使い方

- ファイル先頭の荷札（YAML frontmatter）で種別・状態・権威・出典を判定する。
- 同じ主題が複数に現れる場合は、`knowledge_role`と`canonical_owner` / `canonical_for`から唯一の所有者を辿る。
- 現行の事実は、まず`knowledge_role`と`canonical_owner` / `canonical_for`を解決し、その後に`authority`と`status`を適用する。通常参照層は[現行正本ビュー](navigation/state/authority/canonical/)と[現行カタログビュー](navigation/state/authority/catalog/)であり、決定履歴は`authority: historical`かつ`status: deprecated`のリンク維持履歴層、調査・参照資料はそれぞれの荷札に従う補助層として確認する。
- 本文末尾の「関連項目」からグラフを辿る。
- 削除済み原本の由来は[退役済み出典識別台帳](sources/)の墓標識別子で確認する。原本文面や実体ファイルは参照できない。
- 現行仕様と履歴が競合する場合は、`authority`と`status`を優先する。
- オーバーホール中の相違は[矛盾監査台帳](contradictions/)で、真の衝突・改稿差分・未確定・実装予約・履歴へ分類する。
- 時代、組織、状態、主題から探す場合は[横断ナビゲーション](navigation/)を使う。派生索引は正本ではない。
