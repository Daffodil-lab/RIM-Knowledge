---
type: "Governance Rule"
title: "知識所有者マップ"
description: "同じ事実を複数の正本へ持たせない、また詳細度の違う説明が必要な場合、事実は一つの所有者へ置き、他は要約または投影としてリンクする。"
tags:
  - "okf"
  - "governance"
  - "kombinat"
  - "pawn"
  - "independent-colony"
  - "backstory"
  - "canon"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/ownership-map"
canonical_scope: "okf-governance"
source_section: "知識所有者マップ"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
---

# 知識所有者マップ

同じ事実を複数の正本へ持たせない。詳細度の違う説明が必要な場合、事実は一つの所有者へ置き、他は要約または投影としてリンクする。

## 所有者

| 主題 | 唯一の所有者 | 他領域で許される形 |
|---|---|---|
| 世界内の確定事実 | [正史・世界観](/world/index.md) | 制作上の要約、プレイヤー向け投影 |
| 製品構造・モジュール境界 | [全体設計](/design/index.md) | ロードマップや個別仕様からの参照 |
| α・β・1.0、版運用、現在地 | [リリース計画](/roadmap/index.md) | 各仕様のRelease Gate |
| 独立開拓団固有の設定とゲーム設計 | [独立開拓団](/colony/index.md) | 正史の一般原則への参照 |
| Kombinatの追加層境界 | [Kombinat中核仕様](/kombinat/core/index.md) | 全体設計の要約 |
| Kombinatの機能要件 | [Kombinat要件](/kombinat/requirements/index.md) | 中核仕様の要約 |
| Kombinatの検証 | [Kombinat監査](/kombinat/audit/index.md) | 要件への検証リンク |
| α以後の保管・接続基盤 | [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md) | 独自Storage、直接転送、任意排出、Kombinat接続の唯一の所有者 |
| Shion種族のHuman・Biotech実装 | [バニラ優先Shion種族実装境界](/design/52-バニラ優先Shion種族実装境界.md) | 種族Def、Xenotype、Gene、依存、保存、性能条件の唯一の所有者 |
| Pawn生産・保管・再生 | [Pawn仕様](/pawn/index.md) | 全体設計の高位境界 |
| 制作・開示規則 | [制作・開示](/authoring/index.md) | プレイヤー文面への適用 |
| 公開用の文面と説明順 | [プレイヤー向け設定](/player-facing/index.md) | 世界事実の投影のみ |
| 設定クラス、カタログ、フレーバー | 各領域の`content_layer: setting-class`所有者 | 実装資料は`normative_basis`で従う |
| Def、数値、素材、Recipe、工数、製造時間 | 各担当製品の`content_layer: implementation`所有者 | 設定クラスの存在・由来・用途を再定義しない |
| 帝国系と同盟系の製品系列 | [帝国系と同盟系の製品系列](/world/42-帝国系と同盟系の製品系列.md) | 個別カタログは系列を参照し、ゲーム値は実装境界へ従う |
| 帝国系と同盟系の製品系列のゲーム表現 | [帝国系と同盟系の製品系列の実装境界](/design/43-帝国系と同盟系の製品系列の実装境界.md) | 個別Defは傾向と例外理由を具体化する |
| Human Weapons計画の設定 | [Human Weapons計画](/design/44-Human-Weapons計画設定クラス.md) | 個別火器は計画要求を参照し、一件ずつ設定クラスを持つ |
| Human Weapons計画のゲーム表現 | [Human Weapons計画の実装境界](/design/45-Human-Weapons計画の実装境界.md) | 個別Defは人間使用、構造材、品質なし、非結晶弾薬を具体化する |
| 同盟装備のアーカイブ番号と種類コード | [装備アーカイブ番号体系](/design/46-装備アーカイブ番号体系.md) | 個別カタログは番号を付与し、意味を再定義しない |
| 装備アーカイブ番号のゲーム表現 | [装備アーカイブ番号の実装境界](/design/47-装備アーカイブ番号の実装境界.md) | Defは安定メタデータを保持し、形式と重複を検証する |
| HORIZON A1の設定 | [HORIZON A1人間用制式小銃](/design/48-HORIZON-A1人間用制式小銃.md) | 計画資料と個別実装はこの設定クラスを参照する |
| HORIZON A1のゲーム表現 | [HORIZON A1の実装境界](/design/49-HORIZON-A1の実装境界.md) | Def、Recipe、弾薬、発熱、比較値を具体化する |
| 装備庫接続と近光速武器転送 | [装備庫接続と近光速武器転送](/world/43-装備庫接続と近光速武器転送.md) | 装備、Pawn、物流実装は実物転送と非FTL境界を参照する |
| 装備庫接続と武器転送のゲーム表現 | [装備庫接続と武器転送の実装境界](/design/50-装備庫接続と武器転送の実装境界.md) | Core専用Buffer、交換取引、UI、保存、上流接続を具体化する |
| 五つの代表工業資源の構成 | [代表工業資源](/world/33-代表工業資源.md) | 個別資源と実装仕様からの参照 |
| Cell | [Cell](/world/34-Cell.md) | 技術体系、開始物資、個別Recipeからの要約・参照 |
| エネルギー上位ジャンル | [エネルギー](/world/40-エネルギー.md) | 身体、装備、設備、供給網からの参照 |
| エネルギー結晶 | [エネルギー結晶](/world/41-エネルギー結晶.md) | 開始物資、外地供給、身体・装備実装からの参照 |
| 凝縮真空（CVE） | [凝縮真空](/world/35-凝縮真空.md) | エネルギー分野の存続技術としての参照 |
| 構造材 | [構造材](/world/36-構造材.md) | 建築、Recipe、救援仕様からの参照 |
| 保守資材 | [保守資材](/world/37-保守資材.md) | 修理、保守、Recipeからの参照 |
| 弾薬結晶 | [弾薬結晶](/world/38-弾薬結晶.md) | 装備、弾薬、開始物資からの参照 |
| 同盟通貨 | [同盟通貨](/world/39-同盟通貨.md) | KombinatのAccount実装、交易、開始口座からの参照 |
| 代表工業資源のDef・Recipe・流通 | [代表工業資源の実装境界](/design/38-代表工業資源の実装境界.md) | 個別Def・Recipeはこの契約と各設定所有者へ従う |
| エネルギー接続・結晶供給 | [エネルギー供給の実装境界](/design/42-エネルギー供給の実装境界.md) | 身体・装備・設備実装は供給状態と不足時挙動を参照 |
| Field Ledger Terminalの設定 | [Field Ledger Terminal設定クラス](/design/39-Field-Ledger-Terminal設定クラス.md) | UI・建築・破壊処理は独立開拓団実装が所有 |
| Field Workshopの設定 | [Field Workshop設定クラス](/design/40-Field-Workshop設定クラス.md) | Recipe・工数・失敗処理は独立開拓団実装が所有 |
| Pawn Foundryの設定 | [Pawn Foundry設定クラス](/design/41-Pawn-Foundry設定クラス.md) | 生成・登録・保管・Clone処理はPawn仕様が所有 |
| 匿名のソフェル | [匿名のソフェル](/characters/anonymous-sofer/index.md) | 現行人物像、実装予約、物語候補を分離して参照 |
| 参考資料の分類と再利用境界 | [参考](/reference/index.md) | 外部調査、旧案、バックストーリー、履歴からの参照 |
| 個別バックストーリー | [バックストーリー](/backstories/index.md) | 参考資料として保持し、再利用時は正史・制作・実装の所有者へ内容を移す |
| 判断の経緯 | [決定履歴](/decisions/index.md) | 現行仕様の根拠。現行事実の所有は禁止 |
| 外部調査 | [調査・参照](/research/index.md) | 設計判断の根拠。製品仕様の所有は禁止 |

