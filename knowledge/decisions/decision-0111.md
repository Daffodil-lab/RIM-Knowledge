---
type: "Decision Log Entry"
title: "確定#111：ゲームプレイ機構＝バニラ準拠の別マップ転送"
description: "ゲームプレイ機構＝バニラ準拠の別マップ転送を確定した決定履歴。"
tags:
  - "decision-log"
  - "pawn"
  - "equipment"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0111"
canonical_scope: "decision-history"
source_section: "確定#111"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#111：ゲームプレイ機構＝バニラ準拠の別マップ転送

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_コンセプト設計書_v2.md 本文 §17（内戦の影の英雄・拡張MODの理念）]
- **ゲームプレイ機構＝バニラ準拠の別マップ転送（確定#111・2026-07-02・ユーザー指示で確定）**：ユーザー指示＝「カタロニア讃歌ファミリー全体はゲーム的には別マップに転送して目的を達成したらそのまま戻る。追加でクエスト報酬」。上記「残響の中でのみ戦闘可能」の具体的な実装方式が確定した——**残響への突入＝プレイヤーのコロニー（一部の入植者・部隊）をバニラ標準の一時的な別マップへ転送し、目的（戦闘勝利等）を達成したら元のマップへそのまま帰還する**、という構造。これはバニラRimWorldの`QuestScript`＋一時マップ生成（古代遺跡・クエストサイト等で既に使われる標準パターン）をそのまま流用できるため、**恒久的なカスタム時間移動システムは一切不要**（確定#102「実装上の含意」の見立てをさらに具体化・裏付け）。**追加でクエスト報酬**——マップ帰還時に、確定#110の「残響の物質的固定化」に該当する報酬（アイテム・ユニーク個体等）をクエスト報酬として付与する、というバニラ`QuestPart`の標準的な仕組みで実現できる。カタロニア讃歌ファミリー全体（真昼の暗黒・武器よさらば・ここではそれは起こりえない・ドクトル・ジバゴ・誰が為に鐘がなるか・Leviathans）に共通する、実装負荷の低い統一ゲームプレイ機構として確定。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#110：戦闘・"if"は残響の中でのみ可能](/decisions/decision-0110.md)
- 同じ出典の次項: [確定#112：真昼の暗黒の実装上の含意（インプラントのみで職級選択）](/decisions/decision-0112.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#111`
