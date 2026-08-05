---
type: "Decision Log Entry"
title: "確定#270：3Dプリンターの無人稼働仕様を確定、新設・液体装薬注入機を追加"
description: "Dプリンターの無人稼働仕様を確定、新設・液体装薬注入機を追加を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0270"
canonical_scope: "decision-history"
source_section: "確定#270"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#270：3Dプリンターの無人稼働仕様を確定、新設・液体装薬注入機を追加

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §12.12・§12.13（新設）]
ユーザー指示「液化メカナイト関連設備無人３Dプリンター（プレイヤーが指定したものを品質があるなら標準で自動で作る稼働に濃縮真空エネルギー必要電気なし）液体装薬注入機中身が空の砲弾等に火薬や燃料メカナイト注入する」を受け、2件を確定した。**①§12.12 3Dプリンターの稼働方式**：無人稼働——専任の技師pawnの常駐や作業時間の消費を必要とせず、プレイヤーが対象`ThingDef`を指定するだけで自動的に生産キューへ入り稼働する。稼働に必要なのは液化メカナイト・濃縮真空エネルギーの資源消費のみで、電力（Power）は一切要求しない（濃縮真空エネルギー自体が動力を兼ねる）。対象品目に`QualityCategory`が存在する場合は標準品質（Normal）で自動生産される。**②新設・液体装薬注入機（§12.13）**：中身が空の砲弾・薬莢等（内容物を持たない容器状の中間製品）に、火薬・燃料・液化メカナイトのいずれかを注入し完成品の弾薬・砲弾へ仕上げる新規施設。対象例はGILGAL/ESH/SODOM（迫撃砲弾）・KESHET等ロケット系の弾頭、その他Diasporaカタログの装薬式弾薬全般。稼働資源は注入する中身に応じて火薬・燃料・液化メカナイトのいずれかを消費し、液化メカナイトインフラ（§12.10）・パイプライン関連設備（§12.11）を経由して供給される。対象品目のホワイトリスト・注入量/消費資源量の具体的数値・無人稼働か技師配置が要るか・建造物のTier/研究前提はいずれもPhase9で確定する。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#269：液化メカナイトも濃縮真空エネルギーと同じパイプライン関連設備を共用すると確定](/decisions/decision-0269.md)
- 同じ出典の次項: [確定#271：3Dプリンター・液体装薬注入機は有人稼働／無人稼働の二種類を持つと確定](/decisions/decision-0271.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#270`
