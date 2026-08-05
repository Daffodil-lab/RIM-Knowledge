---
type: "Research Reference"
title: "Key Findings"
description: "Key Findingsは、PAC(Protocol Anchor Core／Protocol Automation-Core)が全ての中心。"
tags:
  - "research"
  - "endfield"
  - "aic"
status: stable
authority: reference
knowledge_role: reference
granularity: section
source_section: "Key Findings"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md"
    title: "アークナイツ:エンドフィールド AICシステム 設計分析レポート"
---

# Key Findings

## 1. AICの全体像と正式版仕様

- PAC(Protocol Anchor Core／Protocol Automation-Core)が全ての中心。各地域(region)に1つのPAC、各前哨基地(Outpost)にSub-PACがあり、同一地域内でDepot(倉庫)・電力網・地域機能を共有する。Depotは各アイテムごとに保管上限はあるが、スロット数は無制限。
- 工場はオフラインでも24時間365日稼働し、探索・戦闘・ログアウト中も資源を生産し続ける「複利的」リソース生成装置。
- 進行はAIC Plan(ノードベースのテックツリー)で管理され、Logistics/Processing/Power/Combat/Explorationの5分岐を持つ。ノード解放にはマップ上のProtocol Datalogger(黄色の風船人形マーカー)を活性化して得る「AIC Index」を消費。研究自体は待ち時間なしで即時完了。
- VR Simulator(シミュレーション)ステーションでチュートリアル課題を解くとFactory Index点が得られ、これでもツリーを解放。「習ったのと別の技術に振り分けてよい」柔軟設計。
- リリースは2026年1月22日(GMT+8 午前9時)、PS5/PC/iOS/Androidで世界同時。日付はThe Game Awards 2025(2025年12月11日)でOneRepublicの新曲「Give Me Something」と共に発表された。第2ベータ前時点で世界35百万件超の事前登録(TGA発表時点で30百万件)を集めた。
- ベータ→正式版の進化：2024年1月の第1テクニカルテスト時点で既に「予想外に奥深いベースビルダー」と評価。第2ベータ(2025年11月28日開始、PC/iOS/Android)でカットシーン80〜90%・マップ構造50%・レベルデザイン40〜50%を作り直し、ブループリント共有システムを追加して工場を大幅に「とっつきやすく」した。

## 2. コンベア/物流ロジック(MOD設計の最重要参照点)

- Transport Belt(搬送ベルト)の速度は固定で0.5 unit/秒 = 1アイテム/2秒 = 30個/分(公式コミュニティwiki endfield.wiki.gg「Logistics Units」に「limited flow rate of 0.5 unit/s」と明記)。高速ベルトのティアは存在しない——スループットを上げる唯一の方法は「ベルトを並列に増やす／機械を増やす」こと。これは設計上、極めて重要な制約で、プレイヤーはレシピ時間と30個/分の上限から必要ベルト本数を算術的に導く必要がある(enka.networkのチュートリアルが「レシピ時間÷2」の暗算法を解説)。
- Splitter(スプリッター)：1入力→最大3出力に「均等分配(evenly divides)」。内部が厳密なラウンドロビンか需要ベースかは公式に明示されず「smart sorting module」とのみ記載。
- Converger(コンバージャー)：最大3入力→1出力に合流。合流後の合計流量が出力ベルト上限(0.5 unit/s)を超えると詰まるという明確な数値制約がある(endfield.wiki.gg)。
- Item Control Port(アイテム制御ポート)：ベルト上を通過するアイテムの「種類」を1種類にフィルタし、かつ通過総数に1〜5000の上限を設定可能。ブループリント内でベルト区間の運搬アイテム種を明示するのに使う。専用の「優先度」スイッチは無い。
- Belt Bridge(ベルト橋)：ベルト同士を干渉させずに交差させる。「交差=速度低下」を回避するための必須要素で、レイアウトの整理に使う。
- Protocol Stash(プロトコル格納庫)/Easy Stash：長い戻りベルトを引かずにアイテムを直接Depotへ投入する省スペース装置。
- Depot Bus(デポバス)システム：PACの入出力ポート数は有限のため、Depot LoaderとDepot Unloaderをバスに接続し、任意の場所からDepotへアイテムを注入・引き出す「共有物流バックボーン」。Amethyst Bottleのような中間素材のボトルネックを、専用生産ラインを持たずオンデマンド配給できる。正式版では配置自由度が上がり、Depot Bus PortとDepot Bus Sectionで柔軟に敷設可能に。
- 流体(Fluid)システム：Wuling地域で解禁。Pipe(パイプ)の流量は2 unit/秒(固体ベルトの4倍)。Fluid Pumpで水源から汲み上げ(汲み上げ速度1/秒)、Pipe Splitter/Pipe Converger/Pipe Control Portで固体と同様の制御が可能。流体は「衝突しない粒子」として扱われ、需要/背圧に応じて動的に再配分される挙動がプレイヤー検証で報告されている(公式仕様ではない)。1.1で地下導管(Conduit/underground pipe)が追加されレイアウトが整理可能に。

