---
type: "Decision Log Entry"
title: "確定#257：Diaspora装備17品目（KVUTZA／SHTETL／HAGANAH／SINAI／NER TAMID／HAVDALAH／ZION／GALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVA／CHUTZPAH／MASADA／PURIM／SHALVA）を段1から段0へ再分類"
description: "Diaspora装備17品目（KVUTZA／SHTETL／HAGANAH／SINAI／NER…。"
tags:
  - "decision-log"
  - "historical"
  - "equipment"
  - "canon"
status: stable
authority: historical
knowledge_role: historical-record
granularity: decision
canonical_for: "decisions/decision-0257"
canonical_scope: "decision-history"
source_section: "確定#257"
generated:
  by: "process:rim-okf-migration"
  at: "2026-07-26T00:54:52.353Z"
sources:
  - id: "migration-source"
    resource: "retired-source://project/シオンShion_改訂履歴ログ_v1.md"
    title: "シオン/Shion プロジェクト改訂履歴ログ"
---

# 確定#257：Diaspora装備17品目（KVUTZA／SHTETL／HAGANAH／SINAI／NER TAMID／HAVDALAH／ZION／GALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVA／CHUTZPAH／MASADA／PURIM／SHALVA）を段1から段0へ再分類

> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。

[出典: シオン/Shion_CoreMOD資料_v1.md §9、シオン/Shion_コンセプト設計書_v2.md §9装備カタログ表、シオン/Shion_装備数値表_段0-2_v1.md、シオン/Shion_バランス基準書_v1.md §3.6.7]
ユーザー指示「KVUTZA（モチーフが古い資料がある）SHTETL　HAGANAH　SINAI　NER TAMID　HAVDALAH　ZION　GALUTH　BRIT　MEZUZAH　DANIEL　ARON　YESHIVA　CHUTZPAH　MASADA　PURIM　SHALVA　を段０へ」を受け、AskUserQuestionで2点を確認。①数値の扱い＝「数値は現状維持、段ラベルのみ変更」を選択（Damage/AP/Range/Mass/Warmup/Cooldown/Accuracy/costList/marketValue等は一切変更せず、カタログ上の段区分〔研究ゲート・掲載節〕のみ移動）。②装備数値表の対応範囲＝「装備数値表も含めて完全に物理移動・全集計更新（フル対応）」を選択（Phase9への先送りではなく、データ行そのものを§1〔段0〕側へ移設し、関連する集計・グルーピング・marketValue表もすべて更新）。

**CoreMOD資料v1§9**：段0/段1の「位置づけ」説明文を更新（段0が散弾銃・小銃系・火炎放射器・近接・投擲・基礎装束まで拡充されたことを明記）。段0（民生）の品目列挙にSHALOM/GOLEM/HAVURAHに加え今回移動した17品目を種別ごとにグルーピングして追加。段1（戦闘）の品目列挙からKVUTZA（小銃系派生の1つ）を削除。

**コンセプト設計書v2 装備カタログ表**（§9内、段0/段1の割当表）：該当15品目（表に掲載されていたHAGANAH／SINAI／KVUTZA／SHTETL／NER TAMID／HAVDALAH／ZION／GALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVA／MASADA／CHUTZPAH）の段列を「1」→「0」に変更。表に未掲載だったSHALVAを新規行として追加（段0・非殺傷投擲品）。PURIMについては「REHOVOT関連弾薬の段割当」注記を新設し、PURIM＝段0（非戦闘用途）・RAKIA/REHOVOT本体＝引き続き段1、と明記。集計行（内訳）を「段0＝36品目／段1＝49品目／合計85品目（本表掲載分。SHALVA/PURIMは本表未掲載のため別枠）」に更新。**既知の課題**：本表の合計（85）と`シオン/Shion_装備数値表_段0-2_v1.md`の合計（88）には元々3品目の差異があり、今回の作業はこの差異を解消するものではなく、両資料それぞれの既存の集計方式内で+17/-17（コンセプト設計書表は+15/-15、SHALVA/PURIM分は別枠扱いのため）を適用したのみ。差異の解消はPhase9で別途検討する。

**装備数値表_段0-2_v1.md（フル物理移動）**：§0.2の品目数を「段0＝21→38」「段1＝67→50」に更新し、確定#257の全17品目リストを明記する説明段落を新設。§1.1（拳銃）に散弾銃（HAGANAH/SINAI）・小銃系（KVUTZA/SHTETL）・火炎放射器（NER TAMID）の全データ表（①基本諸元＋②射撃特性＋命中率）を§2側から数値そのまま複写して新設。§1.2（近接・道具）にHAVDALAH/ZIONの近接データ行、および新設の投擲サブテーブル（CHUTZPAH/SHALVA）を追加。§1.3（アパレル）にGALUTH／BRIT／MEZUZAH／DANIEL／ARON／YESHIVAの防具データ行、MASADA（シールドベルト）の個別記述を追加——ただしこれら6品目は元々段1アンカー（KIBBUTZ Medium基準）前提の数値のため段0アンカー（SABRA基準）と比べ防御力が高めである点を注記し、段0内での整合性再調整はPhase9の課題として明記。§1.4（非戦闘消耗品）にPURIMの記述を追加。§2側は該当17品目のデータ行をすべて削除（§2.1散弾銃はPALMACHのみ残置、§2.2小銃系はTORAH以下7種のみ残置、§2.6擲弾類からPURIM削除、§2.7からNER TAMID/HAVDALAH/ZION/CHUTZPAH/SHALVAを削除しLILITH/TIKKUNのみ残置、§2.8アパレルから該当6品目+MASADAを削除）。§2ヘッダーの品目数を67→50に更新。§2.11（Stopping Power）・§2.12（痛みなし化）・§2.13（Damage/AP整合）の対象品目列挙を段0/段1に正しく分割。§2.16（marketValue表）の該当行のカテゴリラベルを「段1」→「段0」に更新（marketValue数値自体は変更なし）。

**バランス基準書v1§3.6.7**：「段1小銃系列（§2.2該当）」という表現をKVUTZA/SHTETLの移動に合わせて「小銃系列（TORAH等は§2.2、KVUTZA/SHTETLは確定#257で段0へ移動済み・§1.1該当）」に修正し、Range設計ロジック・確定値自体（TORAH33／NEHEMIAH34／KVUTZA38／GIBOR39／SARID40／SHTETL41／EZRA42）には変更がない旨を明記。

数値（Damage/AP/Range/Mass/Warmup/Cooldown/Accuracy/costList/marketValue等）は全品目・全項目で一切変更していない——今回の変更はカタログ上の段区分（研究ゲート・文書内の掲載節）のみである。

---

## 関連項目

- 上位索引: [decisions](/decisions/index.md)
- 同じ出典の前項: [確定#256：装備段1・段2の解禁研究をそれぞれ「Diaspora Tech company」「旧式装備」として新設・分離](/decisions/decision-0256.md)
- 同じ出典の次項: [確定#258：CoreMOD資料v1§4.3・無制限スタック特性に整数上限式を新設](/decisions/decision-0258.md)
- 正史: [正史](/world/index.md)

## 出典

- シオン/Shion プロジェクト改訂履歴ログ（退役済み原本: `retired-source://project/シオンShion_改訂履歴ログ_v1.md`） — `確定#257`
