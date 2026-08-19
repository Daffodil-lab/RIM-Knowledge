---
type: "Implementation Specification"
title: "73. 総力進化戦争のIdeology・軍務履行ループ"
description: "総力進化戦争を、バニラIdeology、Raid軍功、帝国軍務教範、支援注文、具体的な政治前例、年次戦勝儀礼を接続する反復ゲームループとして表現する。"
tags:
  - "caelavi"
  - "caelum"
  - "design"
  - "implementation"
  - "gameplay"
  - "rimworld"
  - "performance"
  - "ui"
  - "quest"
  - "biotech"
  - "culture"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/caelavi-total-evolutionary-war-gameplay"
canonical_scope: "product-mechanics"
content_layer: "implementation"
normative_basis:
  - "/world/05-善意の非対称性.md"
  - "/world/06-人格記録-復活-同化.md"
  - "/world/59-カエルムの戦争依存経済.md"
  - "/world/63-帝国軍務教範.md"
  - "/world/68-カエルム文化産業.md"
  - "/world/69-カエルム文化後援・交易・課税原則.md"
  - "/world/71-軍務貢献認定と帰還権.md"
  - "/world/72-カエラヴィ民族主義.md"
  - "/world/73-総力進化戦争論.md"
  - "/design/23-パフォーマンス方針.md"
  - "/design/24-UIと情報予算.md"
  - "/design/59-バニラ優先カエラヴィ種族実装境界.md"
  - "/design/61-遺伝性鳥類系統の共通Xenotype契約.md"
  - "/design/65-帝国軍務教範の状態機械.md"
  - "/design/66-帝国軍務教範の一括操作境界.md"
  - "/design/68-カエルム支援注文と信用枠の状態機械.md"
  - "/design/69-カエルム軍功認定契約.md"
  - "/design/71-カエルム文化輸出カタログ.md"
  - "/design/72-買い手別文化輸出査定と源泉税.md"
generated:
  by: "process:user-decision"
  at: "2026-08-15T00:00:00Z"
  precision: "date"
---

# 73. 総力進化戦争のIdeology・軍務履行ループ

総力進化戦争は、追加のKill Needまたは常時稼働する政治Simulationではなく、RimWorld 1.6と公式DLCのRaid、Ideology、Quest、Biotech、Tale、交易、資産、心情へ、カエルム固有の意味と一括操作を接続して表現する。

## 標準Ideology構成

標準Scenarioが提供する国家公認Ideology presetは、高Impactの独自Meme `CA_Meme_TotalEvolutionaryWar`を中心に、バニラの`Loyalist`と`Collectivist`を組み合わせる。Gravship遠征Scenarioでは`Shipborn`を選択可能な追加Memeとする。このpresetはカエルム国家の支配的教義を示し、全カエラヴィの信仰を固定しない。生成Pawnは別のカエルムIdeology、地域Ideology、異論を持つIdeologyへ所属できる。

Leader、Moral Guide、儀式、服装、遺物等、指定Memeの下で成立するバニラPreceptとRoleはそのまま再利用する。Shooting、Melee、Research、Productionの専門職はバニラ側で別Memeを要求するため、標準presetが暗黙に解禁しない。v1の標準presetはこれらを必須Roleにせず、プレイヤーが対応するバニラMemeを追加した時だけバニラRoleを使う。後にカエルム固有専門職を採用する場合は、独立した`CA_Role_*`が`CA_Meme_TotalEvolutionaryWar`を要求し、互換なバニラAbilityとStat効果だけを再利用する。バニラRoleDefの`requiredMemes`を全Ideology向けに書き換えない。

身体改変、研究、軍務を評価するPreceptも、指定Memeの下で利用できるバニラDefだけを直接再利用する。別Memeへ閉じたPreceptを必要とする場合は、固有Memeへ帰属する`CA_Precept_*`として所有し、既存Preceptの世界全体の解禁条件を変更しない。

`Raider`と`Supremacist`は標準構成へ入れない。総力進化戦争は弱者略奪、奴隷化、処刑、他集団への敵意そのものを目的とせず、国家の生存、能力、動員、勝利を目的とするためである。プレイヤーは別のカエルム思想として追加できるが、それをカエラヴィ民族主義の必須条件にしない。