## 3. 電力システム(独自性が高い)

- 電力は「無線ワイヤレス供給＋物理的リレー網」という独自方式。グローバルな電力分配は無く、プレイヤーがPAC/Sub-PACから物理的にリレーを繋いで遠隔地に電力を「橋渡し」する。
  - Relay Tower(リレータワー)：電力源から最大距離まで電力を延伸(正式版1.0.2で90m→100mに延長)。見通し(line of sight)が必要で、高所設置が推奨。
  - Electric Pylon(電気パイロン)：リレーから信号を受け、範囲内の全設備へ無線給電(1.0.2で40m→50mに延長)。
  - Relay Tower→Electric Pylon→Mining Rig の順で接続。採掘リグはリレーに直結できない。
- 発電はThermal Bank(サーマルバンク)で燃料を燃やして行う。序盤はOriginium Ore(鉱石1個=約50 power)を直接燃焼。中盤以降はLC Valley Battery(220 power)→SC Valley Battery(420 power)→HCバッテリーへ移行。バッテリーはOriginium→電力変換効率が高く(LCは鉱石の4倍超)、限られたスペースで大出力を得られる。
- 電力とリソースの相互依存：発電に鉱石/バッテリー(=生産チェーンの産物)を消費するため、電力とアイテム生産が循環的に結合。Wulingでは電力にXiranite(息壤)が必要で、Xiranite不足→バッテリー生産停止→電力ダウンという連鎖リスクがある(復旧に数時間かかることも)。
- WulingのXiranite Relay/Xiranite Pylonは「自動接続」で手動配線が不要になり、配線の煩雑さを解消。

## 4. レシピ・生産チェーン設計

- 生産ツリーは中程度の深さ。典型例:Originium Ore→(Refining Unit)→Origocrust、Amethyst Ore→Amethyst Fiber→(Moulding Unit)→Amethyst Bottle、Buckflower→(Shredding Unit)→粉末、両者を(Filling Unit)で合成→Buck Capsule C(回復/交易品)。
- 施設タイプ:Refining(精錬)、Shredding(粉砕)、Moulding(成形)、Filling(充填)、Fitting、Gearing(ギア組立)、Packaging(梱包/バッテリー)、Grinding、Separating、Planting(栽培)、Seed-Picking、Reactor Crucible/Forge of the Sky(Wuling流体)など多数。
- バランス設計の妙:各機械のレシピ時間と消費個数が、ベルト30個/分の上限と噛み合うよう設計。例「10秒で各5個消費」→「レシピ時間÷2=5、各個数÷5=1」→各1ベルトで足りる、という算術がプレイヤーの最適化の核。過剰供給は「詰まり」で可視化される。
- リソースの絞り込み:主要鉱石はOriginium/Amethyst/Ferrium/Cuprium の4種が段階的に解禁。地域ごとに素材がリセットされる(Valley IVのOriginium系→WulingのXiranite/Cuprium系)。TheGamerは「次の地域でまた同じ工程を別の鉱石でやり直すだけ」と批判。
- 自動化の段階性:手動採掘/栽培→電動リグ→無線給電リグ→(Wuling)水力リグ、と自動化の解禁が進行と結合。特殊植物など一部は手動栽培を残し、自動化しきらない設計。

## 5. UI/UX

