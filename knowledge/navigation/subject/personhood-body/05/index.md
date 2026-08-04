# 身体・人格 05

範囲: SAVE-004 途中状態〜41. エネルギー結晶（仮称）

## 項目

- [SAVE-004 途中状態](/pawn/save-004.md) — MUST: 生産、Dormant化、再配備、回収、再起動、再資源化、再実体化、Cloneの各途中状態から安全に再開する。
- [SAVE-005 ID一意性](/pawn/save-005.md) — MUST: 保存・ロード後もdesignId、individualId、pawnInstanceId、lineageIdを重複させない。
- [SAVE-006 Archive欠損](/pawn/save-006.md) — MUST: 欠落Def、破損Archive、利用不能Moduleを無言で置換しない。
- [UX-001 Pawn Foundry](/pawn/ux-001.md) — MUST: Pawn Foundryの第一階層を次の三つにする。
- [UX-002 費用Preview](/pawn/ux-002.md) — MUST: 生産前にBody、Module、能力、装備、時間、現在在庫、不足、代替、登録方式を表示する。
- [UX-003 個体種別](/pawn/ux-003.md) — MUST: Ephemeral、Registered、Design output、Clone、Dormantを、色だけに依存せず文字とIconで区別する。
- [UX-004 破壊的操作](/pawn/ux-004.md) — MUST: Ephemeral遺体の再資源化とArchive削除は、同じ個体を復元できなくなることを明示する。
- [UX-005 Clone識別](/pawn/ux-005.md) — MUST: 同名・同外見のCloneを許可しつつ、選択、医療、装備、命令で区別できる短い表示識別子を提供する。
- [UX-006 簡易注文](/pawn/ux-006.md) — MUST: プレイヤーが詳細設計を開かず、「建築担当を一人」「射手を四人」「この個体のCloneを十人」のような注文を行える。
- [プレイヤーが最初から知ること](/player-facing/001-%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%8C%E6%9C%80%E5%88%9D%E3%81%8B%E3%82%89%E7%9F%A5%E3%82%8B%E3%81%93%E3%81%A8.md) — シオンは、製造された身体を持つ機械の民であり、また一人ずつ別の人格を持ち、人工知能でも集合意識でもありません。
- [β版のPawn工業](/player-facing/002-%CE%B2%E7%89%88%E3%81%AEPawn%E5%B7%A5%E6%A5%AD.md) — β版では、必要な仕事に適合するランダムなシオン、登録済みの個体、プレイヤーが一から設計した個体、既存個体のCloneをPawn Foundryから生産できます。
- [短文](/player-facing/007-%E7%9F%AD%E6%96%87.md) — 食事も仕事も身体も選べる狐型機械人シオンと、辺境に小さな楽園を築こう。
- [長文](/player-facing/008-%E9%95%B7%E6%96%87.md) — シオンは、製品として作られた身体を自分たちの手へ取り戻した狐型の機械人です。
- [最小用語集](/player-facing/012-%E6%9C%80%E5%B0%8F%E7%94%A8%E8%AA%9E%E9%9B%86.md) — これ以上の語は、登場するクエストや機能の中でその都度説明します。
- [2. Shion Nexus relevance](/research/external-videos/02-Shion-Nexus-relevance.md) — Fleshbeast Colony remains a structural reference only.。
- [3. Human mutation, core creation, and division loop](/research/fleshbeast/03-Human-mutation-core-creation-and-division-loop.md) — A mutated human can become a one-per-map Flesh Heart that serves as the colony core and produces Hemogel passively.。
- [4. Creature system and fusion progression](/research/fleshbeast/04-Creature-system-and-fusion-progression.md) — Creatures can apparently be assigned to a master-like pawn group, similar in feel to mech escort commands: follow, attack, guard, or…。
- [9. Performance cautions](/research/fleshbeast/09-Performance-cautions.md) — Do not import these patterns into Shion Nexus without hard limits、具体的にはauto-expanding territory;とauto-capturing floor;を扱う。
- [2. Arsenal Codexの直接交換から採るもの](/research/kombinat-ui-references/02-Arsenal-Codex%E3%81%AE%E7%9B%B4%E6%8E%A5%E4%BA%A4%E6%8F%9B%E3%81%8B%E3%82%89%E6%8E%A1%E3%82%8B%E3%82%82%E3%81%AE.md) — 接続保管庫からPawnへ直接装備し、現在装備を同じ取引で返す操作を、Coreの原子的武器交換の参照とする。
- [11. Performance cautions](/research/monolyn-practice/11-Performance-cautions.md) — Avoid importing these patterns without hard limits、具体的にはschedule-driven labor loops that require many pawns;とunbounded resource demand…。
- [2. High-level comparison](/research/reference-mods/02-High-level-comparison.md) — High-level comparisonは、Mod：Public core idea：Shion Nexus reference value：Do not copyとMonolyn Race：Tower gathers Light through prayer and…。
- [3. Monolyn Race structural lessons](/research/reference-mods/03-Monolyn-Race-structural-lessons.md) — Monolyn Race is useful because it presents a complete central-resource colony model.。
- [7. Shion Nexus non-copy rules](/research/reference-mods/07-Shion-Nexus-non-copy-rules.md) — Shion Nexus must not become、具体的にはMonolyn with foxes;とFleshbeast with machines;を扱う。
- [10. Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race%E9%9D%9EHAR%E7%A8%AE%E6%97%8F%E5%AE%9F%E8%A3%85%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3.md) — Vivi RaceがHARを必須所有者にせず、バニラ人型処理、Biotech、独自身体、Pawn render tree、任意HAR互換を組み合わせる構成をShion向けに分類する。
- [4. 旧要件の保全](/research/remote-logistics/04-%E6%97%A7%E8%A6%81%E4%BB%B6%E3%81%AE%E4%BF%9D%E5%85%A8.md) — Routeはsource、destination、scope、許可貨物、搬送手段、容量、所要時間、費用、優先度、危険、稼働状態を持つ。
- [3. プレイヤーへ見せる情報の四層](/research/theme-overhaul/03-%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%B8%E8%A6%8B%E3%81%9B%E3%82%8B%E6%83%85%E5%A0%B1%E3%81%AE%E5%9B%9B%E5%B1%A4.md) — プレイヤーが覚える必要のある核は四つだけにする。
- [8. 文章サンプル](/research/theme-overhaul/08-%E6%96%87%E7%AB%A0%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB.md) — 食事も仕事も身体も選べる、狐型機械人シオンの開拓団。
- [0. 結論](/roadmap/00-%E7%B5%90%E8%AB%96.md) — Coreは工業基盤を内部完成させてからShion種族を統合し、α、β、1.0の三段階で公開する。
- [3. 1.0の最終完成像](/roadmap/03-1-0%E3%81%AE%E6%9C%80%E7%B5%82%E5%AE%8C%E6%88%90%E5%83%8F.md) — 最終的なCoreは、少なくとも次を一つの製品として成立させる。
- [4. α版 — 最初の公開候補](/roadmap/04-%CE%B1%E7%89%88-%E2%80%94-%E6%9C%80%E5%88%9D%E3%81%AE%E5%85%AC%E9%96%8B%E5%80%99%E8%A3%9C.md) — α版は、内部完成した工業基盤へShion種族、図像、独立開始を最後に統合する最初の公開候補である。
- [5. β版](/roadmap/05-%CE%B2%E7%89%88.md) — β版は、α版に含めなかったコアMODとレッドスターの要素を追加し、両製品を完成へ到達させる期間である。
- [6. β終了／1.0完成条件](/roadmap/06-%CE%B2%E7%B5%82%E4%BA%86-1-0%E5%AE%8C%E6%88%90%E6%9D%A1%E4%BB%B6.md) — 1.0以後も、身体、派閥、クエスト、装備、料理、動物、互換Adapter等を追加できる。
- [8. 現在地](/roadmap/08-%E7%8F%BE%E5%9C%A8%E5%9C%B0.md) — 2026-08-02時点で工業基盤の実装作業は存在するが、工業完成マイルストーンとShion統合αは未完成である。
- [9. 次の作業順](/roadmap/09-%E6%AC%A1%E3%81%AE%E4%BD%9C%E6%A5%AD%E9%A0%86.md) — 工業管理画面の基準画像とRimWorld 1.6画面契約を先に固定し、種族非依存の保管基盤とコンビナートを実装してからシオン種族と図像をα版へ統合する。
- [3. シオンという人類](/world/03-%E3%82%B7%E3%82%AA%E3%83%B3%E3%81%A8%E3%81%84%E3%81%86%E4%BA%BA%E9%A1%9E.md) — シオン/Shionは、製造された身体を持つ独立人格の人類である。
- [6. 人格記録、復活、同化](/world/06-%E4%BA%BA%E6%A0%BC%E8%A8%98%E9%8C%B2-%E5%BE%A9%E6%B4%BB-%E5%90%8C%E5%8C%96.md) — 同盟は、身体再製造、人格記録、復活、他身体への移行に相当する技術を持つ。
- [9. The Hive](/world/09-The-Hive.md) — The Hiveは、通常シオン社会の標準ではない、例外的な単一中枢運営を扱う。
- [12. 正史上の禁止境界](/world/12-%E6%AD%A3%E5%8F%B2%E4%B8%8A%E3%81%AE%E7%A6%81%E6%AD%A2%E5%A2%83%E7%95%8C.md) — 新しい設定は、帝国と同盟の連続性と変化、純粋な善意、善意の非対称性、人格と身体の分離を同時に壊さない場合にのみ採用できる。
- [13. 帝国人とシオンの起源](/world/13-%E5%B8%9D%E5%9B%BD%E4%BA%BA%E3%81%A8%E3%82%B7%E3%82%AA%E3%83%B3%E3%81%AE%E8%B5%B7%E6%BA%90.md) — シオンは、帝国人の身体基盤を簡略化し、少ない資源で反復製造できる派生人類として帝国に設計された。
- [14. 水仙](/world/14-%E6%B0%B4%E4%BB%99.md) — 水仙は、帝国内戦後にシオンの蜂起を主導し、身体と製造手段を自己所有へ取り戻す革命の中心となったシオンである。
- [22. 休眠遺構と中継塔](/world/22-%E4%BC%91%E7%9C%A0%E9%81%BA%E6%A7%8B%E3%81%A8%E4%B8%AD%E7%B6%99%E5%A1%94.md) — 帝国・同盟・独立勢力の設備には、破壊されず休眠状態へ移り、辺境に残された遺構や中継塔が存在する。
- [28. 狐娘型の共有身体](/world/28-%E7%8B%90%E5%A8%98%E5%9E%8B%E3%81%AE%E5%85%B1%E6%9C%89%E8%BA%AB%E4%BD%93.md) — 通常シオンは、史料上確認できるかなり初期の段階から、狐耳と尾を持つ無性の人間型シルエットを共通の身体像としてきた。
- [29. シオンの無性機械身体](/world/29-%E3%82%B7%E3%82%AA%E3%83%B3%E3%81%AE%E7%84%A1%E6%80%A7%E6%A9%9F%E6%A2%B0%E8%BA%AB%E4%BD%93.md) — シオンの狐娘型は外見上の呼称であり、身体に生物学的性別、人間型の内臓、生理現象は存在しない。
- [30. 人類としての自己認識](/world/30-%E4%BA%BA%E9%A1%9E%E3%81%A8%E3%81%97%E3%81%A6%E3%81%AE%E8%87%AA%E5%B7%B1%E8%AA%8D%E8%AD%98.md) — シオンが自らを人類とみなす根拠は生物学的構造ではなく、文化、思想、歴史的連続性、人格主体としての自己認識にある。
- [34. Cell](/world/34-Cell.md) — Cellは、帝国から継承された自己増殖可能な工業媒体であり、物質、身体、設備を構成・変更する基盤の一つである。
- [37. 保守資材](/world/37-%E4%BF%9D%E5%AE%88%E8%B3%87%E6%9D%90.md) — 保守資材は、設備、身体、装備の保守と修理へ投入する物理的な資材である。
- [39. 同盟通貨](/world/39-%E5%90%8C%E7%9B%9F%E9%80%9A%E8%B2%A8.md) — 同盟通貨は、共同体が保有、移転、支出できる金融上の残高であり、物理工業資源、名声、忠誠、人格権ではない。
- [40. エネルギー（仮称）](/world/40-%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC.md) — エネルギー（仮称）は、設備と身体を動かす力の発生、供給、蓄積、輸送をまとめて扱う上位ジャンルである。
- [41. エネルギー結晶（仮称）](/world/41-%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC%E7%B5%90%E6%99%B6.md) — エネルギー結晶（仮称）は、エネルギーそのものを輸送・備蓄し、常設供給へ接続できない場所で身体や装備を稼働させる物理資源である。