`PreferredXenotype`も標準構成へ入れない。カエラヴィには自然生得型、カエラヴィ改造型、同盟支援型という三つの遺伝的出自と、自然生得型を基礎にした六つの鳥類系統があるが、どれか一つの出自や三系統だけを好ましいカエラヴィとして固定しない。カエラヴィ判定はXenotype名ではなく種族ThingDef `CA_Caelavi`を用い、軍務Xenogerm、混成系統、後天的遺伝子を民族資格の喪失へ結びつけない。

Fluid Ideologyを使用する場合、個別の事件と儀式を経てMemeまたはPreceptを追加・変更できる。ただし、強硬、現実、改革の三方向を固定された技術Treeまたは一本道にせず、採用した具体的前例を別に保存する。

独自Memeは、次の三争点をEvent、Thought、Ritualへ提供する。

- 勝利なき和平を受け入れる条件
- 軍事、研究、生産、医療、教育、文化、救護を含む社会的軍務の範囲
- カエラヴィ優先、異邦人の地位、身体改変における同意の扱い

平時であるという理由だけの恒常Mood罰、異邦人を殺害、奴隷化、臓器化したことへの自動Mood報酬は追加しない。思想は具体的な事件で採用した前例と、その事件を知るPawnのMemoryとして表す。

## 争点PreceptとPawnの反応

三つの選択肢は表示上の政治Labelだけにしない。各争点は、一つを選ぶ三値のPrecept categoryとしてIdeologyへ保存する。

| Precept category | 強硬値 | 保全値 | 改革値 |
|---|---|---|---|
| `CA_RationPriority` | 現役軍務者・カエラヴィ優先 | 戦略的重要度 | 医学的緊急度 |
| `CA_GeneConsent` | 国家標準化 | 危険職務・任期限定 | 説明同意・普遍資格 |
| `CA_OutsiderStatus` | 保護補助員 | 奉仕による制限市民権 | 同じ義務に同じ市民権 |
| `CA_PeaceCondition` | 勝利・賠償まで継戦 | 安全保障条件付き講和 | 停戦・共同復旧 |
| `CA_CivilianDuty` | 強制適応 | 後方勤務 | 非軍事市民生活の承認 |
| `CA_CultureIndustry` | 文化戦線として徴用 | 輸出産業として保全 | 民間文化として自律 |
| `CA_PeaceTimeService` | 攻勢契約 | 護衛・兵站・産業契約 | 救難・探索・交易契約 |

国家公認preset `CA_Ideo_CaelumStateDefault`は、七categoryすべてで表の強硬値を選ぶ。これは生成時に値が欠落しない決定的なpresetである。別IdeologyとFluid Ideologyは各categoryを個別に保全値または改革値へ変えられ、七件を同じ列へ揃える必要はない。

Event解決時は、選んだ値と各関係PawnのIdeologyが持つ同categoryの値を比較する。v1の既定反応は次とする。

| 関係 | Mood Memory | 決定者へのOpinion | Ideology certainty | 期間 |
|---|---:|---:|---:|---:|
| 自分のPreceptと一致 | +4 | +6 | +0.02 | 5日 |
| 自分のPreceptと不一致 | -4 | -6 | -0.02 | 5日 |
| 不一致かつ自分が物資、身体、地位を直接失った | -8 | -12 | -0.04 | 10日 |

Memoryは当事者、決定へ参加した者、同じ場所で結果を直接知った者だけへ一度付与する。派閥全員、全カエラヴィ、全World Pawnへ配布しない。Opinion対象となる決定者が存在しない場合はOpinion効果を作らない。

PawnのIdeologyが対応categoryを持たない場合、またはPawnがIdeologyを持たない場合は中立とする。一致・不一致Memory、決定者Opinion、certainty変化を適用せず、`EffectDef`が定義する治療成功、物資喪失、身体改変、地位変更等の事実Memoryだけを適用する。欠落categoryを強硬、保全、改革のいずれかへ推定しない。

各EventはPrecept反応に加えて制度上の実結果を一つ以上持つ。医薬品の予約と消費、Xenogerm対象規則、Pawnの市民契約、Questの継戦または講和、工房の用途指定等である。Goodwill、資源、Faction、身体を変更する場合は、そのEvent固有`EffectDef`が変更対象、量、取消、失敗、保存を所有する。軍功、Credit、Mark、税、債務は`EffectDef`が直接書き換えず、軍功認定、支援注文、財務台帳の正規Transactionを要求し、その成立結果だけを関連づける。`EffectDef`を持たないEvent skeletonは表示しない。

## 中心ループ