- 建設は「AIC Mode」に切替(PAC近くでは自動切替)して行う。Facility Listから選択→建設画面。Stash Modeで設備を回収可能(接続設備は残るが停止)。
- ブループリント機能:第2ベータで追加された目玉。生産ライン全体をワンボタン配置、プレビュー、一括コピー/削除、保存、コード経由での他プレイヤーとの共有(SNS投稿可、フレンド不要)。正式版でコミュニティ(enkad.enka.network、endfieldtools.dev等)が最適化ブループリントを大量共有する文化が形成。
- プラットフォーム間UI差異:
  - PC(キーボード＋マウス):工場レイアウト・メニュー操作に最適。ホットキー(Tでプラン)豊富で管理が速い。
  - コントローラー(PS5含む):戦闘・探索は快適でPS5最適化は高評価(Push Square)。ただしメニューとAIC建設は「1つずつ送る」ため遅く不便。正式版初期はリマップが4ボタンのみ→1.1で全ボタンリマップ対応。
  - モバイル(タッチ):仮想スティック＋放射メニュー、UI自動非表示、ハプティックフィードバック。1.0で専用[Controller]モード追加。
  - 多くのレビュアーが「戦闘はコントローラー、AIC/メニューはKBM」のハイブリッドを推奨。
- 可視化:アイテムのPin機能でレシピを画面右上に常時表示。1.1で俯瞰(top-down)ビュー拡大、ジップライン乗車中のミニマップ表示、鉱石ノードの残量マップ表示など多数改善。
- 批判点:COGconnectedは「中〜終盤にUIが情報とノイズで過密になる」、TheGamerは「過剰なチュートリアルに溺れる」と指摘。

## 6. 工業を用いた探索システム(相互フィードバックの核)

- 古代機械の再起動:マップ各所に電力供給が途絶えた古代機械があり、Relay Towerで電力網を延伸して再起動すると、ゲート開放・宝箱・隠しエリア・新探索ゾーンが解放される。「工場が別のミニゲームではなく、世界を再建する行為そのものに感じられる」設計。
- ジップライン網:Zipline Pylon(80m射程、Amethyst Part×10)とZipline Tower(110m射程、Cryston Part、複数連結で長距離パス)を電力付きで設置し、マップを「私設交通網」化。Death Stranding的な非同期マルチ(他プレイヤーの設置物が自分の世界に出現、共有可)。正式版終盤では「最適ジップラインルート」設計がエンドゲーム化。
- Bounce Device、Beam Tower等の探索補助設備も存在。
- 相互フィードバックループ:探索→新資源ノード/新地域発見→工業網延伸で採掘/給電→ギア生産→戦闘力向上→さらに奥地を探索、という循環。リードプランナーのRyanはGamesRadar+/TechRadar取材で「他ゲームはプレイヤーが世界に影響を与えられないが、Endfieldは工場建設でサンドボックスの体験を導入した」と語り、プレイヤーが「予想以上に長い時間、サンドボックスのおかげで」プレイしており「一部は仮想サプライチェーン構築にシステム内で数十時間(tens of hours)を費やしている」と明かした。
- Regional Development(地域開発度):採掘スポットの初回リグ設置、Outpost強化、Recycling Station解禁等でメトリクスが上がり、Mining Node Purity(純度)向上や資源ノード追加が起きる。工業投資と地域成長が結合。

## 7. Factorio/Satisfactory等との比較・位置づけ

