---
type: "Decision Log Entry"
title: "確定#212：メカナイト化資源（抽象化パイプライン通貨）を新設——全100品目・全Tierの産出物をTier N→(N+1)単位の線形レートで単一資源へ変換、変換コストは§5.3のTier別基準消費量式を流用してTierバランスを維持"
description: "メカナイト化資源（抽象化パイプライン通貨）を新設——全100品目・全Tierの産出物をTier N→(N+1)単位の線形レートで単一資源へ変換、変換コストは§5.3のTier別基準消費量式を流用してTierバランスを維持を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0212"
canonical_scope: "decision-history"
source_section: "確定#212"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#212：メカナイト化資源（抽象化パイプライン通貨）を新設——全100品目・全Tierの産出物をTier N→(N+1)単位の線形レートで単一資源へ変換、変換コストは§5.3のTier別基準消費量式を流用してTierバランスを維持

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_資源植物_ミチューリン農芸公社資料_v1.md §7.6]
ユーザー指示「パイプライン資源でメカナイト化した素材　各Tier事に素材を抽象化して扱う　Tier0は1　Tier20は21　というかこの素材群を簡単に扱える様にする方法は（でもTierバランスを保ったまま）」を受け、全100品目・全Tier0〜20の産出物をサミズダート（§7）の変換技術により単一の「メカナイト化資源」（§5.8の濃縮真空エネルギーと同じVEF PipeSystem経由で輸送）へ変換する仕組みを§7.6として新設。元ネタはバニラRimWorld自身が持つ抽象化の実在の前例2つ——Components／Advanced Components（部品を2種の汎用資源へ集約するバニラシステム）と、メカナイト（Mech gestator＝「メカナイト豊富な液体で満たされたタンク」という実在のBiotech DLC資源）——を組み合わせたもの。出力側の変換レートはユーザー提案どおり線形（Tier N→(N+1)単位、Tier0＝1単位、Tier20＝21単位）とする一方、変換プロセスそのものの地場濃度コストは§5.3のTier別基準消費量の式（Недра=1、Мастерская以降+4〜+5／日）をそのまま流用することでТierバランスを維持——低Tier品を大量変換して高Tier相当量を安く稼ぐ抜け道が経済的に成立しない設計とした。「Tier間の依存関係レシピは存在しない」（§4.1、確定#208）という原則は維持したまま、上位システムが具体的品目ではなく抽象化された量だけを要求できるようにする実装上の橋渡し役と位置づけた。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#211：GregTech: New Horizons（およびTerraFirmaGreg）を参考に、メイン資源植物カタログと狐人形専用素材の両方を大幅増設——50品目から100品目・300品種へ拡大](/decisions/decision-0211.md)
- 同じ出典の次項: [確定#213：シオン/Shion_資源植物_ミチューリン農芸公社資料_v1.mdはCoreMOD非同梱と確定——§1〜4はバベットの晩餐会、§5〜7は宇宙商人が実装を担当](/decisions/decision-0213.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#212`
