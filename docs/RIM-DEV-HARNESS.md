# RIM MOD開発GUI harness

## 1分要約

`Tools/RimDevHarness/`は、RimWorld MOD開発を「目的」「Sol計画」「人間承認」「Luna実装」「検証」「Sol独立レビュー」「修正範囲承認」「Luna修正」「最終検証」「GitHub同期」のnodeに分けて実行・観測するローカルGUIです。OpenAI公式の`codex app-server`を子processとして直接起動し、stdio JSONLのthread、turn、approval、review、goal、token eventをGUIへ反映します。

agentのturn終了は検証PASSではありません。検証結果には人間が証拠を入力し、計画承認、修正範囲承認、Codexのcommand/file承認も別々に操作します。GUIの公開node自身はcommit、公開branchへのpush、PR作成を自動承認しません。projectのcheckpoint hookが有効な環境では、別系統の復旧branchへのtoken-free checkpointが起動しますが、これは公開完了証拠ではありません。

## 起動

前提はNode.js 18以降、Codex CLI、Git worktreeです。Windowsではnpm packageに同梱されたnative `codex.exe`を探索して直接spawnします。`.cmd`やPowerShellをJSONL transportのwrapperにはしません。

最短の起動方法はrepository直下の`RimDevHarness.cmd`をダブルクリックすることです。hidden background serverを開始して既定ブラウザーを開き、GUIは表示後にCodexへ自動接続します。二重クリックや再実行では`.git-sync/harness/launcher/current.json`のPIDとlocalhost healthを検査して既存GUIを開き、serverを重複起動しません。終了は`Stop-RimDevHarness.cmd`をダブルクリックします。自動接続は無限に繰り返さず3回で止まり、失敗時はheaderの`Codex再接続`から明示的に再試行できます。

foregroundで起動する場合:

```powershell
cd Tools/RimDevHarness
node server.mjs
```

表示された`url`をブラウザーで開きます。ブラウザーも自動で開く場合:

```powershell
& Tools/RimDevHarness/Start-RimDevHarness.ps1 -OpenBrowser
```

`-OpenBrowser`はNodeをhidden background processとして起動し、PID、URL、停止コマンドを表示します。session tokenは起動URLのfragmentで一度だけ渡し、GUIが`sessionStorage`へ移した直後にaddress barから削除します。

ブラウザーを開かずbackground起動だけを検証する場合は`-Background`、保存済みPID、server生成instance ID、localhost healthがすべて一致するinstanceを停止する場合は`-Stop`を使用します。停止はOSのPID強制終了ではなく、保存済みsession token付きのserver-owned shutdown endpointへ依頼します。PIDが別processへ再利用されている場合、そのprocessを停止しません。

## 入力

- 目的: 一件のMOD開発目的。
- 完了条件: build、test、game-loadable、scenario/runtime evidenceなど、完了判定に必要な条件。
- 調査条件: version差異、正本競合、runtime evidence不足など、Solへ戻す条件。
- 停止条件: 同一失敗2回、未承認の破壊操作、権限不足など、無限修正を止める条件。
- agent phaseごとのgoal token budget: 任意。空欄なら`thread/goal/set`へ送信しません。入力した場合だけ正の整数として、planner、worker、repairそれぞれのgoalへ設定します。headerのTokensは全agent nodeの累計です。

## 主フロー

1. GUI表示時にCodex接続が自動実行され、`initialize`、`initialized`、`model/list`を行います。
2. runを作成し、条件を`.git-sync/harness/current.json`とrun別JSONへ保存します。
3. `Solで計画開始`がread-onlyの`gpt-5.6-sol` / high threadを作成します。
4. goalが`active`の間はApp Serverが作る継続turnを同じphaseへ対応付け、goalが`complete`になった最終turn後にだけ計画の人間承認で停止します。
5. 計画承認後、`gpt-5.6-luna` / medium / workspace-writeで実装します。
6. Luna turn完了後もPASSにはせず、証拠付き検証で停止します。
7. PASS後、別のread-only Sol threadから`review/start`を実行します。
8. 人間がレビューを読んで修正範囲を限定し、Lunaはその範囲だけを修正します。
9. 最終検証PASS後、remote SHA、Draft PR、Actions結果などの同期証拠を記録します。

