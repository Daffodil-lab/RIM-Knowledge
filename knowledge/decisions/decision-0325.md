---
type: "Decision Log Entry"
title: "確定#325：中継塔をワールドマップ規模へ拡張——タイル間の流通網を敷設し接続設備と生産を連携、ポーンも流通網で高速移動可能に"
description: "中継塔をワールドマップ規模へ拡張——タイル間の流通網を敷設し接続設備と生産を連携、ポーンも流通網で高速移動可能にを確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0325"
canonical_scope: "decision-history"
source_section: "確定#325"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#325：中継塔をワールドマップ規模へ拡張——タイル間の流通網を敷設し接続設備と生産を連携、ポーンも流通網で高速移動可能に

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.1・§13.3]

ユーザー指示「中継塔のワールドマップ拡張　流通網をワールドマップに作り下記の設備と接続して生産する事が出来ます勿論ポーンが流通網を使って高速に移動出来ます」を受け、以下を確定：

- 中継塔（§13.1）は、ローカルマップ内の中継だけでなく**ワールドマップ上のタイル間にも流通網（Logistics Network）として敷設できる**。
- 流通網で接続された設備（休眠遺構§13.3の再起動済み施設等を含む）は、遠隔地であっても生産・資源供給のネットワークに参加できる。
- **ポーンはこの流通網を利用して高速移動できる**——Endfieldのジップライン網（私設交通網）を参考にした移動手段を兼ねる。
- ワールドマップ規模のルーティングはバニラのキャラバン移動システムを土台とし、ローカルマップの「経路探索なし」ルール（`RIM/docs/19`§10）とは別枠で扱う。
- §13.3「休眠遺構の再起動」の記述を更新し、再起動後の遺構がこのワールドマップ流通網に組み込まれる旨を追記。
- `シオン/Shion_地場_仕様書_v1.md`§13.1・§13.3へ反映。
- **未確定として明記**：ワールドマップ流通網の具体的な敷設方法（タイル間の接続条件・コスト）、ポーン高速移動の具体的な速度倍率・実装方式。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#324：Tower Ledger統合工業システムのRecommendations項目3「休眠遺構の再起動」を確定——気まぐれなシオン/Shionが残した施設を中継塔で再接続、ローカル/ワールドマップの二段構え](/decisions/decision-0324.md)
- 同じ出典の次項: [確定#326：探索⇄工業の循環（資源ノード発見）を確定——バニラ非製造資源・対応MOD資源の効率的な入手経路として位置づけ](/decisions/decision-0326.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#325`