```text
敵Raidの成立
  → 軍功をRaid pointsと1対1で即時認定、元本変動0
  → 帝国軍務教範が警戒を提案
  → プレイヤーが戦闘と復旧を指揮
  → 累積軍功が支援資格と軍功帰還へ近づく
  → Credit、Mark、追加債務で支援を注文
  → 装備、薬物、遺伝子、人員、物資が実ThingまたはPawnとして到着
  → 資産、補給需要、依存、人口、能力が増える
  → バニラ資産評価とQuest進行が次の大きな脅威を生む
```

Raid認定の正本は[カエルム軍功認定契約](/design/69-カエルム軍功認定契約.md)である。本仕様は別のRaid hook、撃破点、勝利判定を追加しない。Raid成立は、プレイヤーが危険を引き受けた時点で軍務を認定するが、教範を自動で`戦闘`へ移さない。許可済み設定なら`警戒`を要求でき、`戦闘`への移行と交戦終了はプレイヤーが決定する。

軍功は消費通貨にしない。支援を注文しても軍功残高は減らず、Mark元本、Credit、税、Silverへ変換されない。累積軍功は支援品目、信用枠、派遣枠、帰還資格の条件として参照できる。注文の支払と追加債務は[カエルム支援注文と信用枠の状態機械](/design/68-カエルム支援注文と信用枠の状態機械.md)だけが変更する。

支援品の到着後は、通常の武器、薬物、素材、設備、Pawnとしてバニラ資産へ入る。脅威を独自倍率で増幅せず、強い支援が資産と人口を増やして次のRaidを大きくするバニラの循環を使う。

## 戦後前例Event

戦後Eventは`復旧`中または復旧検査後に、条件を満たす候補から一件ずつ提示する。不可逆な手術、処刑、派閥変更、物資消費、和平は選択前に対象と結果を確認し、自動実行しない。

| Event | 総力進化強硬策 | 国力保全策 | 条約・改革策 |
|---|---|---|---|
| 最後の適合薬 | 現役軍務者を優先し、同条件ではカエラヴィを優先する | 現在の職務と共同体維持への重要度を優先する | 医学的緊急度だけを優先する |
| 善意ある標準化 | 全カエラヴィへ国家標準Xenogermを義務化する | 危険職務の希望者と任期中の軍人へ限定する | 説明と同意、代替措置、普遍的な利用資格を保証する |
| 異邦人補助員の宣誓 | 保護されるが非市民の補助員とする | 軍務を通じた制限市民権を与える | 同じ義務を果たした者へ同等市民権を与える |
| 勝利なき和平 | 勝利または賠償まで拒否する | 安全保障条件を得て講和する | 停戦、共同復旧、監視制度を受け入れる |
| 役割なき個人 | 教育、配置転換、身体改変で適応を強制する | 後方勤務または保護予備へ移す | 非軍事的な市民生活と任意奉仕を正式な地位として認める |
| 非軍事工房 | 文化戦線の工房として徴用する | 輸出産業として保護し国力へ還流させる | 軍務から独立した民間生活として保護する |
| 長い平和 | 新たな攻勢任務を要請する | 護衛、封鎖、兵站、産業契約へ切り替える | 救難、探索、交易、復興を軍務履行として認定する契約を求める |

各選択は善悪または強硬・改革の数値Barへ換算しない。`CaelaviPoliticalPrecedentLedger`は、次の具体的前例だけを保存する。

| Record | 保存内容 |
|---|---|
| `rationPriority` | 最後の物資を誰へ、どの規則で渡したか |
| `geneConsentRule` | 身体改変の対象、同意、任期、代替措置 |
| `outsiderStatusRule` | 補助員、契約市民、同等市民のどれを採用したか |
| `peaceCondition` | 拒否、条件講和、共同復旧のどれを前例にしたか |
| `civilianDutyRule` | 強制適応、後方勤務、任意市民奉仕のどれを認めたか |
| `cultureIndustryRule` | 徴用、輸出保護、民間保護のどれを採用したか |
| `adoptedCaseIds` | Event、対象、選択、結果、発効Tick、取消または改訂関係 |

後続Event、Quest、来訪者、派遣審査、Ideology Conversionは関連する前例だけを参照する。互いに無関係な選択を一つの政治傾向へ畳み込まず、同じ人物または共同体が事件ごとに異なる論理を選べるようにする。

