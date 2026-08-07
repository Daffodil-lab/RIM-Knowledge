---
okf_version: "0.2"
---

# RIM Project Knowledge

Shion Race: Core、Kombinat、関連する世界設定・仕様・履歴を一件一ファイルで収めたOKFバンドルです。

## 読み始め

1. [権威順位とライフサイクル](governance/authority-and-lifecycle-知識の権威順位とライフサイクル.md)
2. [人間による承認境界](governance/human-approval-boundary-人間による承認境界.md)
3. [コード解説の作成規則](governance/code-explanation-policy-コード解説の作成規則.md)
4. [Open Knowledge Format 0.2 日本語規範解説](research/okf/00-Open-Knowledge-Format-v0.2-日本語解説.md)
5. [横断ナビゲーション](navigation/)
6. [改稿ダッシュボード](navigation/overhaul/)
7. [知識所有者マップ](governance/ownership-map-知識所有者マップ.md)
8. [オーバーホール中の矛盾判定規則](governance/contradiction-policy-オーバーホール中の矛盾判定規則.md)
9. [矛盾監査台帳](contradictions/)
10. [参考](reference/)
11. [正史・世界観](world/)
12. [全体設計](design/)
13. [リリース計画](roadmap/)

## 領域

- [制作・開示](authoring/) — 32件
- [人物](characters/) — 55件
- [矛盾監査](contradictions/) — 3件
- [独立開拓団](colony/) — 30件
- [決定履歴](decisions/) — 386件
- [全体設計](design/) — 58件
- [運用規則](governance/) — 11件
- [Kombinat](kombinat/) — 85件
- [横断ナビゲーション](navigation/) — 荷札から生成した派生索引
- [Pawn生産・保管・再生](pawn/) — 91件
- [プレイヤー向け設定](player-facing/) — 13件
- [参考](reference/) — 847件
- [調査・参照](research/) — 118件
- [リリース計画](roadmap/) — 12件
- [退役済み出典識別台帳](sources/) — 削除済み原本・コード・図版の墓標
- [OKF保守ツール](tools/) — 概念・索引・監査の保守
- [正史・世界観](world/) — 45件

## 使い方

- ファイル先頭の荷札（YAML frontmatter）で種別・状態・権威・出典を判定する。
- `tags`は主題を探すための横断荷札であり、正史性や資料状態の判定に使わない。権威は`knowledge_role`、`canonical_for`、`authority`、`status`から判定する。
- 同じ主題が複数に現れる場合は、`knowledge_role`と`canonical_owner`から唯一の所有者を辿る。
- 本文末尾の「関連項目」からグラフを辿る。
- 削除済み原本の由来は[退役済み出典識別台帳](sources/)の墓標識別子で確認する。原本文面や実体ファイルは参照できない。
- 現行仕様と履歴が競合する場合は、`authority`と`status`を優先する。
- オーバーホール中の相違は[矛盾監査台帳](contradictions/)で、真の衝突・改稿差分・未確定・実装予約・履歴へ分類する。
- 参考作品・要素、旧作、放棄案、実用に満たない作成物、バックストーリーは[参考](reference/)から辿る。参考資料だけでは現行正本を変更しない。
- 時代、組織、状態、主題から探す場合は[横断ナビゲーション](navigation/)を使う。派生索引は正本ではない。
