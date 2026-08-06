---
type: "Decision Log Entry"
title: "確定#394：Kombinat完成図の仮想シミュレーション、未知MOD互換契約、復旧不能・無限容量の封鎖"
description: "Kombinat完成図の仮想シミュレーション、未知MOD互換契約、復旧不能・無限容量の封鎖を確定した決定履歴。"
tags:
  - "decision-log"
  - "kombinat"
  - "pawn"
  - "equipment"
  - "alpha"
  - "beta"
organization_groups:
  - "kombinat-communities"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0394"
canonical_scope: "decision-history"
source_section: "確定#394"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#394：Kombinat完成図の仮想シミュレーション、未知MOD互換契約、復旧不能・無限容量の封鎖

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: 2026-07-24ユーザー確定――完成したMODとKombinatを中心に、RimWorldで遭遇する困難、全DLC、想定外のMOD導入、必要最低限の知識と探求心を持つプレイヤーの想定外操作まで仮想的にシミュレーションし、問題を探る。]

- `Kombinat_完成図_仮想シミュレーション監査_v1.md`を新設し、序盤から終盤、電力、環境、設備、在庫、流通、生産、Thing参照、Map、Caravan、Odyssey、Pawn Foundry、長期保存、性能までS-001〜070で仮想試験した。
- 通常操作から発生し得る18件の重大問題をF-001〜018として整理した。特に、停電自己封鎖、内容入りCellによる遠距離輸送迂回、Map消滅時の所在未定義、未知Comp／Quest／Recipe、I/O無限往復、Container二重計上、Dormant装備倉庫化、全Pawn不在soft-lock、Archiveによる物理部品複製を公開阻止事項とした。
- 未知MOD互換を`Native Safe`、`Opaque Stasis`、`Adapter Required`、`Quarantined`、`Refused`へ分類し、CMP-001〜012のCompatibility Contractを定めた。未知対象を無条件に安全扱いせず、危険なら元所在を維持して理由付きで拒否する。
- 格納Thing、Pattern、Pawn Design、Archiveへ依存ManifestとPre-uninstall導線を要求した。外部MOD除去後にDefまたはclassが欠落した状態で、元Thing instanceを完全自動復元できるとは保証しない。
- KombinatのαへHARD-001〜018を追加した。無電力のBlack-start Port、内容物mass／bulkを原則1:1で負うCell、Map lifecycle、二段階入庫、Opaque Stasis、Presence Registry、Recipe Safety、origin token、Identity Tracked、Nested Holder、wealth一意化、version pin、Graceful Refusalを必須にした。
- 内容入りCellは物理輸送中にremote accessできない。将来の圧縮輸送は、通常Cellへ隠して入れず、専用設備、研究、費用、明示圧縮率を持つ別機能とする。
- β Pawn FoundryへADV-001〜010を追加した。全Pawn不在時の緊急一体再配備、生存Pawnを要求しない最低一系統のFoundry Work Provider、人格復元費と身体・Module費の分離、Pawn要素別Dormant／Archive／Clone Safe、Ephemeral削除前の参照解決、Design／Loadout version pin、依存Manifestを必須にした。
- 確定#393の「同じ個体と装備を無料保管」を精密化した。無料Dormant保管は人格状態、身体、内蔵Moduleを対象とし、着脱可能な武器、防具、衣服、工具、inventory内Thingは休眠前にKombinatまたはMapへ返却する。返却先がなければDormant化を完了しない。
- Dormant身体と内蔵Moduleは所在MapまたはWorldObjectのwealthへ一度だけ算入する。Archiveが安価に復元するのは人格・構成情報であり、遺体がない身体、Module、装備と各Cloneの物理費は別に必要とする。
- 通常UIは生産、消費、流通の三主題を維持し、互換問題を件数、影響、次の操作へ集約する。技術詳細はDiagnosticsへ遅延表示する。
- αでは監査S-001〜046、S-061〜063、S-067〜070とHARD-001〜018を、βではS-047〜060、S-064〜066とADV-001〜010をRelease Gateへ接続した。1.0では対象RimWorld build、全DLC、互換カテゴリ、Adapter policy、Pre-uninstall、既知Refused対象と代表外部MOD試験を公開する。

反映先：`Kombinat_完成図_仮想シミュレーション監査_v1.md`、`Kombinat_倉庫物流生産_完成要件定義_v1.md`、`Kombinat_実装仕様書_v3.md`、`シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md`、`シオンShion_Core_最終仕様_更新計画_v1.md`、`シオンShion_統合資料_本文優先全体設計版_v2.md`、`docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md`、`docs/40_PLAYER_FACING_SETTING_CORE.md`。

---

*ここまでが2026-07-24時点の確定#394までの旧締めであり、以降に#395・#396を追補する。*

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#393：β版Pawn Foundry、補充可能個体、登録再実体化、Clone Colony](/decisions/decision-0393.md)
- 同じ出典の次項: [確定#395：Matter NetworkをKombinat倉庫基盤として採用し、物理資源を実Thingへ統一](/decisions/decision-0395.md)
- Kombinat領域: [Kombinat領域](/kombinat/index.md)
- Pawn領域: [Pawn領域](/pawn/index.md)
- 正史: [正史](/world/index.md)
- リリース計画: [リリース計画](/roadmap/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#394`
