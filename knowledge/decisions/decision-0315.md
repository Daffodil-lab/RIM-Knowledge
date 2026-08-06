---
type: "Decision Log Entry"
title: "確定#315：「労務資本」を「人口」と「労働者」の2資源へ分割——基礎資源は7種へ"
description: "「労務資本」を「人口」と「労働者」の2資源へ分割——基礎資源は7種へを確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0315"
canonical_scope: "decision-history"
source_section: "確定#315"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#315：「労務資本」を「人口」と「労働者」の2資源へ分割——基礎資源は7種へ

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md§13.2]

レビューコメント「労働資本を人口と労働者の二つに分けて　労働者は今何らかの仕事に付いている/予約されている数字　人口は労働者を含む総人口」を受け、以下を確定：

- 旧「労務資本」（`RIM/docs/19`§4.3、実体Pawnを介さず台帳内の作業能力を割り当てる資源）を、Stellarisの人口(POP)／職業(Jobs)の関係に倣い**人口**と**労働者**の2資源へ分割する。
  - **人口**：労働者を含む総人口。台帳が把握する母集団の総数。
  - **労働者**：人口のうち、現在何らかの仕事に就いている、または予約されている数。旧「労務資本」が持っていた「実体Pawnを介さず台帳内の作業能力を割り当てる」機能はこちらが継承する。
- 基礎資源は「CVE・構造材料・労務資本・Cell・食料・消費財」の6種から、労務資本を人口／労働者に分割した**7種**（CVE・構造材料・人口・労働者・Cell・食料・消費財）へ変更。
- `シオン/Shion_地場_仕様書_v1.md`§13.2の表・説明文・見出しを7種表記に更新。生活水準（確定#314）の適用単位も「労働資本」表記から「人口／労働者」表記へ統一。
- **未確定として明記**：人口と労働者の具体的な数値関係（人口の増加要因、労働者への割当上限等）。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#314：消費財に「生活水準」システムを追加——ステラリスの生活水準（消費財消費倍率とバフのトレードオフ）を参考に、労働資本/ポーン当たりの設備生産性バフを消費財消費と引き換えに得る仕組みを導入](/decisions/decision-0314.md)
- 同じ出典の次項: [確定#316：ステラリスの抽象的な資源（研究力・統合力・影響力）を資源枠として予約——研究力は毎朝8時にバニラ研究を自動進行、統合力は役職相当バフ付与等、影響力はワールドマップ機能用](/decisions/decision-0316.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#315`