一つのMapで同時に`Pending`にできる政治前例Eventは一件、同じ教範`復旧`からCommitできる政治前例Eventも一件とする。候補のPawn、物資、契約、Preceptが前回提示時から変わらない場合、閉じたEventを同じ`復旧`中に再提示しない。表にある残り六件は、各`EffectDef`と失敗結果が別途確定するまでEvent skeletonとして無効にし、最初の縦切りでは`CA_Event_LastCompatibleMedicine`だけを有効にする。

### 最初の適合薬Event

最初の縦切りでは、政治前例の入力を`CA_Event_LastCompatibleMedicine`一件に限定する。

- 認定済みRaidを起点とする教範Transactionが`復旧`へ入り、同じ`sourceServiceEventId`から未解決Eventがない時だけ候補化する。
- 同じMapに、生存し、敵対せず、直ちに通常のtendが可能な候補Pawnが二人以上おり、登録医療備蓄に使用可能な`MedicineUltratech`が候補数より少なく一個以上ある場合だけ提示する。v1は手術、慢性病の長期治療、複数薬品を要するRecipeを対象にしない。
- 候補は、未処置のtendableな重篤Hediffを持ち、現在の医療設定が`MedicineUltratech`を許可するPawnに限定する。個人軍功は存在しないため、軍功順位を作らない。
- 確認画面で優先規則、患者、医療作業可能な担当Pawn、`MedicineUltratech`一単位を選ぶ。選択は一意の`triageReservationId`を保存し、三対象、到達可能性、医療設定を実行直前に再検証する。
- 薄い`CA_Job_TriageTend`はバニラ`ReservationManager`で患者と薬一単位を予約し、通常のtend workと品質計算を使って一回だけ処置する。独自の即時治療、薬効倍率、手術Recipe、ThingOwner移送を作らない。
- 予約競合、対象死亡、離脱、薬品消失、到達不能、担当Pawnの作業不能では物資を複製または代用品へ置換せず`Suspended`にする。プレイヤーは同じ候補規則で三対象を再選択するかEventを取消せる。
- `CA_Job_TriageTend`が成功し、選択した薬一単位が処置へ実際に消費された完了通知でだけ前例と当事者MemoryをCommitする。未使用、取消、失敗は政治前例に数えない。保存時にJob結果が未確定ならロード後に自動再発令せず`再確認待ち`へ戻す。
- 一つの`sourceServiceEventId`からCommitできる同Eventは一件だけとし、別Raidまで再提示しない。

## 世界戦勝記念日

年次儀式`CA_Ritual_WorldVictoryDay`は、バニラIdeologyのRitual、参加者、部屋、音楽、演説、Tale、品質判定を再利用する。成功後、直近一年の認定Raid、死傷、救護、復旧、支援、文化制作から一つの解釈を選ぶ。

- 全てを賭けたから勝利した。
- 人口、技能、工業を守ったから勝利した。
- 個人が帰還できたから勝利に意味があった。

解釈は参加者と直接の目撃者へ期限付きMemoryを与え、全Pawnを毎Tick調査しない。儀式は直近のTaleを記念碑、彫刻、旗、家門品のArtへ関連づける。プレイヤーは記念品を保持して次回儀式の象徴にするか、真正な文化品として既存の買い手別査定で同盟へ輸出できる。輸出は儀式報酬を直接Creditへ変えず、通常の文化取引Transactionを経由する。

年次集計は儀式画面を開いた時に一年分の全履歴を走査しない。Raid認定、死亡、救護完了、復旧完了、支援到着、文化品完成の通知時に、年IDごとの件数、代表Tale ID、最終更新Tickをrolling summaryへ加える。儀式は確定済みsummaryだけを読み、欠落した履歴から結果を推測しない。

## UI

軍務画面は一つのSummaryに次を並べ、相互に換算しない。

- 現在の希望態勢、実態勢、適用進捗、手動例外
- 今回のRaid軍功と累積軍功
- `元本変動 0`と現在のMark建て元本
- Credit利用枠、Mark、未決済税、支援注文、配送待ち
- 現在有効な政治前例と、次に再審査できる条件
- 軍功帰還と完済帰還の独立進捗

戦後結果は`軍功 +X / 元本変動 0`を必ず同じ行へ表示する。支援注文は増加する債務と到着後の実物価値を確定前に表示する。政治前例は思想名だけで要約せず、`適合薬は医学的緊急度を優先`のように採用した規則を直接表示する。

## 実装境界と性能