- 開発者の明言:リード開発者は開発者インタビュー(GamesRadar+)で「Factorio・Satisfactory・Astroneerに感銘を受けたが(Though we're impressed by these amazing works)、Arknights: Endfieldは全く異なるものになる(will be quite different)」とし、「RPG要素と工場部分で50:50の比率を目指すが、プレイヤーは自由にこの比率を調整できる(we are trying to achieve a 50:50 ratio between the RPG elements and the factory portion. But players are free to adjust this ratio)」と述べた。難易度の急上昇でプレイヤーを遠ざけたくないとの意図も表明。
- 決定的な違い:COGconnectedは「Factorio/Satisfactoryと違い、Endfieldの工場は目的ではなく手段(factories in Arknights: Endfield are a means to an end. They're not exercises in creativity. Once you've got them kitted out, they mostly run themselves)」と評し、創造性の発揮の場ではなく、一度組めば大半は自走する道具的性格が強いとした。Push Square等も同旨。
- 簡略化/独自化された要素:①ベルト速度が単一固定(ティア無し)で複雑性を抑制、②無線給電＋物理リレーという独自電力モデル、③リソース種類の絞り込み、④ブループリント共有による参入障壁低下、⑤探索・戦闘・ガチャとの強制的統合。
- ハイブリッドとしての位置づけ:TechRadarは「基本的にFactorio meets Genshin Impactで、この独自の方程式が多くのプレイヤーを獲得した(It's basically Factorio meets Genshin Impact, and this distinct formula has won over plenty of players)」と形容。GosunoobやGamesRadarも「Satisfactory Gacha」等と表現。ガチャRPGで本格工場シムを主柱に据えた初の事例。

## 8. プレイヤー・メディア評価

- 総合スコア:Metacritic 78/100(21レビュー、"mostly positive")、OpenCritic 88%ポジティブ(14レビュー時点。2026年7月時点のライブ集計では28クリティック・平均79/推奨89%に上昇)。
- 好評点:新規ガチャ離れした高い完成度・最適化(バグ・ローカライズ・パフォーマンス問題が少ない)、工場の中毒性(「1AMまでコンベアを眺める」)、PS5最適化、探索とのユニークな統合。多くのプレイヤーが「戦闘目当てで入り、工場に予想外にハマった」。
- 否定的点:
  - TheGamer(Harry Alston、3/5):「miles wide and about an inch deep(幅は広いが奥行き1インチ)」「工場管理はafterthought(後付け)」で、総評は「more style over substance(実質より見栄え)」——最も辛辣。
  - COGconnected:中〜終盤でガチャが支配的になり、工場・探索・戦闘の各要素が相対的に軽くなる。UIが過密化。
  - 素材工程の地域ごとリセットが「同じことの繰り返し」と感じられる。
  - チュートリアル過多・序盤2時間が退屈。
  - ガチャ通貨の種類過多・一部に有効期限、天井120連はやや厳しめ。ローンチ時PayPal不正課金事件(Hypergryphが機能停止し全額返金対応)。
- 工場ファン vs アークナイツファン:工場勢は「Factorio Liteで物足りない」派と「ガチャに本物の自動化があるのは驚き」派に分裂。GamesRadar/開発者データでは平均プレイ時間が「他の類似ゲームより長い=サンドボックスのおかげ」。
- アップデートでの改善:
  - 1.0.2/1.1(3月12日):建設がCore AIC Area/Sub-PAC外のマップ全域で自由に、電力延長距離拡大、会話中も電力接続維持、コントローラー全ボタンリマップ、ジップライン乗車中マップ表示、水力工業(Hydro Mining Rig/Cuprium/地下導管/Water Treatment)追加、Forge of the Sky上限4基に。
  - 1.2(4月17日):新流体生産系、Hetonite新素材チェーン、より精密な物流制御。
  - Homecoming(7月16日):Gas(気体)を固体・液体に次ぐ第3の物質状態として追加。Inergen/Xiragen収集、状態間変換で中間工程をバイパスし機械数削減・高密度レイアウト実現(例:CarbonとClean WaterからXiraniteを直接生成し3工程を省略)。ブループリントで導管接続を保持、DLSS 4.5/PSSR2/FSR3対応。
  - 継続的なQoL改善はHypergryphがコミュニティフィードバックに積極対応している証左。

## 関連項目

- 上位索引: [research/endfield-aic](/research/endfield-aic/index.md)
- 同じ出典の前項: [TL;DR](/research/endfield-aic/000-TL;DR-エンドフィールド工業参考.md)
- 同じ出典の次項: [Details(設計分析としての示唆)](/research/endfield-aic/002-Details設計分析としての示唆.md)
- リリース計画: [リリース計画](/roadmap/index.md)
- 制作・開示規則: [制作・開示規則](/authoring/index.md)

## 出典

- アークナイツ:エンドフィールド AICシステム 設計分析レポート（退役済み原本: `retired-source://project/アークナイツ_エンドフィールドAIC設計分析レポート_v1.md`） — `Key Findings`
