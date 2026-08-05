---
type: "Decision Log Entry"
title: "確定#321：確定#320を訂正——「地場の拡張」の正体は既存MOD「Shion Race: Red Star」。Red Starの前提を「CoreMOD OR Shion Race: 地場」（どちらか一方で起動可能）へ変更し、分身の独立性（確定#300）と両立させる"
description: "確定番号320を訂正——「地場の拡張」の正体は既存MOD「Shion Race: Red Star」。"
tags:
  - "decision-log"
  - "historical"
  - "red-star"
  - "canon"
organization_groups:
  - "red-star"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0321"
canonical_scope: "decision-history"
source_section: "確定#321"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#321：確定#320を訂正——「地場の拡張」の正体は既存MOD「Shion Race: Red Star」。Red Starの前提を「CoreMOD OR Shion Race: 地場」（どちらか一方で起動可能）へ変更し、分身の独立性（確定#300）と両立させる

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_地場_仕様書_v1.md 冒頭ブロック注記／§13.2／シオン/Shion_実装計画書_v1.md「Shion Race: Red Star」行]

ユーザー指示「というよりShion Race: 地場の拡張はShion Race: Red Starです」および追加指示「Red StarはどちらかのShion Race:が有れば動きます」を受け、確定#320を以下のとおり訂正：

- 誤：「アルコテック級の実装は『Shion Race: 地場』の拡張（仮称・未命名）が担う」（確定#320の記述）
- 正：**アルコテック級の実装を担う「地場の拡張」の正体は、既存MOD「Shion Race: Red Star」である**——新規MODではない。
- **Red Starの依存関係を変更**：従来「前提：CoreMOD」だったRed Starを、**「前提：CoreMOD OR Shion Race: 地場」（どちらか一方があれば起動可能）**へ変更する。CoreMODがある場合は本国lore・遠征艦隊要素（世界観・水仙のlore・ストーリーテラー・艦隊lore・支援要請システム・「同盟派遣開拓団」シナリオ）が有効化され、地場のみの場合はアルコテック技術（地場の資源経済に接続する形）のみが機能する。
- この変更により、確定#300で確定した「分身はフルのシオン/Shion拡張設定（CoreMOD）への依存なしに単独でプレイ可能」という性質を維持したまま、**分身が「地場＋Red Star」の組み合わせのみでCoreMOD抜きにアルコテック技術を得られる**構成になる。
- `シオン/Shion_地場_仕様書_v1.md`冒頭ブロック注記・§13.2のアルコテック技術研究ポイント項目、および`シオン/Shion_実装計画書_v1.md`「Shion Race: Red Star」行を上記に沿って更新（Red Star行の前提列を「CoreMOD」から「CoreMOD OR Shion Race: 地場」へ、フォーカス欄にアルコテック級技術実装の役割を追加）。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#320：確定#319を訂正——アルコテック級の実装はCoreMOD・分身が個別に行うのではなく、「Shion Race: 地場」の拡張（仮称・未命名）が担う。CoreMOD・分身どちらもこの拡張を導入すればアルコテック技術が追加される](/decisions/decision-0320.md)
- 同じ出典の次項: [確定#322：確定#321を補足訂正——地場のみ（CoreMOD無し）でも遠征艦隊要素は機能する。名声を用いた限定的な艦隊支援が可能。完全版の遠征艦隊要素にはCoreMODが必要](/decisions/decision-0322.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#321`
