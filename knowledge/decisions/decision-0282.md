---
type: "Decision Log Entry"
title: "確定#282：迫撃砲・MLRS弾種（§2.20）の全数値を口径別に確定、81/120/160mmは互換性なしと明記"
description: "迫撃砲・MLRS弾種（§2.20）の全数値を口径別に確定、81/120/160mmは互換性なしと明記を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0282"
canonical_scope: "decision-history"
source_section: "確定#282"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#282：迫撃砲・MLRS弾種（§2.20）の全数値を口径別に確定、81/120/160mmは互換性なしと明記

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_装備数値表_段0-2_v1.md §2.20、§4実装メモ]
ユーザー指示「決めてない数字を全て埋めて　迫撃砲・MLRS弾種バリエーション　当然のことですが口径事に使える弾薬はべつものです（81㎜　120㎜　160㎜は互換性がありません！）」を受け、確定#275/#277/#278で新設・整理していた迫撃砲/MLRS弾種の全未確定数値（各弾種のDamage/半径/AP、ThingDef実装単位、ジャミング弾のstatFactor/Hediff設計、対障害物弾のDamageDef詳細、化学兵器弾の毒ガス雲実装）を解決した。**最重要の確認事項**：GILGAL(81mm・L16系)／ESH(120mm・Soltam K6系)／SODOM(160mm・Soltam M-66系)は現実の迫撃砲と同様**口径が異なり弾薬に一切の互換性がない**——同じ「榴弾」でも口径ごとに別`ThingDef`・別数値を持つ。実弾データ（M821 81mm HE炸薬0.68kg級／M934 120mm HE炸薬3kg級／Soltam 160mm HE 38kg弾）をWeb調査で確認した上で、口径が上がるほどDamage/半径/延焼時間/毒ガス持続/ジャミング効果が拡大する相対スケールを設定：**榴弾**＝GILGAL45/3.0/14%・ESH70/3.9/16%・SODOM100/5.0/18%（ESHの半径3.9はバニラMortar標準弾と一致）。**破砕性弾頭**＝GILGAL50/3.6/8%・ESH78/4.6/10%・SODOM112/5.8/11%。**燃焼性メカナイト弾**＝Damage22/33/46＋延焼70秒/105秒/140秒（口径に比例して延伸）。**テルミット焼夷弾**＝Damage20/30/42＋延焼47秒（バニラIncendiary基準で口径によらず統一）。**メカナイトを注入した化学兵器弾**＝毒ガスDoT2/3/4 per tick・持続30秒/40秒/50秒（AP対象外・気体のため装甲無視）。**発煙弾**＝煙幕半径4.0/5.0/6.0。**延焼性気化メカナイト弾**＝Damage60/90/125（SODOM版はMIGDAL・ATGMのDamage90を上回る全カタログ最大威力——§0.3「段は個々の武器の絶対値の上限ではない」原則をそのまま踏襲）。**対障害物弾**＝DamageDef=Thump（KESHET同型）でDamage55/85/120・AP60%/65%/70%。**ジャミング弾**＝`ShootingAccuracyPawn`×0.75/0.70/0.65・`MoveSpeed`×0.85/0.80/0.75・持続10秒/15秒/20秒、範囲内はTZOFEH/KESHERの観測対象化を一時禁止。**RAKIA（REHOVOT用・迫撃砲弾とは別系統で互換性なし）**：クラスター対戦車ロケット弾＝Damage35/半径6.0/AP25%、対戦車ロケット弾（単体徹甲）＝Damage130/半径1.5/AP400%。**実装単位**：バニラMortar標準搭載の`CompChangeableProjectile`（Load shellギズモ）を流用し、各Buildingの装填可能ThingDefリストを`fixedStorageSettings`で自口径のみに限定——他口径弾薬の誤装填を防ぐ。ジャミング弾・化学兵器弾はいずれもAnomaly DLC等への依存なしに、着弾地点中心の円形ゾーンへHediffを付与する薄いカスタムCompで実現する方針とした（vanilla-first）。装備数値表v1§2.20を全面改訂（口径別3表＋RAKIA表に再構成）、§4実装メモに口径ロックの実装方針を追記。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#281：SHOFAR（手榴弾ベルト）を装備数値表v1に新規収録し数値を確定](/decisions/decision-0281.md)
- 同じ出典の次項: [確定#283：同盟のFTL技術の規模多様性・物流基盤としての中核性・亜空間内主観時間の超長期化と艦船の永続設計要件](/decisions/decision-0283.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#282`
