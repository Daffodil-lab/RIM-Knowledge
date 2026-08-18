---
type: "Decision Log Entry"
title: "確定#231：CoreMODの無零花メカニクスが直接参照する光源植物を「コシダ」から新設のCoreMOD専用植物「少陽花」に差し替え。コシダ・太陽花は資源植物カタログ側の別品目としてCoreMODと無関係に整理"
description: "CoreMODの無零花メカニクスが直接参照する光源植物を「コシダ」から新設のCoreMOD専用植物「少陽花」に差し替え。"
tags:
  - "decision-log"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0231"
canonical_scope: "decision-history"
source_section: "確定#231"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#231：CoreMODの無零花メカニクスが直接参照する光源植物を「コシダ」から新設のCoreMOD専用植物「少陽花」に差し替え。コシダ・太陽花は資源植物カタログ側の別品目としてCoreMODと無関係に整理

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §12.4・§12.9、シオン/Shion_資源植物_ミチューリン農芸公社資料_v1.md §4（Недра Tier4）、シオン/Shion_コンセプト設計書_v2.md §18]
Claude.aiレビューコメント（該当箇所§12.9「依存の鎖」全体を選択、指示「ここでは扱わない事を記載するな　コシダでは無く　代用の太陽灯の3倍広く光る植物少陽花で無零花を育てます」）を受け、AskUserQuestionで2点を確認。①「少陽花」はコシダ（Недра Tier4・旧称：小陽花）の言い換えではなく別の新規植物か→「別の新規植物（推奨）」を選択。②少陽花は既存の太陽花（ヒマワリ、Tier4）とも同一かコシダ・太陽花いずれとも別の第3の品目か→「太陽花・コシダとは別の新規品目」を選択。これを受け、CoreMODが直接扱う植物（メカナイト化植物を除く）を「無零花と少陽花の2種のみ」に確定。少陽花はそれ自体資源を産出しない、無零花専属の光源作物としてCoreMOD§12.4に直接記述（照度＝バニラ太陽灯の3倍・半径15/35.1マスの数値は元コシダの数値をそのまま継承）し、§12.9の依存の鎖も「コシダを育てる」→「少陽花を育てる」に差し替え。あわせて資源植物カタログ側のコシダ（§4・Недра Tier4）・太陽花（同）の両行から「CoreMOD側が参照する」旨の記述を削除し、両品目ともCoreMODの無零花メカニクスとは無関係な拡張MOD側フレーバー・経済品目として整理。`シオン/Shion_コンセプト設計書_v2.md`§18の「無零花とコシダの関係についての寸評」も「無零花と少陽花の関係」に更新した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#230：CoreMOD§12.7「経済的意味」を修正——Тier別基準消費量の数値論拠から、「無零花を絶やさず植えることが機械投資の有無に関わらず大前提」という実践的な結論へ書き換え](/decisions/decision-0230.md)
- 同じ出典の次項: [確定#232：CoreMOD§12.7「真空濃縮器」の説明に、地場濃度ゲージ・消費量ともに0〜100%の範囲に収まる旨の明記を追加](/decisions/decision-0232.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#231`