`現在turnを停止`はgoalを先に`paused`へ変更して自動継続を止め、streamで観測した現在の実turn IDへ`turn/interrupt`を送ります。検証結果の`調査へ`と`停止`はnodeを明示状態にし、勝手に次のagentへ進めません。

## Codex Chat

workspace下部の`Codex Chat`は、各phaseの送信prompt、ユーザーの追加入力、Codexのstream/final応答、command/file/approvalの限定されたlifecycle要約を時系列表示します。tool出力本文、file本文、unified diffはchatへ複製しません。履歴はrun stateへ保存しますが、最大200件、message 32 KiB、tool要約4 KiBへ制限します。

- planner、worker、repairのturn実行中: 観測済みの正確なturn IDを`expectedTurnId`にして`turn/steer`します。
- 計画承認、実装検証、修正範囲承認、最終検証の待機中: 直前phaseの同じthreadへ一時的な`turn/start`を送り、回答後は元のgate、waiting state、正本outputをそのまま復元します。
- goalがactiveのままturn間にある場合: 次turnを待つよう表示し、重複送信しません。
- 独立レビューturn実行中、Codexの権限要求中: chat送信を拒否します。

Chatは計画承認、修正範囲承認、検証PASS、公開証拠を自動入力・自動承認しません。また、Harnessが起動したApp Serverのphase threadであり、現在開いているCodex Desktop taskの会話とは同期しません。この境界はGUI内にも常時表示します。

## 承認境界

内部workflow承認とApp Serverの権限承認は別です。

- Human approval: Solの計画、レビュー後の修正範囲。
- Codex approval: command/fileのmethod、command、cwd、reason、request ID。`accept`、`decline`、`cancel`を明示送信します。

file承認はpathとchange種別、`grantRoot`を表示し、command承認は追加permission、exec/network policy提案、利用可能decisionも表示します。file本文やunified diff全体は承認欄へ複製しません。`キャンセルしてturn停止`は`cancel`回答だけで終わらず、goal pauseと現在turnのinterruptまで実行します。

session tokenがないmutation、foreign Origin、localhost以外のHost、64 KiBを超えるJSON、未知actionは拒否します。任意のRPC methodや任意のshell stringをHTTPへ公開しません。

## コードマップ

- `server.mjs`: localhost HTTP/SSE、session保護、strict action API、agent orchestration、static asset配信。
- `lib/app-server-client.mjs`: native Codex探索、stdio JSONL、request router、approval response、stderr ring、graceful stop。
- `lib/workflow.mjs`: node定義、state gate、prompt、token normalization、人間承認、検証・公開記録。
- `lib/run-store.mjs`: repository内state、write queue、Windows向けbackup置換、復旧。
- `public/`: dark node graph、Codex Chat、inspector、検証、二種類の承認、review、event表示。
- `test/fixtures/fake-app-server.mjs`: tokenを消費しないprotocol fixture。
- `test/*.test.mjs`: protocol、HTTP/security、state machine、render安全性。
- `scripts/live-review-smoke.mjs`: 明示実行時だけ未commit差分をread-only `review/start`へ渡し、直後にinterruptするlive protocol smoke。
- `scripts/live-chat-smoke.mjs`: 同じread-only App Server threadで2回の短い会話を行い、delta、final、same-thread follow-upを確認するlive protocol smoke。

## 失敗時の動作

