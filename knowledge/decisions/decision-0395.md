---
type: "Decision Log Entry"
title: "確定#395：Matter NetworkをKombinat倉庫基盤として採用し、物理資源を実Thingへ統一"
description: "Matter NetworkをKombinat倉庫基盤として採用し、物理資源を実Thingへ統一を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "kombinat"
  - "matter-network"
  - "independent-colony"
  - "equipment"
  - "canon"
  - "alpha"
organization_groups:
  - "independent-frontier"
  - "kombinat-communities"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0395"
canonical_scope: "decision-history"
source_section: "確定#395"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#395：Matter NetworkをKombinat倉庫基盤として採用し、物理資源を実Thingへ統一

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24〜25ユーザー確定――マップ上に置かないなら全資源を実在するRimWorld Thingとして扱い、内部stack上限を大きくする。AhHanie/Matter-Networkへ生産・発注システムを追加する方針を検討し、資料を整理・更新する。]

- MIT Licenseの`AhHanie/Matter-Network`を、KombinatのローカルNetwork Storageを開始するフォーク／内包元として採用した。
- 元Matter Networkを別途購読する必須依存にはせず、Core配布物へ派生ソースを内包する方針を既定とした。
- 取り込み時に基準commit、MIT License、著作権表示、採用ファイル、変更理由を固定する。元Matter Networkと同時導入した場合は、二重Controller、二重I/O、二重Harmony patchを診断し、αでは安全に非互換扱いする。
- Matter Networkが持つController、Drive／Disk容量、実`Thing`の`ThingOwner`保管、停止Tick、Interface／I/O、Network結合・分割、Vanilla利用境界を採用候補とした。
- 上流のController破壊時大量排出、wealth除外設定、`int`集計、一個の巨大stackへの無制限吸収、全patchの無監査有効化はそのまま採用しない。
- 凝縮真空、構造材、Cell、栄養／糧食、弾薬結晶を抽象`ResourceStock`へ変換する方針を廃止した。これらは鋼材、部品、薬品、食料、装備等と同じ実`ThingDef`／実`Thing`である。
- 同盟通貨だけを非物理的なAccount残高とした。人口、労働、研究、名声、装備ポイント等も在庫資源にしない。
- 一個の`Thing.stackCount`は安全な`int` chunkへ制限し、Network合計、予約、発注、通貨はcheckedな符号付き64 bit整数で扱う。UI上一行が複数内部stackを集約しても、実instanceを複製しない。
- αの通常在庫はMatter Networkと同じController中心とし、Diskは容量だけを提供する。Disk取外し時に在庫を携帯化せず、容量不足なら`Over Capacity`として新規搬入と新規生産開始を止める。
- Provider／Controller破壊時は一括spawnせず`RecoveryPending`へ保全する。Network内Thingは常に資産価値へ一度だけ算入する。
- Matter Networkが上流で動作することはKombinatの実装進捗へ数えない。Coreへ取り込み、Kombinat差分を実装し、全DLCと受入fixtureを通すまでKombinatは未実装である。

反映先：`README.md`、`Kombinat_実装仕様書_v3.md`、`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`Kombinat_完成図_仮想シミュレーション監査_v1.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_Core_独立開拓団_設定実装仕様_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md`。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#394：Kombinat完成図の仮想シミュレーション、未知MOD互換契約、復旧不能・無限容量の封鎖](/decisions/decision-0394.md)
- 同じ出典の次項: [確定#396：装備の抽象指定を装備ファミリー＋非物理ポイントへ簡略化](/decisions/decision-0396.md)
- 連携境界: [連携境界](/integrations/matter-network/index.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- 独立開拓団: [独立開拓団](/colony/index.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#395`
