---
type: "Decision Log Entry"
title: "確定#267：CoreMOD資料v1§13新設・ステルス性メカニクス（距離依存の被発見システム）"
description: "CoreMOD資料v1§13新設・ステルス性メカニクス（距離依存の被発見システム）を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0267"
canonical_scope: "decision-history"
source_section: "確定#267"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#267：CoreMOD資料v1§13新設・ステルス性メカニクス（距離依存の被発見システム）

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §13（新設）]
Claude壁打ちセッション（2026-07-06）にて、高Tierステルス部隊による後方浸透・逆襲というイメージを具体化するため、既存のDYBBUK（被発見率低下・`DetectionChance`系statFactor）を距離に応じた具体的な発見判定システムへ拡張することを確定した。新設ステータス「ステルス性」は個体（または装備）が持つ数値ステータスで、値が高いほど敵に発見されにくくなる。ステルス性の値に応じて「敵に発見されずに接近できる最短距離」が決まり（例：ステルス性1＝敵との距離が残り1マスになるまで発見されない）、ステルス性が高いほどこの安全接近距離はさらに短くなる。煙幕の中にいる場合、この安全接近距離をさらに×0.5する。撃たなければ位置は分からない——射撃・攻撃行動を行った瞬間にステルス性は無効化され、通常の被発見判定（バニラの視界・LOSベース）に切り替わる。実装方針は、Royalty/Anomaly/Ideology/Biotech/Odyssey全DLC無効化状態でも「不可視」HediffがCoreカテゴリに表示されることをスクリーンショットで確認した上で確定した（再訂正）——このHediffDef自体はCore defsに定義されており、Royaltyの透明化サイキャストは"入手経路"に過ぎないため、シオン/Shion側は独自のAbility/Compから直接このHediffDefを付与すればよくDLC依存は一切発生しない。この既存Hediffの付け外しを距離条件で管理する軽量Compで実現し、**再展開クールダウン**として露見した瞬間から5秒間（300 tick）は不可視Hediffの再付与を禁止するタイマーを新規に設け、不可視が一瞬で点滅する不自然な挙動を防ぐ。設計ドクトリン（§7.1）「機動」の特性バイアスにステルス性関連の特性バイアスも含める説明文の軽微な拡充も併せて確定した（新カテゴリの追加ではなく既存項目の記述を厚くするのみ）。未確定事項（ステルス性の数値レンジ・距離との変換式・取得方法・クールダウンの調整幅・COUNCIL CYAN発光との相互作用・精神感応度依存の扱い）はPhase9へ持ち越す。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#266：CoreMOD資料v1§7.3・コロニードクトリンをCoreMODスコープから除外し、拡張MOD「エンダーのゲーム」へ移管](/decisions/decision-0266-確定-資料-コロニードクトリンを-スコープから除外し-拡張-エン.md)
- 同じ出典の次項: [確定#268：ステルス性メカニクスの夜間補正を確定——安全接近距離を煙幕と同じ×0.5に](/decisions/decision-0268-確定-ステルス性メカニクスの夜間補正を確定-安全接近距離を煙幕と.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#267`
