# Kombinat中核仕様

## 項目

- [0. 結論](00-%E7%B5%90%E8%AB%96.md) — Kombinatは発注、設備能力、生産進捗、消費表示、流通目標、同盟通貨を所有し、物理ThingをCore Storageへ一元化する。
- [1. 製品境界](01-%E8%A3%BD%E5%93%81%E5%A2%83%E7%95%8C.md) — Kombinatはα版からCore独自保管・接続システムの公開入出庫境界へ接続し、保管内部を所有しない。
- [2. 状態分類](02-%E7%8A%B6%E6%85%8B%E5%88%86%E9%A1%9E.md) — 状態分類は、対象：状態とAhHanie/Matter-Network：外部で実装済みの必須依存。
- [3. 物理Thingと通貨](03-%E7%89%A9%E7%90%86Thing%E3%81%A8%E9%80%9A%E8%B2%A8.md) — 物理材料、工業資源、食料、薬品、武器、防具、固有品は実在するRimWorld ThingDef／Thingである。
- [4. Kombinat追加層の中核型](04-Kombinat%E8%BF%BD%E5%8A%A0%E5%B1%A4%E3%81%AE%E4%B8%AD%E6%A0%B8%E5%9E%8B.md) — KombinatはCore独自保管・接続システムに属する保管基盤型を再実装しない。
- [5. 発注と多段生産](05-%E7%99%BA%E6%B3%A8%E3%81%A8%E5%A4%9A%E6%AE%B5%E7%94%9F%E7%94%A3.md) — αの発注は具体的なThingDef、Recipe、数量または目標在庫を基本とする。
- [6. 無人生産](06-%E7%84%A1%E4%BA%BA%E7%94%9F%E7%94%A3.md) — Kombinat専用FactoryとKombinat専用Patternは、Pawnがいなくても電力、材料、設備状態を満たせば稼働できる。
- [7. Stasis](07-Stasis.md) — Core独自基盤は保管中の時間進行方針を自ら所有し、Matter NetworkのStasisを自動継承しない。
- [8. 消費と流通](08-%E6%B6%88%E8%B2%BB%E3%81%A8%E6%B5%81%E9%80%9A.md) — Kombinatは接続先保管基盤の内部消費を無断で監視せず、公開された観測境界だけを使う。
- [9. UI](09-UI.md) — Field Ledger Terminalを選択して全機能へ入る暗色のRimWorld管理Windowを基準とし、通常表示と最大化表示を同じDef駆動Page railで提供する。
- [10. 保存と原子性](10-%E4%BF%9D%E5%AD%98%E3%81%A8%E5%8E%9F%E5%AD%90%E6%80%A7.md) — Kombinatは次だけを保存するという方針の適用範囲と条件を定める。
- [11. 上流欠陥の扱い](11-%E4%B8%8A%E6%B5%81%E6%AC%A0%E9%99%A5%E3%81%AE%E6%89%B1%E3%81%84.md) — Matter Networkは必須経路にせず、将来の任意Adapterでだけ上流欠陥を分離する。
- [12. α完成条件](12-%CE%B1%E5%AE%8C%E6%88%90%E6%9D%A1%E4%BB%B6.md) — Kombinat αはShion種族実装に先行し、バニラHumanのfixtureでThingOwner間の直接転送、三段生産、任意排出を成立させる。
- [13. β](13-%CE%B2.md) — Equipment Familyは作者が明示登録した候補だけを使う。
- [14. 実装順](14-%E5%AE%9F%E8%A3%85%E9%A0%86.md) — 工業UIのRimWorld 1.6画面契約を先に固定し、Shion種族に先行してCore独自保管・接続システムとKombinatをバニラHumanのfixtureで完成させる。
