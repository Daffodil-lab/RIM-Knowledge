---
type: "Decision Log Entry"
title: "確定#116：Leviathansの前提はハードゲートでなく難易度によるソフトゲート"
description: "Leviathansの前提はハードゲートでなく難易度によるソフトゲートを確定した決定履歴。"
tags:
  - "decision-log"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0116"
canonical_scope: "decision-history"
source_section: "確定#116"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#116：Leviathansの前提はハードゲートでなく難易度によるソフトゲート

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_コンセプト設計書_v2.md 本文 §17（内戦の影の英雄・拡張MODの理念）]
- **前提はハードゲートでなく難易度によるソフトゲート（確定#116・2026-07-02・ユーザー指示で補足）**：ユーザー指示＝「Leviathansはやるだけなら条件無しでこう難度なので注意する」——確定#90/#96の「前提条件」は、**クエストロック等でプレイヤーを機械的に締め出すハードゲートとしては実装しない**。プレイヤーは他5子MODを未クリアのままLeviathansに挑戦すること自体は**可能**（強制的な前提チェックは設けない）——ただしその場合、**その圧倒的な難度そのものが事実上の関門として機能する**。実装上は前提クリアの有無を判定してブロックするコードは不要で、代わりに**未達成状態での無謀な挑戦に対する警告（UI上の注意喚起・説明文での明示等）**を用意すれば足りる、という軽量な実装方針になる。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#115：ドクトル・ジバゴの史実の結末（皇族の死に絶え）訂正](/decisions/decision-0115.md)
- 同じ出典の次項: [確定#117：FTL時間旅行・亜光速航行は純粋なlore/設定であり実装不要](/decisions/decision-0117.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#116`