## 更新規則

1. 事実を変更するときは所有者だけを変更する。
2. 要約・投影は事実を再定義せず、所有者へリンクする。
3. 所有者を移すときは旧ファイルを`summary`または`deprecated`へ変更する。
4. 同じ`canonical_for`を複数の`source-of-truth`へ付けない。
5. オーバーホール中の候補は`under-review`へ隔離し、相違を直ちに正史の矛盾へ数えない。
6. 同じ品の設定クラスと実装値は別所有者へ置き、設定側から実装側へリンクする。
7. OKF外の旧原本は所有者に数えない。出典リンクが残っていても、現行判断は`knowledge/`内の正規所有者だけで行う。
8. 三つ以上の領域から反復参照される固有名、独立した確定事項・未確定事項を持つ概念、または実装の`normative_basis`になる概念には、専用の設定クラス所有者を置く。
9. Factory Buffer、Reservation、Transaction等の純粋な実装型、未採用の候補Recipe出力、単なる表示上の別名には、世界設定の専用所有者を乱立させない。独立した世界内の由来・用途・評価を採用した時点で再審査する。

## 関連項目

- 上位索引: [governance](/governance/index.md)
- 同じ出典の前項: [RIM OKFメタデータ契約](/governance/metadata-contract.md)
- 同じ出典の次項: [重複と異なる粒度の管理規則](/governance/duplication-policy.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- バックストーリー群: [バックストーリー群](/backstories/index.md)
- 参考資料: [参考](/reference/index.md)
- 矛盾監査: [矛盾監査台帳](/contradictions/index.md)
- 設定と実装の分離: [設定クラスと実装値の分離](/authoring/15-設定クラスと実装値の分離.md)
- 旧資料の退役: [旧資料退役監査](/authoring/21-旧資料退役監査.md)
