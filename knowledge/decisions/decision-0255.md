---
type: "Decision Log Entry"
title: "確定#255：研究「評議会工学（基礎）」を廃止し「ユニット製造プロトコル」へ統合、関連する§13番号を再度全面連番化"
description: "研究「評議会工学（基礎）」を廃止し「ユニット製造プロトコル」へ統合、関連する§13番号を再度全面連番化を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0255"
canonical_scope: "decision-history"
source_section: "確定#255"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#255：研究「評議会工学（基礎）」を廃止し「ユニット製造プロトコル」へ統合、関連する§13番号を再度全面連番化

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §11、シオン/Shion_コンセプト設計書_v2.md §13、シオン/Shion_実装計画書_v1.md、シオン/Shion_バランス基準書_v1.md、研究ツリー_統合v2.mermaid]
Claude.aiレビューコメントの指示「評議会工学（基礎）」に対する「廃止」要求を受け、AskUserQuestionで廃止後の扱いを確認（メンテナンスステーション＋維持管理〔#7〕の解禁を「ユニット製造プロトコル」へ統合、を選択）。CoreMOD資料v1§11から「評議会工学（基礎）」行を削除し、「ユニット製造プロトコル」の内容にメンテナンスステーション＋維持管理の解禁を統合、前提研究を「なし」（新たな起点）に変更。従来「評議会工学」を前提としていた「ゼロ点エネルギー工学」の前提研究も「ユニット製造プロトコル」へ差し替えた。

コンセプト設計書v2§13の研究リストにも同様に波及させ、該当項目を統合の上、以降の全項目番号を1つ前倒し（確定#254で一度連番化した番号がさらにもう1段ずれる）。本文中に散在していた「§13-N」参照（CoreMOD資料・コンセプト設計書・実装計画書・バランス基準書の4資料、計20箇所以上）を新番号体系へ再度全面的に更新した。**コンセプト設計書v2§14「確定事項（設定サマリ）」内の決定ログ項目（確定#254と同じ理由で対象外）は今回も変更していない**。

加えて、正本の研究ツリー図`研究ツリー_統合v2.mermaid`（Def化の指針とされる図）にも波及するかAskUserQuestionで確認し「波及させる」を選択。R（評議会工学）ノードをMFG（ユニット製造プロトコル）へ統合し、HEAT（熱エンジン制御）・WEAK（弱点対抗ツリー）・REFINE（コア精錬）の3ノードをFIX（統合されたシステム）1ノードへ統合。エッジを繋ぎ直し（MFG→CORE→FIXという単一の前提チェーンに整理、CoreMOD資料v1§11の「前提研究＝ユニット修理のみ」という確定仕様と一致させた）、classDefのグルーピングも更新した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#254：研究「コア精錬」「弱点対抗ツリー」「熱エンジン制御」の3研究を「統合されたシステム」1研究へ完全統合、関連する§13番号を全面的に連番化](/decisions/decision-0254.md)
- 同じ出典の次項: [確定#256：装備段1・段2の解禁研究をそれぞれ「Diaspora Tech company」「旧式装備」として新設・分離](/decisions/decision-0256.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#255`
