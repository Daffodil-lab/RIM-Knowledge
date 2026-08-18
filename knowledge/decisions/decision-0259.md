---
type: "Decision Log Entry"
title: "確定#259：CoreMOD資料v1§6・Tier強化（後天的なTier昇格）を新設"
description: "CoreMOD資料v1§6・Tier強化（後天的なTier昇格）を新設を確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0259"
canonical_scope: "decision-history"
source_section: "確定#259"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#259：CoreMOD資料v1§6・Tier強化（後天的なTier昇格）を新設

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §6]
Claude壁打ちセッション（2026-07-06）にて、「Tier−10で安く製造→愛着を持って育てて最強にする」を推奨ルートにしたいという設計意図に対し、現行資料にはTierを後から引き上げる手段が存在しないという欠落が判明。既存のオーバーホール機構（技師による分解・再組立）の追加モードとして「Tier強化」を新設し、新規の建造物・研究は追加しないことを確定。対象は生存中の個体のみ（複製・蘇生とは別系統）、一度に1段階のみ昇格可能（複数段の同時昇格は不可）。コストは**目標Tierの基礎製造コスト − 現在Tierの基礎製造コスト**（§4.1複利式の差額、時計仕掛け／有機機械／時計仕掛けの狐人形いずれも自身の複利コスト表を参照）とし、この差額方式によりTier−10から育てて最終的にTier+10へ至る総コストは、Tier+10を新規に一発製造するコストと完全に等価になる（コスト面では中立）。育てる動機はコストではなくスキル面にある——育てた個体は実プレイで蓄積した熟練スキルをそのまま保持するのに対し、新規製造個体はTier×Qualityに基づく初期付与スキルからのスタートになるため、「コストは同じでもスキル面で育てた個体の方が得をする」という誘導が自然に成立する。昇格時、身体ロードアウト枠数（Tier+1、§8.1）・任意pt/自動pt（§6数値表）・狐人形の弱点負債pt（Tier数連動、§4.1）はいずれも新Tier値へ自動的に再計算され、増えた弱点負債ptがあれば通常のオーバーホール同様その場で追加の負特性選択を要求する。Quality・現在のスキル・個人名・任務・特性構成（pt増減以外）はTier強化の前後で保持される。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#258：CoreMOD資料v1§4.3・無制限スタック特性に整数上限式を新設](/decisions/decision-0258.md)
- 同じ出典の次項: [確定#260：バランス基準書v1の既存懸念5件は設計意図と確認、CoreMOD資料v1§4の任意pt記述を訂正](/decisions/decision-0260.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#259`