- CLIまたはmodelが見つからない: 代替modelへ黙って切り替えず、409/error bannerで停止します。
- malformed/unknown event: processを落とさず、bounded eventとして保持・表示します。
- child exit/request timeout: pending requestをrejectし、接続chipをofflineへ戻します。live runは`stopped`へ安全復旧し、終了したchild/reader参照を破棄するため、同じharness processから`Codex接続`を再実行できます。
- state保存競合: 一つのwrite queueへ直列化し、既存JSONを`.bak`へ退避してから置換します。起動時は`current.json`が欠けていればbackupを読みます。
- harness再起動: 保存されたphaseが`running`または権限待ちなら、再接続で勝手に継続せず`stopped`へ安全復旧します。保存済みrunを残したまま`新規run`を作れます。
- run置換: agent turnまたはApp Server承認がliveなら新規run作成を409で拒否します。完了後に置換した場合も、旧threadの遅延eventは新runへ適用しません。
- turn完了: 検証済みにせず、次の人間gateをwaitingにします。
- approval: request IDが一致しない回答を拒否します。
- partial start: `turn/start` responseが失敗してもstreamで実turn IDを観測済みなら、run置換を拒否したまま停止buttonを有効にし、goal pause＋interruptで回収できます。
- approval transport: responseをApp Serverへ書けた後だけwaiting stateを解除し、書込み失敗時は同じrequest IDで再試行できます。
- event stream: token、goal、turn、hookなどのlifecycle証拠をEventsへ残します。agent message deltaはノイズの多いEvents欄からは除外し、bounded Chat履歴へ統合して保存します。GUI用SSEが一時切断しても、それだけでApp Serverを未接続とは表示しません。

## 検証

```powershell
npm --prefix Tools/RimDevHarness test
node --check Tools/RimDevHarness/server.mjs
node --check Tools/RimDevHarness/public/app.mjs
git diff --check
```

fake fixtureはhandshake、real-shape token、malformed/unknown event、process exitと再接続、command/file approval表示、approval transport再試行、cancel＋interrupt、goalの複数turn対応、partial start回収、interrupt response/event race、旧thread隔離、再起動時の安全復旧、分割UTF-8 body、state gate、HTTP auth/CSP/body limit、Windows同時保存を再現します。

実App Serverでchat transportを明示確認する場合:

```powershell
npm --prefix Tools/RimDevHarness run test:live-chat
```

これはread-only threadへ固定markerを2回送るprotocol smokeです。RimWorld本体やMOD runtimeは起動しません。

2026-08-16の実接続では、Codex CLI 0.147.0に対して`initialize`、`model/list`、`thread/start`、`thread/goal/set`、`thread/goal/get`、`turn/start`、`thread/tokenUsage/updated`を確認しました。継続goalではresponseのturn IDとstreamの実turn IDが異なることを検出して対応し、停止操作後に`goal.status=paused`、`turn.status=interrupted`、node=`stopped`、`activeTurnId=null`、unknown event 0件で保存されることを再確認しました。別の完了runではGUIが101,262 tokensまでリアルタイム表示しました。これらはread-only plan smokeであり、MODのgame runtime証拠ではありません。初回実接続で発見したWindows rename競合は、直列write queueとbackup置換へ修正し、同時保存テストを追加しました。

実`review/start` smokeは未commit差分をmodel serviceへ送る操作として実行環境に拒否されたため、迂回実行していません。fake App Serverでは`target=uncommittedChanges` / `delivery=inline`のrequest契約を検証済みです。利用者が差分送信を明示許可した環境では次を実行できます。

```powershell
npm --prefix Tools/RimDevHarness run test:live-review
```

## 既知の未検証事項

- RimWorld本体を起動したscenario/runtime smokeは、このGUI harnessの起動確認とは別です。
- 実roomで発生する全種類のMCP、network policy、experimental approval payloadは未網羅です。
- 実serviceの`review/start`は上記の理由で未実行です。
- GitHub同期nodeは証拠を記録しますが、pushやPRを自動実行しません。公開は既存checkpoint scriptまたは明示されたGitHub手順で行います。
- projectのcheckpoint hookが信頼済みならagent turnの開始・終了で復旧branch同期を試みます。失敗はhook event/stderrへ出ますが、公開nodeのPASSにはなりません。
- `codex app-server`のexperimental WebSocket transportは使用しません。

## 用語

- app-server: Codexのrich client向け公式JSONL interface。
- run: 一つのMOD開発目的とnode状態の集合。
- node: 計画、実装、検証、承認などの一段階。
- gate: 人間の証拠または承認がなければ通過しない境界。
- game-loadable: RimWorldがMODをloadできた証拠。
- scenario-tested: ゲーム内scenarioで期待動作まで確認した証拠。game-loadableとは別。
