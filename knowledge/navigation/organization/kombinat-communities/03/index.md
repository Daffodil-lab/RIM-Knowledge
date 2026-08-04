# Kombinat共同体 03

範囲: 1. 権威と責務〜41. エネルギー結晶（仮称）

## 項目

- [1. 権威と責務](/pawn/01-%E6%A8%A9%E5%A8%81%E3%81%A8%E8%B2%AC%E5%8B%99.md) — Pawnの生成、人格・身体構成、登録、保管、死亡後削除、再実体化、Cloneについて矛盾がある場合、次の順を用いる。
- [B. 必要装備込みの配備](/pawn/069-B-%E5%BF%85%E8%A6%81%E8%A3%85%E5%82%99%E8%BE%BC%E3%81%BF%E3%81%AE%E9%85%8D%E5%82%99.md) — B. 必要装備込みの配備は、射手四体、互換する防具、遠距離武器、医療品を注文する。
- [13. 完成図Hardening要件](/pawn/13-%E5%AE%8C%E6%88%90%E5%9B%B3Hardening%E8%A6%81%E4%BB%B6.md) — 本節は旧完成図監査から回収したPawn Foundry固有のHardening要件を、本書自身の拘束要件として維持する。
- [14. β Definition of Done](/pawn/14-%CE%B2-Definition-of-Done.md) — 次を全て満たした時だけ、β版のPawn生産系を完成とする。
- [2.3 無料保管](/pawn/2-3-%E7%84%A1%E6%96%99%E4%BF%9D%E7%AE%A1.md) — 生存PawnはPawn Foundryまたは対応設備からDormant状態へ移し、必要になるまで保管できる。
- [GEN-005 必要装備](/pawn/gen-005.md) — MUST: 生産要求は、具体Thing指定と作者定義のEquipment Familyを併用できる。
- [INT-001 Production Adapter](/pawn/int-001.md) — MUST: Pawn FoundryはBody、Module、装備、消耗品をKombinat Production Requestとして発注できる。
- [INT-002 三主題の維持](/pawn/int-002.md) — MUST: Kombinat側ではPawn要求を生産対象、Pawn需要を消費予測、Foundryへの引渡しを流通として表示する。
- [プレイヤーが最初から知ること](/player-facing/001-%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%8C%E6%9C%80%E5%88%9D%E3%81%8B%E3%82%89%E7%9F%A5%E3%82%8B%E3%81%93%E3%81%A8.md) — シオンは、製造された身体を持つ機械の民であり、また一人ずつ別の人格を持ち、人工知能でも集合意識でもありません。
- [最小用語集](/player-facing/012-%E6%9C%80%E5%B0%8F%E7%94%A8%E8%AA%9E%E9%9B%86.md) — これ以上の語は、登場するクエストや機能の中でその都度説明します。
- [Boundary](/research/known-code/000-Boundary.md) — Code-level reuse is limited to repositories owned by Daffodil. Monolyn Race, Fleshbeast Colony, Arachnae Swarm 2, Dolls Nest, RimWorld,…。
- [Sources inspected](/research/known-code/001-Sources-inspected.md) — - Daffodil-lab/Meiko-Race-The-Manufactured-Utopia-A-Clockwork-Fox-Doll at indexed commit aed3ab77724fdab6cf9166abab80bf2dd22a9e96. -…。
- [Adopted and ported](/research/known-code/002-Adopted-and-ported.md) — Adopted and portedは、Source：Reused idea：Kombinat resultとMeikoNexus.csproj：net472, Krafs.Rimworld.Ref, direct Assemblies…。
- [Adapt, do not copy directly](/research/known-code/003-Adapt-do-not-copy-directly.md) — Adapt, do not copy directlyは、Legacy code：ReasonとCompNexusCore CVE and digital-material fields：Aggregate reservedCVE floats have no…。
- [Rejected from the runtime](/research/known-code/004-Rejected-from-the-runtime.md) — - A monolithic Core building Comp as the owner of resource truth. - Separate aggregate reservation totals without reservation records.…。
- [First vertical-slice guarantees](/research/known-code/005-First-vertical-slice-guarantees.md) — 1. Five canonical inventory resources are Defs; population, labor, bandwidth, capacity, research, fame, and defense readiness are not…。
- [Next extraction](/research/known-code/006-Next-extraction.md) — The next safe port is the construction-site lifecycle. Replace its reservedCVE/reservedMaterials fields with one Kombinat reservation…。
- [Build](/research/kombinat-prototype/000-Build.md) — The compiled prototype assembly is written to Assemblies/Kombinat.dll. Do not copy it into the Core package.。
- [Current status](/research/kombinat-prototype/001-Current-status.md) — No v3 product component is implemented. The next task is to pin the Matter Network baseline, record the MIT notices and adopted files,…。
- [0. 出典と利用範囲](/research/kombinat-ui-references/00-%E5%87%BA%E5%85%B8%E3%81%A8%E5%88%A9%E7%94%A8%E7%AF%84%E5%9B%B2.md) — ユーザー提供映像をKombinatのUI・操作研究に限定して利用し、画像・コード・固有表現のコピー元にはしない。
- [1. MonolynのネットワークUIから採るもの](/research/kombinat-ui-references/01-Monolyn%E3%81%AE%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AFUI%E3%81%8B%E3%82%89%E6%8E%A1%E3%82%8B%E3%82%82%E3%81%AE.md) — Monolynの集中資源、生産一覧、選択時ネットワーク表示から、Kombinatへ採用する情報設計を抽出する。
- [4. 要求中間素材作成の操作イメージ](/research/kombinat-ui-references/04-%E8%A6%81%E6%B1%82%E4%B8%AD%E9%96%93%E7%B4%A0%E6%9D%90%E4%BD%9C%E6%88%90%E3%81%AE%E6%93%8D%E4%BD%9C%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8.md) — 在庫とRecipeを並べ、最終品の要求から不足中間品と総材料を確認する簡潔な操作モデルをKombinatへ適用する。
- [0. 目的](/research/remote-logistics/00-%E7%9B%AE%E7%9A%84.md) — 本書は、Coreのローカル保管とKombinatの自動生産から分離した遠距離物流を、将来の再検討まで保護する領域である。
- [1. 延期理由](/research/remote-logistics/01-%E5%BB%B6%E6%9C%9F%E7%90%86%E7%94%B1.md) — 延期理由は、αの完成条件をCoreの通常入出庫とKombinatの発注・多段自動生産へ集中させることにある。
- [2. 保全する概念](/research/remote-logistics/02-%E4%BF%9D%E5%85%A8%E3%81%99%E3%82%8B%E6%A6%82%E5%BF%B5.md) — 次は廃止ではなく、再検討候補として保全するという方針の適用範囲と条件を定める。
- [3. 旧Transfer状態案](/research/remote-logistics/03-%E6%97%A7Transfer%E7%8A%B6%E6%85%8B%E6%A1%88.md) — 旧Transfer状態案の定義、境界、参照関係を示す資料。
- [4. 旧要件の保全](/research/remote-logistics/04-%E6%97%A7%E8%A6%81%E4%BB%B6%E3%81%AE%E4%BF%9D%E5%85%A8.md) — Routeはsource、destination、scope、許可貨物、搬送手段、容量、所要時間、費用、優先度、危険、稼働状態を持つ。
- [5. 保全する受入候補](/research/remote-logistics/05-%E4%BF%9D%E5%85%A8%E3%81%99%E3%82%8B%E5%8F%97%E5%85%A5%E5%80%99%E8%A3%9C.md) — 三つの独立Inventoryを二つ以上のRouteで結び、時間優先と費用優先を比較する。
- [6. 再開ゲート](/research/remote-logistics/06-%E5%86%8D%E9%96%8B%E3%82%B2%E3%83%BC%E3%83%88.md) — 遠距離物流を再び計画へ入れるには、次を全て満たす。
- [7. AE2系の距離拡張に対する境界](/research/remote-logistics/07-AE2%E7%B3%BB%E3%81%AE%E8%B7%9D%E9%9B%A2%E6%8B%A1%E5%BC%B5%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E5%A2%83%E7%95%8C.md) — 無限距離Wireless Terminal、dimension間Terminal、量子Link、跨MapNetwork Connectorは、参考資料としてのみ保持する。
- [台帳設備と輸送中Cargo](/research/remote-logistics/08-%E5%8F%B0%E5%B8%B3%E8%A8%AD%E5%82%99%E3%81%A8%E8%BC%B8%E9%80%81%E4%B8%ADCargo.md) — Map上の設備、宇宙船、本国施設、契約工場、交易拠点を共通のFacility台帳へ登録し、遠隔資源を時間付きCargoとして現地Network Storageへ届ける設計草案。
- [2. 現行設定の判定](/research/theme-overhaul/02-%E7%8F%BE%E8%A1%8C%E8%A8%AD%E5%AE%9A%E3%81%AE%E5%88%A4%E5%AE%9A.md) — 現時点のKombinat実装は、5資源のWorld台帳、予約、コミット、返還、セーブ状態を持つ基盤であり、テーマ上はほぼ中立である。
- [6. 実在参照と命名の処理](/research/theme-overhaul/06-%E5%AE%9F%E5%9C%A8%E5%8F%82%E7%85%A7%E3%81%A8%E5%91%BD%E5%90%8D%E3%81%AE%E5%87%A6%E7%90%86.md) — 以下はテーマ・トーン再審査ガイドQ0と、近未来／20世紀パスティーシュ回避の両方から優先度が高い。
- [0. 結論](/roadmap/00-%E7%B5%90%E8%AB%96.md) — Coreは工業基盤を内部完成させてからShion種族を統合し、α、β、1.0の三段階で公開する。
- [2. 既知コードと再利用の方針](/roadmap/02-%E6%97%A2%E7%9F%A5%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A8%E5%86%8D%E5%88%A9%E7%94%A8%E3%81%AE%E6%96%B9%E9%87%9D.md) — コード再利用は現行責務、保存、試験、性能、依存方向、ライセンス、保守性を満たす単位だけに限定する。
- [3. 1.0の最終完成像](/roadmap/03-1-0%E3%81%AE%E6%9C%80%E7%B5%82%E5%AE%8C%E6%88%90%E5%83%8F.md) — 最終的なCoreは、少なくとも次を一つの製品として成立させる。
- [4. α版 — 最初の公開候補](/roadmap/04-%CE%B1%E7%89%88-%E2%80%94-%E6%9C%80%E5%88%9D%E3%81%AE%E5%85%AC%E9%96%8B%E5%80%99%E8%A3%9C.md) — α版は、内部完成した工業基盤へShion種族、図像、独立開始を最後に統合する最初の公開候補である。
- [5. β版](/roadmap/05-%CE%B2%E7%89%88.md) — β版は、α版に含めなかったコアMODとレッドスターの要素を追加し、両製品を完成へ到達させる期間である。
- [8. 現在地](/roadmap/08-%E7%8F%BE%E5%9C%A8%E5%9C%B0.md) — 2026-08-02時点で工業基盤の実装作業は存在するが、工業完成マイルストーンとShion統合αは未完成である。
- [9. 次の作業順](/roadmap/09-%E6%AC%A1%E3%81%AE%E4%BD%9C%E6%A5%AD%E9%A0%86.md) — 工業管理画面の基準画像とRimWorld 1.6画面契約を先に固定し、種族非依存の保管基盤とコンビナートを実装してからシオン種族と図像をα版へ統合する。
- [11. 工業先行開発マイルストーン](/roadmap/11-%E5%B7%A5%E6%A5%AD%E5%85%88%E8%A1%8C%E9%96%8B%E7%99%BA%E3%83%9E%E3%82%A4%E3%83%AB%E3%82%B9%E3%83%88%E3%83%BC%E3%83%B3.md) — シオン固有種族と図像の実装より先に、バニラ人間で検証できるコアMOD保管・コンビナート工業基盤を内部完成させる。
- [0. 正史の優先順位](/world/00-%E6%AD%A3%E5%8F%B2%E3%81%AE%E5%84%AA%E5%85%88%E9%A0%86%E4%BD%8D.md) — 本書より下位の資料は、本書にない事実を自動的に正史化しない。
- [4. 同盟社会](/world/04-%E5%90%8C%E7%9B%9F%E7%A4%BE%E4%BC%9A.md) — 同盟本国は、普通に暮らす大多数にとって、本当に自由で豊かで安全な社会である。
- [8. 遠征共同体とレッドスター](/world/08-%E9%81%A0%E5%BE%81%E5%85%B1%E5%90%8C%E4%BD%93%E3%81%A8Red-Star.md) — コアMODは、独立団、漂着者、認可団、その他の遠征共同体など、複数の開始立場を許容する。
- [9. The Hive](/world/09-The-Hive.md) — The Hiveは、通常シオン社会の標準ではない、例外的な単一中枢運営を扱う。
- [33. 代表工業資源](/world/33-%E4%BB%A3%E8%A1%A8%E5%B7%A5%E6%A5%AD%E8%B3%87%E6%BA%90.md) — Coreで反復して扱う五つの代表工業資源は、Cell、エネルギー結晶、構造材、保守資材、弾薬結晶である。
- [34. Cell](/world/34-Cell.md) — Cellは、帝国から継承された自己増殖可能な工業媒体であり、物質、身体、設備を構成・変更する基盤の一つである。
- [35. 凝縮真空](/world/35-%E5%87%9D%E7%B8%AE%E7%9C%9F%E7%A9%BA.md) — 凝縮真空（CVE）は、エネルギー分野に属する同盟時代の既存技術または形態である。
- [36. 構造材](/world/36-%E6%A7%8B%E9%80%A0%E6%9D%90.md) — 構造材は、建築、設備、基礎的な製造へ用いる、規格化された物理材料である。
- [37. 保守資材](/world/37-%E4%BF%9D%E5%AE%88%E8%B3%87%E6%9D%90.md) — 保守資材は、設備、身体、装備の保守と修理へ投入する物理的な資材である。
- [38. 弾薬結晶](/world/38-%E5%BC%BE%E8%96%AC%E7%B5%90%E6%99%B6.md) — 弾薬結晶は、その場で弾薬を製造するための物理資源であり、シオン装備体系の全遠距離武器が必要とする。
- [39. 同盟通貨](/world/39-%E5%90%8C%E7%9B%9F%E9%80%9A%E8%B2%A8.md) — 同盟通貨は、共同体が保有、移転、支出できる金融上の残高であり、物理工業資源、名声、忠誠、人格権ではない。
- [40. エネルギー（仮称）](/world/40-%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC.md) — エネルギー（仮称）は、設備と身体を動かす力の発生、供給、蓄積、輸送をまとめて扱う上位ジャンルである。
- [41. エネルギー結晶（仮称）](/world/41-%E3%82%A8%E3%83%8D%E3%83%AB%E3%82%AE%E3%83%BC%E7%B5%90%E6%99%B6.md) — エネルギー結晶（仮称）は、エネルギーそのものを輸送・備蓄し、常設供給へ接続できない場所で身体や装備を稼働させる物理資源である。
