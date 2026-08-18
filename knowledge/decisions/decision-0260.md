---
type: "Decision Log Entry"
title: "確定#260：バランス基準書v1の既存懸念5件は設計意図と確認、CoreMOD資料v1§4の任意pt記述を訂正"
description: "バランス基準書v1の既存懸念5件は設計意図と確認、CoreMOD資料v1§4の任意pt記述を訂正を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0260"
canonical_scope: "decision-history"
source_section: "確定#260"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#260：バランス基準書v1の既存懸念5件は設計意図と確認、CoreMOD資料v1§4の任意pt記述を訂正

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_バランス基準書_v1.md §4.4（新設）、シオン/Shion_CoreMOD資料_v1.md §4]
Claude壁打ちセッション（2026-07-06）にて、バランス基準書側に残っていた5件の懸念事項を検討し、いずれも「バグ・想定漏れ」ではなく意図した仕様であることを確認した。**①無制限クローン×パッシブ資源生成トレイト（副産モジュール等）**：「その数を用意できる開拓団が最良の結果を得るのは当然」という設計意図により上限なしのまま維持——大量複製自体がPC負荷の自制装置になり、ストーリーテラーの襲撃圧力スケーリングにより富の急増が襲撃強度にも跳ね返るため攻守は自然に釣り合う。**②弱点負債pt×不思議な時計仕掛け**：Tier+20狐人形が弱点負債（20pt）を「不思議な時計仕掛け」（−20pt）1つで相殺し強力な常時バフを得られる件は、「寿命を対価に最強を得る」を狐人形の正解ルートとして機能させる意図どおりで修正不要（Phase9の実プレイでブレーキとして機能するか検証）。**③任意pt/自動pt表と本文記述の食い違い**：CoreMOD資料v1§4の本文「−Tierの任意付与ポイントが負値になる」という記述と確定数値表（Tier−10で0が下限）の矛盾は、古い資料が混入した記述ミスと判明——CoreMOD資料v1側を確定数値表に整合する記述へ修正した（要修正・対応済み）。**④Tier線形ボーナス×製造コスト複利**：指数関数コスト増から複利へ落ち着けた経緯は妥当と再確認し、実効戦闘力の伸びがコストの伸びを上回る可能性という残る懸念は式の再設計ではなく実プレイ検証で判断する方針を維持。**⑤正負ptの段差（狐人形専用負特性のみ−20／−25、他は−1〜−2）**：狐人形専用のネタ枠・ロールプレイ枠として割り切ることを確認し、中間層（−3〜−10程度）の負特性を無理に埋める必要はないとした。バランス基準書v1に新設§4.4（C91）として記録し、CoreMOD資料v1§4の該当記述を修正した。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#259：CoreMOD資料v1§6・Tier強化（後天的なTier昇格）を新設](/decisions/decision-0259.md)
- 同じ出典の次項: [確定#261：装備数値表v1・銃搭載バイポットによる展開システムを検討開始（未実装）](/decisions/decision-0261.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#260`
