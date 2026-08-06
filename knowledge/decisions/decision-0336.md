---
type: "Decision Log Entry"
title: "確定#336：新規コア（Nexus Core／Nexusサブコア）はプレイヤーが直接製造できず、回収または名声購入で入手する"
description: "新規コア（Nexus Core／Nexusサブコア）はプレイヤーが直接製造できず、回収または名声購入で入手するを確定した決定履歴。"
tags:
  - "decision-log"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0336"
canonical_scope: "decision-history"
source_section: "確定#336"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#336：新規コア（Nexus Core／Nexusサブコア）はプレイヤーが直接製造できず、回収または名声購入で入手する

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md §13（コア必須要件）・§13.2（資源体系・名声）・§13.3（休眠遺構の再起動）・§13.6（遠隔拠点・Nexusサブコア）]

レビューコメント（§13.2「名声」行の「ワールドマップ上での本MOD関連機能」を対象）：

> 新しいコアはプレイヤーが作れないため古代機械/遠隔拠点のコアを回収するか名声で購入します

これを受け、以下を確定した。

- **新規コアは通常の建築レシピで直接製造できない**——Nexus Core・Nexusサブコア（確定#333）ともに対象。
- **入手経路は2通り**：①休眠遺構の再起動（§13.3・古代機械）や資源ノード探索（§13.4）先で発見・回収する、②同盟本国に対する名声（§13.2・確定#313／#335で確定済みの資源）を対価として購入する。
- §13.2の資源表・名声サブ箇条書きを更新し、「ワールドマップ上での本MOD関連機能」の内容の一つとして上記のコア購入機能を明記した。
- §13.3「休眠遺構の再起動」の報酬箇条書きに、まれに回収可能なNexus Core／Nexusサブコア自体を追加した。
- §13.6「遠隔拠点」に、Nexusサブコアの入手経路を明記する新規箇条書きを追加した。
- §13冒頭の「コア必須要件（一般原則・確定#334）」箇条書きに、新規コア入手経路への参照を追記した。
- **副次的な修正**：§13.3の報酬箇条書きに、確定#335（影響力→名声統合）の適用漏れ（「cell・構造材料・影響力等」の表記）が残っていたことを本作業中に発見し、あわせて「名声」へ修正した。確定#335時点のbash経由grepがこのファイルの古いスナップショットを参照していた可能性が高く（既知のbashマウント陳腐化インシデントと同型）、今回はReadツールでの全文確認により検出・修正した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#335：抽象的資源の3枠目「影響力」を廃し、確定#313で既に導入済みの「名声」へ統合](/decisions/decision-0335.md)
- 同じ出典の次項: [確定#337：今回の開発目的をMVP（最小実行可能製品）までと明記（対象：Tower Ledger統合工業システム§13）](/decisions/decision-0337.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#336`
