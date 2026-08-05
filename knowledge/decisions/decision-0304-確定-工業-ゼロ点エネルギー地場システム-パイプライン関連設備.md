---
type: "Decision Log Entry"
title: "確定#304：工業（§12ゼロ点エネルギー地場システム・cell・パイプライン関連設備）をCoreMODから分離し、新設「Shion Race:」冠称の共有前提MOD「Shion Race: 無零花」（仮称）へ移管"
description: "工業（§12ゼロ点エネルギー地場システム・cell・パイプライン関連設備）をCoreMODから分離し、新設「Shion Race:」冠称の共有前提MOD「Shion Race: 無零花」（仮称）へ移管を確定した決定履歴。"
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
canonical_for: "decisions/decision-0304"
canonical_scope: "decision-history"
source_section: "確定#304"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#304：工業（§12ゼロ点エネルギー地場システム・cell・パイプライン関連設備）をCoreMODから分離し、新設「Shion Race:」冠称の共有前提MOD「Shion Race: 無零花」（仮称）へ移管

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_実装計画書_v1.md「MODファミリー一覧」・シオン/Shion_CoreMOD資料_v1.md§12]

ユーザー指示「あと工業周りは全て新しいShion Race:関連の前提MODとして作るべき」を受け、以下を確定：

- **§12ゼロ点エネルギー地場システム全体をCoreMODから分離**——地場濃度ゲージ・真空相転移インシデント・無零花（コシダ限定）・発電機/真空濃縮器/備蓄装置/濃縮真空エネルギー・cell・パイプライン関連設備・メカナイト化植物専用工場を、新設の共有前提MOD「**Shion Race: 無零花**」（仮称）へ移管する。**確定#214/#222の「独自開拓団の基礎資源経済メカニクスとして必須のためCoreMOD本文内に直接記載」という方針を撤回**。
- **「Shion Race:」冠称MODの第3例**——CoreMOD・Shion Race: Red Starに続く3番目の「Shion Race:」冠称MOD。工業・資源経済という同盟の物質的基盤を担うことを名称で一目で示す。
- **分離の理由＝分身の「単独でMODとして成立する」性質との整合**：確定#300で分身（旧称/開発コード：Shion Nexus）は「フルのシオン/Shion拡張設定への依存なしに単独でプレイ可能」と確定し、かつ資源経済は既存のcell／濃縮真空エネルギーに統一すると確定していた。この2つを両立させるには、cell／濃縮真空エネルギーの提供元がCoreMOD全体である必要はなく、**工業だけを担う薄い前提MODへの依存で足りる**——これにより分身はCoreMOD本体（種族・戦闘・職級等の重い要素）に依存せず、「Shion Race: 無零花」のみを前提とすればよくなる。
- **CoreMODの前提を更新**：CoreMODも「Shion Race: 無零花」に軽く依存する形でcell／濃縮真空エネルギー機能を利用する（CoreMOD自体が工業機能を内蔵しなくなる）。資源植物カタログ本体（品種区分・栽培レシピ・Tier別地場濃度消費量）は引き続き`シオン/Shion_資源植物_ミチューリン農芸公社資料_v1.md`が担当し、変更なし。
- **将来の設計改良の受け皿**：確定#303で追加したアークナイツ:エンドフィールドAIC設計分析レポートの提言（固定スループット＋詰まり可視化・リソース種類の絞り込み等）は、この新設前提MOD「Shion Race: 無零花」内での改良検討先として位置づける。

実装計画書「MODファミリー一覧」に新規行を追加しCoreMOD行・分身行の前提列を更新、CoreMOD資料v1§12冒頭に移管注記を追加、コンセプト設計書§17「分身」の資源経済記述を更新。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#303：外部リファレンス「アークナイツ:エンドフィールド AICシステム設計分析レポート」を新規資料として追加](/decisions/decision-0303-確定-外部リファレンス-アークナイツ-エンドフィールド-システム.md)
- 同じ出典の次項: [確定#305：分身固有の工業メカニクス（Tower Ledger等）をShion Race: 無零花の単一工業システムへ統合——Shion Race: 無零花は大幅な改変を予定](/decisions/decision-0305-確定-分身固有の工業メカニクス-等-を-無零花の単一工業システム.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#304`
