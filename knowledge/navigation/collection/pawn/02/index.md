# pawn 小索引 02

範囲: SAVE-002 Ephemeral不在〜UX-006 簡易注文

## 項目

- [SAVE-002 Ephemeral不在](/pawn/save-002-%E4%B8%8D%E5%9C%A8.md) — MUST: 再資源化済みEphemeral Pawnは、保存・ロード後にWorld Pawn、Relation、Corpse、Archive、参照付き履歴として復活しない。
- [SAVE-003 同一ビルド往復](/pawn/save-003-%E5%90%8C%E4%B8%80%E3%83%93%E3%83%AB%E3%83%89%E5%BE%80%E5%BE%A9.md) — MUST: β期間中も同一ビルドの途中保存・ロードを保証する。
- [SAVE-004 途中状態](/pawn/save-004-%E9%80%94%E4%B8%AD%E7%8A%B6%E6%85%8B.md) — MUST: 生産、Dormant化、再配備、回収、再起動、再資源化、再実体化、Cloneの各途中状態から安全に再開する。
- [SAVE-005 ID一意性](/pawn/save-005-%E4%B8%80%E6%84%8F%E6%80%A7.md) — MUST: 保存・ロード後もdesignId、individualId、pawnInstanceId、lineageIdを重複させない。
- [SAVE-006 Archive欠損](/pawn/save-006-%E6%AC%A0%E6%90%8D.md) — MUST: 欠落Def、破損Archive、利用不能Moduleを無言で置換しない。
- [UX-001 Pawn Foundry](/pawn/ux-001-%E8%A6%81%E4%BB%B6.md) — MUST: Pawn Foundryの第一階層を次の三つにする。
- [UX-002 費用Preview](/pawn/ux-002-%E8%B2%BB%E7%94%A8.md) — MUST: 生産前にBody、Module、能力、装備、時間、現在在庫、不足、代替、登録方式を表示する。
- [UX-003 個体種別](/pawn/ux-003-%E5%80%8B%E4%BD%93%E7%A8%AE%E5%88%A5.md) — MUST: Ephemeral、Registered、Design output、Clone、Dormantを、色だけに依存せず文字とIconで区別する。
- [UX-004 破壊的操作](/pawn/ux-004-%E7%A0%B4%E5%A3%8A%E7%9A%84%E6%93%8D%E4%BD%9C.md) — MUST: Ephemeral遺体の再資源化とArchive削除は、同じ個体を復元できなくなることを明示する。
- [UX-005 Clone識別](/pawn/ux-005-%E8%AD%98%E5%88%A5.md) — MUST: 同名・同外見のCloneを許可しつつ、選択、医療、装備、命令で区別できる短い表示識別子を提供する。
- [UX-006 簡易注文](/pawn/ux-006-%E7%B0%A1%E6%98%93%E6%B3%A8%E6%96%87.md) — MUST: プレイヤーが詳細設計を開かず、「建築担当を一人」「射手を四人」「この個体のCloneを十人」のような注文を行える。
