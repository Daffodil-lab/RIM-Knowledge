---
type: "Implementation Specification"
title: "53. RimWorldログ・性能診断契約"
description: "RimWorld 1.6の不具合ログ、クラッシュログ、Performance Analyzer測定を再現可能な証拠として取得し、Shion由来の負荷と既存エラーを分離する。"
tags:
  - "shion"
  - "design"
  - "implementation"
  - "diagnostics"
  - "performance"
  - "logging"
  - "rimworld"
status: stable
authority: canonical
knowledge_role: source-of-truth
granularity: concept
canonical_for: "design/rimworld-log-performance-diagnostics"
canonical_scope: "product-verification"
normative_basis:
  - "/design/23-パフォーマンス方針.md"
  - "/design/52-バニラ優先Shion種族実装境界.md"
generated:
  by: "process:user-decision"
  at: "2026-07-30"
sources:
  - id: "log-publisher-workshop"
    resource: "https://steamcommunity.com/sharedfiles/filedetails/?id=2873415404"
    title: "Log Publisher from HugsLib"
---

# 53. RimWorldログ・性能診断契約

Shionの不具合、クラッシュ、速度低下、停止、スパイクは、再現直後のログと、対象状態を再現中に取得した計測結果で判定する。起動直後だけのログ、問題を再現していない測定、表示領域を切り取ったAnalyzer画像は受入証拠にしない。

## 標準ログ取得

通常のエラー報告は、単体版[Log Publisher from HugsLib](https://steamcommunity.com/sharedfiles/filedetails/?id=2873415404)を標準発行器として使用する。このMODはLog Publisherだけを含み、単体またはHugsLibと同時に使用できる。

1. 対象エラーをゲーム内で再現する。
2. 再現直後に`Ctrl+F12`またはログ画面の緑色`Share`を実行する。
3. 生成された共有リンクへ、再現操作、発生時刻、使用セーブ、表示された症状を添える。
4. アップロードに失敗した場合は`Ctrl+Alt+F12`でログをクリップボードへ取得し、UTF-8テキストへ貼り付けて保存する。
5. ゲーム自体がクラッシュした場合は、共有ログに加えて`%USERPROFILE%\AppData\LocalLow\Ludeon Studios\RimWorld by Ludeon Studios\Player.log`を取得する。

HugsLib本体を別MODが必要とする場合も、Shionの標準発行手順は単体版Log Publisherへ統一する。OSまたはデスクトップ環境が`Ctrl+F12`を奪う場合は、そのショートカットを解除するかログ画面の`Share`を使用する。

大量エラーでログ上限へ到達すると、それ以降の重要なエラーが記録されない。エラー反復を確認した時点で再現を止め、ログを保存する。既に飽和したログは、原因候補を修正してゲームを再起動し、同じ操作を短時間で再現して取り直す。

## Analyzer測定手順

Performance Analyzerは一度に一つの領域だけを計測する。タブを開くか変更すると測定値がリセットされるため、各画面で対象状態を再現する。

1. 平常状態のセーブ、MOD一覧、ゲーム速度、Pawn数、Map数、開いているUIを記録する。
2. 調べる領域のタブを開き、対象の遅延またはスパイクを再現する。
3. 初期値の変動が落ち着くまで測定し、最大2000測定のローリング平均として読む。
4. ゲームを止めて値を読む場合は、ゲームを一時停止する前にAnalyzer左上のProfiler一時停止を押す。ゲーム一時停止中もframe描画は続く。
5. タブ、列見出し、FPS/TPS、選択行、詳細パネルを含む画面全体を保存する。

列は次の意味で読む。

| 列 | 判定 |
|---|---|
| `Average Per Frame/Tick` | 1 frameまたはtick当たりの平均占有時間 |
| `Max For Frame/Tick` | 一度に発生した最大停止時間。スパイクとフリーズを追う |
| `Calls` | 測定中の総呼出し数 |
| `Av Per Call` | 1回当たりの平均時間。高価な単発処理を追う |
| `Percent` | 測定対象frameまたはtickに占める比率 |
| `Total` | 測定期間全体の占有時間 |
| `Av Calls Per Frame/Tick` | frameまたはtick当たりの呼出し頻度 |
| `Name` | 計測されたメソッド |

高い呼出し数が主因の場合は対象行を選択し、`Stacktrace`を有効化する。約1000件を目安に採取後、無効化してから`Change`で呼出し元を切り替え、右上の割合と最上位の呼出し経路を記録する。1回当たり時間が主因の場合は右クリックの`Profile internal`で内部処理へ進む。

停止とスパイクは`Average`ではなく`Max`を入口にし、新しい画面へ進むたびに同じ停止が発生するまで待つ。2秒停止は約`2000ms`として現れる。

## 診断の分岐

- `HarmonyMod.Environment_GetStackTrace`が現れた場合は、警告またはエラー出力の処理負荷として扱い、性能調整より先にログの原因を修正する。
- `JobDriver`、`JobGiver`、`WorkGiver`は、Pawnが実行中の仕事と常時探索する仕事候補を分けて調べる。
- Game、World、Map、Thingの各Componentは、対応するTick、Update、OnGUIタブで所有MODと呼出し頻度を確認する。
- Harmony prefix、postfix、transpilerは、`Harmony Patches`、`Harmony Transpilers`、`Harmony Transpiled Methods`を分けて測る。
- 独自種族の外見は`Pawn Renderer`、`Draw Dynamic Things`、`UI Root OnGUI`、Portraitを、身体処理は`Pawn Tick`、`Needs`、`Thing Comps`を測る。
- 画面外Pawnは`World Tick`の`WorldPawnTick`、World上の拠点、キャラバン、サイトは`WorldObjectHolderTick`を測る。

満杯の保管、搬送指定の過多、待機Pawn、経路を塞がれたPawn、開閉の多いドア、飢餓、無限半径または大量素材許可のBill、開いたままの重いUIは、MOD固有処理と分離して再現する。

## 測定限界

Analyzerの最小有効測定値は環境依存で約`0.03μs`、計測patch自体の外部負荷は約`0.07μs`を目安とする。入れ子に計測したメソッドは同じ処理時間を複数階層で数え、計測patchの負荷も親側に現れる。完全Assemblyの一括profile結果を単純加算せず、差分、呼出し経路、再現条件を合わせて判断する。

## 受入証拠

性能修正は次を一組で保存する。

1. RimWorld、DLC、Shion、依存MODの版と完全な有効MOD一覧
2. 問題再現直後の共有ログまたはテキストログ
3. クラッシュ時の`Player.log`
4. 比較前後で同一のセーブ、ゲーム速度、Pawn数、Map数、UI状態
5. Analyzerの対象タブ、測定時間、主要行、Average、Max、Calls、Av Per Call
6. 高頻度処理の主要Stacktraceまたは高価な処理のProfile internal
7. タブ名、列、FPS/TPS、詳細パネルを含む未トリミング画像

## 関連項目

- 上位索引: [全体設計](/design/index.md)
- 性能方針: [パフォーマンス方針](/design/23-パフォーマンス方針.md)
- 種族実装: [バニラ優先Shion種族実装境界](/design/52-バニラ優先Shion種族実装境界.md)
- 外部実装参照: [Vivi Raceの非HAR種族実装パターン](/research/reference-mods/10-Vivi-Race非HAR種族実装パターン.md)
