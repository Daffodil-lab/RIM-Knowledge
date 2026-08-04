# pawn 小索引 02

範囲: SAVE-002 Ephemeral不在〜UX-006 簡易注文

## 項目

- [SAVE-002 Ephemeral不在](/pawn/save-002.md) — MUST: 再資源化済みEphemeral Pawnは、保存・ロード後にWorld Pawn、Relation、Corpse、Archive、参照付き履歴として復活しない。
- [SAVE-003 同一ビルド往復](/pawn/save-003.md) — MUST: β期間中も同一ビルドの途中保存・ロードを保証する。
- [SAVE-004 途中状態](/pawn/save-004.md) — MUST: 生産、Dormant化、再配備、回収、再起動、再資源化、再実体化、Cloneの各途中状態から安全に再開する。
- [SAVE-005 ID一意性](/pawn/save-005.md) — MUST: 保存・ロード後もdesignId、individualId、pawnInstanceId、lineageIdを重複させない。
- [SAVE-006 Archive欠損](/pawn/save-006.md) — MUST: 欠落Def、破損Archive、利用不能Moduleを無言で置換しない。
- [UX-001 Pawn Foundry](/pawn/ux-001.md) — MUST: Pawn Foundryの第一階層を次の三つにする。
- [UX-002 費用Preview](/pawn/ux-002.md) — MUST: 生産前にBody、Module、能力、装備、時間、現在在庫、不足、代替、登録方式を表示する。
- [UX-003 個体種別](/pawn/ux-003.md) — MUST: Ephemeral、Registered、Design output、Clone、Dormantを、色だけに依存せず文字とIconで区別する。
- [UX-004 破壊的操作](/pawn/ux-004.md) — MUST: Ephemeral遺体の再資源化とArchive削除は、同じ個体を復元できなくなることを明示する。
- [UX-005 Clone識別](/pawn/ux-005.md) — MUST: 同名・同外見のCloneを許可しつつ、選択、医療、装備、命令で区別できる短い表示識別子を提供する。
- [UX-006 簡易注文](/pawn/ux-006.md) — MUST: プレイヤーが詳細設計を開かず、「建築担当を一人」「射手を四人」「この個体のCloneを十人」のような注文を行える。
