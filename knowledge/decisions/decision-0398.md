---
type: "Decision Log Entry"
title: "確定#398：α版からCore独自保管・接続基盤を採用する"
description: "Matter Network必須依存を撤回し、α版から通常Map空間を経由しない独自保管・接続基盤と任意排出を採用した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "storage"
  - "network"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0398"
canonical_scope: "decision-history"
source_section: "確定#398"
generated:
  by: "process:user-confirmed-storage-redesign"
  at: "2026-07-27T00:00:00Z"
  precision: "date"
---

# 確定#398：α版からCore独自保管・接続基盤を採用する

> 履歴項目です。現行仕様は、リンク先の設計・リリース正本を優先してください。

[出典: 2026-07-27ユーザー確定――Matter Networkには利用可能な正式APIがなく、必要なシステムとの差が大きいため、一から独自実装する。搬入と判断は原則として通常空間を通さず、内容物はいつでも任意に通常空間へ出せるようにする。]

- 確定#397の「Matter Networkをα版の必須依存とする」判断を撤回した。
- 上流を改変、複製、フォークしない境界は維持した。
- α版からCore独自のStorage、Network、Import／Export Endpointを正規基盤とする。
- 自動搬入、搬送、在庫判断、生産予約は地面、通常Stockpile、Pawn haulingを中間経路にしない。
- 実Thingは非Spawn状態の`ThingOwner`へ保持し、接続EndpointとFactory Buffer間で直接受け渡す。
- プレイヤーは選択品、指定数、全量をいつでも通常Map空間へ排出できる。
- 予約中のThingを排出する場合は、関係ReservationまたはJobを原子的に取消する。
- 排出先がない場合は内容物を維持し、失敗理由を表示する。
- Matter Networkは必須依存、移行元、通常経路にせず、正式APIが将来提供された場合だけ任意互換Adapterを検討する。
- Monolyn、Arsenal Codex、DSUの映像はUI・操作研究にのみ使い、コード、画像、固有表現、中央セル集積方式を複製しない。

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 前の決定: [確定#397：Matter Networkを無改造の必須依存へ固定する](/decisions/decision-0397.md)
- 正規保管基盤: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- α版: [α版 — 最初の公開候補](/roadmap/04-α版-—-最初の公開候補.md)
- Kombinat α完成条件: [α完成条件](/kombinat/core/12-α完成条件.md)
- UI参照研究: [Kombinat UI参照](/research/kombinat-ui-references/index.md)
