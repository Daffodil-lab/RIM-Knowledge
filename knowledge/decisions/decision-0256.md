---
type: "Decision Log Entry"
title: "確定#256：装備段1・段2の解禁研究をそれぞれ「Diaspora Tech company」「旧式装備」として新設・分離"
description: "装備段1・段2の解禁研究をそれぞれ「Diaspora Tech company」「旧式装備」として新設・分離を確定した決定履歴。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0256"
canonical_scope: "decision-history"
source_section: "確定#256"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#256：装備段1・段2の解禁研究をそれぞれ「Diaspora Tech company」「旧式装備」として新設・分離

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §11、シオン/Shion_コンセプト設計書_v2.md §13、シオン/Shion_実装計画書_v1.md、シオン/Shion_バランス基準書_v1.md、研究ツリー_統合v2.mermaid]
ユーザー指示「段1をDiaspora Tech companyという新しく研究へ　段２を旧式装備という新しく研究へ」を受け、これまで「ユニット製造プロトコル」に一括で含まれていた§9装備カタログの段0-2解禁研究を分割。AskUserQuestionで前提研究の構成を確認し、**連鎖式**（ユニット製造プロトコル→Diaspora Tech company→旧式装備）を選択。ユニット製造プロトコルは段0（Diaspora民生）の解禁のみを担う起点として残し、新設した「Diaspora Tech company」が段1（Diaspora戦闘＝TORAH等の火薬式火器一式）を、「旧式装備」が段2（同盟旧制式＝CR-1170チャージライフル／GEVURAH Heavy等、CoreMOD層Aの通常プレイ到達上限）をそれぞれ解禁する、という段階制の研究チェーンに変更した。CoreMOD資料v1§11に2行追加。

コンセプト設計書v2§13の研究リストにも同様に反映し、項目数が2つ増えたため以降の項目番号を再度2つ後ろ倒し（前回確定#255の番号からさらにズレる）。「§13-N」参照を実装計画書・バランス基準書側も含め全面的に更新した（§14決定ログは今回も対象外、[[feedback-meiko-workflow]]の区別原則を継続適用）。正本の研究ツリー図`研究ツリー_統合v2.mermaid`にもDIA（Diaspora Tech company）・OLDEQ（旧式装備）の2ノードを追加し、MFG→DIA→OLDEQのチェーンとして接続、classDefは既存の装備ティア系ノード（eqp）と同じグルーピングに含めた。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#255：研究「評議会工学（基礎）」を廃止し「ユニット製造プロトコル」へ統合、関連する§13番号を再度全面連番化](/decisions/decision-0255.md)
- 同じ出典の次項: [確定#257：Diaspora装備17品目（KVUTZA／SHTETL／HAGANAH／SINAI／NER TAMID／HAVDALAH／ZION／GALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVA／CHUTZPAH／MASADA／PURIM／SHALVA）を段1から段0へ再分類](/decisions/decision-0257.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#256`