- XMLはMeme、Precept、Ritual、Thought、Tale、Quest/Eventの静的骨格を所有する。
- 薄いC#はEvent候補の条件、前例Record、バニラ結果への接続、UI Summaryを所有する。
- Raid認定、軍務態勢、支援注文、文化査定は既存の各正本Serviceを呼び、値と状態機械を複製しない。
- `Pawn.Tick`、Need、Thought周期、Damage、Death、全Quest終了への共通Harmony patchを追加しない。
- EventはRaid認定、復旧完了、Ritual完了、Quest結果、加入、支援到着等の通知で候補化する。
- Memory付与対象は選択の当事者、参加者、直接の目撃者に限定し、全World Pawnを走査しない。
- 一回のEvent解決とRitual結果は安定IDで一度だけCommitし、保存・ロード、Letter再表示、UI再描画で物資、Thought、前例を二重付与しない。
- Ideologyが存在しないゲーム、別種族Scenario、Debt Scenarioを選ばない開始では、本ループの追加UIとEventを生成しない。
- Ideology連携を無効化または除去しても、軍功、債務、支援注文、帰還資格の正本Recordを削除または失効させない。

## 最初の縦切り

1. 既存のRaid成立認定から軍功を受け取り、教範へ`警戒を提案`する。
2. 戦闘終了後、`最後の適合薬`Eventを一件だけ提示し、選択した前例を保存する。
3. フリーカ・コーラまたは医薬品の支援注文を一件作り、Creditまたは追加Mark債務で決済する。
4. 到着した実Thingを通常資産へ加え、保存・ロード後も重複配送しない。
5. 世界戦勝記念日を一回実行し、直近のRaid Taleを記念品へ関連づける。

## 受入条件

1. Raid points 500の成立で軍功500、Mark元本変動0となり、同じRaid通知を再送しても増えない。
2. Raid成立だけでは`戦闘`へ自動移行せず、許可時の`警戒`提案だけを行う。
3. 支援注文で軍功を消費せず、Credit、Mark、追加債務のいずれを使ったかを別表示する。
4. 六つのカエラヴィ遺伝性Xenotypeと軍務Xenogermを、同じ民族資格として扱う。
5. Raider、Supremacist、PreferredXenotypeを標準思想へ要求しない。
6. 異邦人への殺害、奴隷化、臓器利用を軍功、債務控除、恒常Mood報酬へ変換しない。
7. 同じ前例EventまたはRitual結果をロード後に二重Commitしない。
8. 政治的選択を一軸の善悪または強硬度へ集約せず、具体的な前例として表示・保存する。
9. 待機中に全Pawn、全Quest、全Thingを周期走査せず、Performance Analyzerで通知処理、UI、教範Queueを別々に測定できる。
10. 同じ配薬決定について、当事者へPrecept一致、不一致、直接損失のうち一つだけを適用し、無関係な別MapのPawnへMemoryを付与しない。
11. 一つのMapで政治前例Eventを二件同時に`Pending`へせず、候補事実が変わらない同一`復旧`で閉じたEventを再提示しない。
12. 標準presetだけではMeme要件を満たさないバニラ専門職を解禁せず、別Memeまたは専用`CA_Role_*`なしに任命しない。
13. Ideology連携を外した保存でも、軍功、債務、支援注文、帰還資格が同値で復元される。

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 世界内思想: [総力進化戦争論](/world/73-総力進化戦争論.md)
- 民族主義: [カエラヴィ民族主義](/world/72-カエラヴィ民族主義.md)
- 軍務態勢: [帝国軍務教範の状態機械](/design/65-帝国軍務教範の状態機械.md)
- 一括操作境界: [帝国軍務教範の一括操作境界](/design/66-帝国軍務教範の一括操作境界.md)
- 軍功認定: [カエルム軍功認定契約](/design/69-カエルム軍功認定契約.md)
- 支援注文: [カエルム支援注文と信用枠の状態機械](/design/68-カエルム支援注文と信用枠の状態機械.md)
- 文化品: [カエルム文化輸出カタログ](/design/71-カエルム文化輸出カタログ.md)
- 買い手別査定: [買い手別文化輸出査定と源泉税](/design/72-買い手別文化輸出査定と源泉税.md)
- 制作参考: [カエラヴィ民族主義・総力戦思想の参照動画](/research/external-videos/05-カエラヴィ民族主義・総力戦思想の参照動画.md)
