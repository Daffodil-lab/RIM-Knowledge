---
type: "Decision Log Entry"
title: "確定#258：CoreMOD資料v1§4.3・無制限スタック特性に整数上限式を新設"
description: "CoreMOD資料v1§4.3・無制限スタック特性に整数上限式を新設を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "pawn"
  - "canon"
status: deprecated
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0258"
canonical_scope: "decision-history"
source_section: "確定#258"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#258：CoreMOD資料v1§4.3・無制限スタック特性に整数上限式を新設

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §4.3]
Claude壁打ちセッション（2026-07-06）にて、§4.3の1pt低コスト特性（精密機工の指先／栽培最適化等の一部）が「時計仕掛け側は重ね掛け無制限」と定義されており、Tier+20（任意pt103）で理論上+1500%超に到達しうる青天井状態だったことが判明。元々は「Tier−10個体が製造コスト比で正特性に一切手が届かないのは不憫」という救済目的で無制限化されていたと確認した上で、無制限スタックの対象特性に**取得可能数の上限＝max(Tier, 0) + 5**という整数上限式を新設。Tier−10〜−1はこの式の対象外で従来どおり「1個は必ず取得可能」という救済ルールを維持し（式の対象は+Tier側のみだがTier0を欠落させないためmax(Tier,0)を採用）、Tier0＝上限5個・Tier+20＝上限25個とした。常設ステータスパネル（§7）に「◯/◯」形式で残数表示できるUI上シンプルな整数上限とし、却下案（1個目1pt→2個目2pt→4個目8pt…の幾何級数コスト方式）は暗算しづらくUI表示も複雑になるため不採用とした。この上限のさらに外側の「本当の最強」は拡張MOD（猫のゆりかご／Apocalypse等）側の担当としてCoreMODでは扱わない整理を維持する。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#257：Diaspora装備17品目（KVUTZA／SHTETL／HAGANAH／SINAI／NER TAMID／HAVDALAH／ZION／GALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVA／CHUTZPAH／MASADA／PURIM／SHALVA）を段1から段0へ再分類](/decisions/decision-0257.md)
- 同じ出典の次項: [確定#259：CoreMOD資料v1§6・Tier強化（後天的なTier昇格）を新設](/decisions/decision-0259.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#258`
