# Matter Network境界

## 項目

- [1. 決定](01-%E6%B1%BA%E5%AE%9A.md) — Matter Networkは必須依存にせず、公開された安定APIが存在する場合だけ任意互換Adapterを検討する。
- [2. 保護される上流領域](02-%E4%BF%9D%E8%AD%B7%E3%81%95%E3%82%8C%E3%82%8B%E4%B8%8A%E6%B5%81%E9%A0%98%E5%9F%9F.md) — Matter Networkの上流内部は、任意互換を検討する場合もCoreとKombinatの設計・Release Gate・欠陥修正対象から除外する。
- [3. 上流由来の欠陥](03-%E4%B8%8A%E6%B5%81%E7%94%B1%E6%9D%A5%E3%81%AE%E6%AC%A0%E9%99%A5.md) — 任意互換Adapterの試験でMatter Network単体に再現する問題は、CoreまたはKombinatの欠陥に分類しない。
- [4. Stasis](04-Stasis.md) — Matter NetworkのStasis挙動は上流固有の参考情報であり、Core独自システムへ自動継承しない。
- [5. Kombinatが追加できる領域](05-Kombinat%E3%81%8C%E8%BF%BD%E5%8A%A0%E3%81%A7%E3%81%8D%E3%82%8B%E9%A0%98%E5%9F%9F.md) — KombinatはCore独自保管システムの外側で発注・生産・通貨を所有し、Matter Network互換は任意Adapterへ隔離する。
- [6. 配布と版](06-%E9%85%8D%E5%B8%83%E3%81%A8%E7%89%88.md) — Matter NetworkをCoreの必須依存や同梱物にせず、将来の任意互換Adapterだけを別配布する。
- [7. 試験境界](07-%E8%A9%A6%E9%A8%93%E5%A2%83%E7%95%8C.md) — Matter Network関連試験は任意互換Adapterへ限定し、Core独自システムのRelease Gateから分離する。
- [8. 文書優先](08-%E6%96%87%E6%9B%B8%E5%84%AA%E5%85%88.md) — 本書制定前の資料にある次の記述は廃止するという方針の適用範囲と条件を定める。
