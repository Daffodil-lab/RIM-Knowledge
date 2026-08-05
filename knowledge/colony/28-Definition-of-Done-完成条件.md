---
type: "Release Gate"
title: "28. Definition of Done"
description: "Core独立開拓団α版は、次を全て満たした時に完成する。"
tags:
  - "shion"
  - "independent-colony"
  - "gameplay"
  - "kombinat"
  - "pawn"
  - "red-star"
  - "the-hive"
  - "equipment"
  - "alpha"
  - "beta"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
  - "red-star"
  - "the-hive"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: section
canonical_for: "colony/28-Definition-of-Done"
canonical_scope: "independent-colony"
source_section: "28. Definition of Done"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md"
    title: "Shion Race: Core — 独立開拓団 設定・実装仕様 v1"
---

# 28. Definition of Done

Core独立開拓団α版は、次を全て満たした時に完成する。

- 工業基盤完成マイルストーンがバニラHumanのfixtureで完了している。
- Core本体と対象の公式DLCで起動できる。
- 保管とKombinatはCore配布物内の正規Assemblyから起動する。
- 三人の独立開拓者で新規開始できる。
- XML／Defで定義したシオンが描画され、健康、負傷、死亡、装備、作業を行える。
- XML／Defで具体的な開始装備、研究、建築、Recipe、名前、背景、開始説明を提供する。
- 独立が反乱や追放ではなく、現地自己決定として伝わる。
- 三人開始が独立開拓団全体の規模上限や代表政体だと誤解されない。
- 本国支援なしでも、技術の種から生活と工業を育てられる。
- 五つの代表工業資源を含む実Thingの予約、消費、保存と、同盟通貨Accountが正常に動く。
- Core独自UIで実Thingを保管・検索・直接入出庫できる。
- 選択品、指定数、全量を通常Map空間へ手動排出できる。
- Kombinat Terminalで具体発注、消費表示、目標在庫、流通優先度を操作できる。
- 通常UIで内部Planや実行器を管理せず、多段生産を実行できる。
- 独立開拓団用の三段以上の多段生産閉路が完成する。
- `Kombinat_発注多段生産_完成要件定義_v2.md`の全`MUST`とA〜J、`Kombinat_追加層_仮想シミュレーション監査_v2.md`のKX-001〜008とS2-001〜018が通る。
- 同一ビルドで新規開始、保存、ロード、通常終了ができる。
- 異なるα／β版のセーブ互換を完成条件にしない。

このDefinition of Doneはα版だけを対象とする。βではαのCore独自保管・接続システムを大容量化し、性能、診断、追加Endpointを拡張する。

この縦切りが完成して初めて、身体Module、Pawn Foundry、適合生成、登録、Clone、無料保管、低コスト再生、装備ファミリーと装備ポイント、生活、救援、派閥、漂着者、認可団、Red Star、休眠遺構、車輌、改良動物、ソフェル開始等をβで追加する。

## 関連項目

- 上位索引: [colony](/colony/index.md)
- 同じ出典の前項: [27. The Hiveとの境界](/colony/27-The-Hiveとの境界.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 正規保管仕様: [Core独自保管・接続システムの実装境界](/design/51-Core独自保管接続システムの実装境界.md)
- 工業先行開発: [工業先行開発マイルストーン](/roadmap/11-工業先行開発マイルストーン.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)

## 出典

- Shion Race: Core — 独立開拓団 設定・実装仕様 v1（退役済み原本: `retired-source://project/シオンShion_Core_独立開拓団_設定実装仕様_v1.md`） — `28. Definition of Done`
