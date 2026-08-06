---
type: "Decision Log Entry"
title: "確定#166：体力システムの機械化（冷媒漏出・技師修理）"
description: "体力システムの機械化（冷媒漏出・技師修理）を確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0166"
canonical_scope: "decision-history"
source_section: "確定#166"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#166：体力システムの機械化（冷媒漏出・技師修理）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_コンセプト設計書_v2.md 本文 §8.4（体力システムの機械化）]
## 8.4 体力システムの機械化（冷媒漏出・技師修理／確定#166・2026-07-04・ユーザー指示「体力システムをメカぽくしようか」で新設）

参考MOD調査（Vanilla Races Expanded: Android「Neutro loss」、Rim-Robots「Mechanents」、Big and Small: Simply Robots）を踏まえ、既存のC45/C48（痛みなし化・出血率12%・感染率0%）・#6/#9/#10（EMP/過熱/機械障害）に続く体力システムの機械化第2弾として、**出血の代替**と**回復手段の二重化**を新設する。

**①出血→冷媒漏出への代替**：バニラの出血(Blood loss)を、種族専用**「冷媒漏出」**（フレーバー＝冷媒／潤滑油の漏出）Hediffへ全面代替する。実装方式はVanilla Races Expanded: Androidの「Neutro loss」（Blood lossを代替し、影響先をConsciousnessのみに限定）と同型——bleedRateに応じて重症度が蓄積する点は通常の出血系Hediffと同じだが、**影響先を意識(Consciousness)のみに限定し、血流(BloodPumping)は対象外**とする。RimWorldはBloodPumpingが0%になった時点で致死するため、対象から外すだけで**冷媒漏出単体では絶対に死なない**（意識を失い倒れるのみ）——C48で確定済みの出血率12%という低リスク設定と組み合わさり、XMLの`capMods`ターゲット変更のみで実現できる（vanilla-first・新規C#不要）。

- **兵級Superclottingの再定義**：確定#34の兵級固有「超高速再生＋Superclotting＝出血死しない」は、冷媒漏出が種族共通で非致死化された後は**「出血死しない」という質的な差別化が種族全体の基礎仕様に格上げ**される。兵級の優位性は**「漏出の収まりが最速（意識低下からの復帰が速い）」という速度の差**として再定義し、質的差ではなく量的差に整理する。
- **痛みなし継続**：冷媒漏出Hediffにも確定#45/#48のpainless doctrine（`painPerSeverity=0`）を適用し、通常の負傷と同様に痛みを伴わない。HAVURAHの例外（確定#51）はそのまま維持。

**②二重回復路線（医療／技師修理）の新設**：負傷した個体は、以下の**2つの独立した回復手段**をプレイヤーが選べる。

1. **医療（バニラ継承）**：Doctor職・Medicineアイテムによる従来のTend/治療。時間経過での自然回復・Immunity Gain Speedはバニラのまま——実装コストゼロ。
2. **技師修理（新設）**：確定#51/#52「オーバーホール」と同じ`RecipeWorker`ファミリー（`Recipes_CoreRepair.xml`）に技師修理版レシピを新設し、患者ベッド上の手術Billとして選択可能にする。`workSkill=Construction`（Medicineではない）——技師（§17技師級・確定#69の特化技師級含む）が鋼／コンポーネントを消費して修復する。**通常の医療では治せない欠損部位（切断・破壊された身体部位）も、技師修理では義肢ではなく原型スペック相当に全回復できる**——これがオーバーホールにない技師修理独自の強み。
   - **コストはTierごとに既存の製造コスト倍率（§15-A グレード別ステータス差表の「製造コスト／時間」行：−Tier 50%/60%・Tier0 100%/100%・+Tier 280%/200%）を再利用**——+Tier個体ほど部品コストが高く、−Tier個体は安く直る、という既存の量産哲学と自然に統合する。負傷の重症度・欠損部位数に対する具体的な係数はPhase9で確定（バランス基準書§4.1へ追記予定）。
   - どちらのルートも選べる＝「安いが遅い医療」と「高いが確実・欠損も治る技師修理」をプレイヤーが状況に応じて選択する、§5「資源で買い消せる」哲学の体力版。

**CoreMODスコープ**：本節の全機構（冷媒漏出Hediff・技師修理レシピ）は確定#84のCoreMOD最小化方針が明示的に残した「Tier/Quality/オーバーホール/改造ポイント制」の直接拡張であり、§8.1メンテナンス／§8.3過熱システムのような拡張MOD「猫のゆりかご」への移管対象**ではない**——オーバーホールと同様にCoreMOD本体に残る。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#165：Tier別pt予算（Tier0=任意pt3〜Tier+20=任意pt60）](/decisions/decision-0165.md)
- 同じ出典の次項: [確定#167：任意付与特性プールの拡張](/decisions/decision-0167.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#166`
