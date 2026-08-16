# RIM Codex運用構成

RIMでは、作業の規模と危険度に応じてCodexの担当を分けます。通常の依頼文だけでよく、専用の接頭辞は不要です。

## GUI harness

`Tools/RimDevHarness/`は、この運用構成をRimWorld MOD開発向けのノードGUIとして実行・観測するローカルharnessです。公式`codex app-server`へstdio JSONLで接続し、Sol計画、計画承認、Luna実装、検証、Sol独立レビュー、修正範囲承認、Luna修正、最終検証、GitHub同期証拠を別々のnodeとして管理します。

GUIのturn完了は検証PASSを意味しません。agent turnの終了後は人間の承認または証拠付き検証で停止し、command/fileの権限要求も別の承認欄へ表示します。GUI内のChatは同じphase threadへの質問・追加入力に使えますが、現在のCodex Desktop taskとは別threadであり、承認や検証を自動通過しません。起動、操作、保存場所、fakeと実接続の検証境界は[MOD開発GUI harness](RIM-DEV-HARNESS.md)を参照してください。

## 担当

- `rim_planner`: Sol。既定では読取専用で、正本、影響範囲、完了条件、調査条件、停止条件、検証手順を決めます。
- `rim_worker`: Luna。計画で指定された範囲だけを編集する唯一の書込み担当です。
- `rim_domain_writer`: Luna。大規模時に、自分へ排他的に割り当てられた一領域だけを並行編集します。同じagentを領域ごとに複数起動できます。
- `rim_integrator`: Sol。領域間で共通する概念、相互関係、リンク、生成物、全体検証を一人で統合します。
- `rim_reviewer`: Sol。既定では読取専用で、差分、回帰、検証証拠、未検証事項を審査します。
- メイン担当: 依頼の解釈、役割の選択、ユーザーへの報告、必要な判断の確認を担当します。

plannerとreviewerのread-onlyは設定上の既定であり、絶対的な権限境界ではありません。親ターンで権限を変更すると、そのlive overrideが子へ優先される場合があります。強制的な隔離が必要なレビューは、親ターン自体をread-onlyにして開始します。

## 基本フロー

1. 小さな説明、調査、明白な単一ファイル修正はメイン担当だけで処理します。
2. 標準作業では、危険を実際に減らす担当だけを1〜2体使います。
3. 単一領域の複雑な作業は、`rim_planner`、`rim_worker`、`rim_reviewer`の順に進めます。plannerは複雑な実装をLuna向けの狭く検証可能な単位へ分割します。安全に分割できない実装は、メイン担当が保持するか、明示的に上位モデルへ切り替えます。
4. 複数領域に明確な正本境界がある大規模作業は、下記のcross-domain flowを使用します。
5. レビューで阻害事項が見つかった場合は、修正範囲を限定してLunaへ戻し、必要な箇所だけ再確認します。

## 大規模cross-domain flow

例えばシオン固有の改稿とカエラヴィ固有の改稿は並行できます。一方、両者の同盟関係、共通世界史、人物権、戦争、技術移転などを同じ依頼で変更する場合、その共有正本を二人が同時編集してはいけません。

1. `rim_planner`が開始時の`HEAD`とdirty pathを確認し、編集する各ファイルと各`canonical_owner`を一人の担当へ割り当てます。既に変更済みのファイルを担当させる場合は、受け入れる既存変更を明記します。
2. 全domain writerと`rim_integrator`の初回turnをclaim-only waveとして先に実行します。担当path、canonical owner、baselineのstatusとfingerprintを記録して、編集せずに返ります。
3. メイン担当が`Scripts/Test-AgentCoordinationClaims.ps1`で完全なclaim集合の重複とbaselineを審査し、合格後だけ`claim-accepted` follow-upを送ります。この段階ではdomain writerだけを再開します。
4. シオン担当とカエラヴィ担当など、複数の`rim_domain_writer`が排他的な正本だけを並行編集します。共有発見、競合、引継ぎが生じたwriterはeventを記録して一度返り、メイン担当が影響先へ転送してfollow-upで再開します。
5. 全domain writerの引継ぎ後、メイン担当が`-FingerprintAgentIds`でintegratorの担当pathにdriftがないことを再検査し、先にclaim承認済みの`rim_integrator`を再開します。integratorは共有正本、相互リンク、生成navigationを一人で更新し、全検証と監査を実行します。
6. `rim_reviewer`が全差分を一体として審査します。各領域の個別合格だけでは完了にしません。

同時書込みを許可する条件は、ファイルと正本の所有権が重ならないことです。同じファイル、同じ`canonical_owner`、同じ共有関係へ二人が触れる場合は並列化せず、`rim_integrator`へ集約します。

## DOMAIN_UPDATE

情報共有は定期heartbeatではなく、意味のある状態変化で発火します。これによりtoken消費と待ち時間を抑えます。

```yaml
event: claim | shared-discovery | conflict | handoff | integration-handoff
coordination_run_id: task-scoped-id
agent_id: writer-label
domain: Shion | Caelavi | shared | other
owned_paths: []
owned_canonical_owners: []
accepted_dirty_paths: []
changed_facts: []
shared_owners: []
affected_domains: []
dependencies: []
evidence_paths: []
decision_needed: null
summary: concise current state
```

`claim`記録には`baseline_head`とpathごとのstatus、HEAD blob、作業tree SHA-256が自動で加わります。既存dirty pathは`accepted_dirty_paths`に明記されていない限り拒否されます。これにより、並行作業前から存在したユーザー変更とagentの新規変更を区別します。

各project agentではmulti-agent toolsを無効化しているため、writer間の直接通信には依存しません。メイン担当は返却された更新を影響先へ転送し、follow-up taskで再開します。同時に`Scripts/Write-AgentCoordinationEvent.ps1`で`.git-sync/coordination/<run_id>/`へ保存します。この台帳は障害復旧と最終レビュー用の運用状態であり、正典でもGitHub公開対象でもありません。heartbeatや定期pollingは行いません。

## 完了・調査・停止

実装前の計画は次を明記します。

- 完了条件: 要求された状態、必要な検証、差分レビュー、未検証事項の開示。
- 調査条件: 正本の競合、外部APIや依存版の不確実性、原因不明の検証失敗、実行時証拠の不足。
- 停止条件: 新しい証拠がないまま同じ失敗が2回続く、権限や認証がない、破壊的操作が未承認、正本を確定できない、明示された予算を超える。

停止条件に達した場合、無限に修正を続けず、得られた証拠、未解決点、必要な判断を報告します。

## トークン使用

サブエージェントはそれぞれモデル処理を行うため、単独作業よりトークンを使います。そのため、小規模作業では起動せず、標準作業でも必要な役割だけを使います。正確なトークン上限はユーザーが明示した場合だけ設定し、それ以外はSmall、Standard、Complex/high-riskの作業区分で抑制します。

各project agentでは `[agents] enabled = false` とし、子がさらにサブエージェントを作る経路を設定で閉じています。メイン担当は通常writerを一人だけ使い、大規模cross-domain flowで排他的な所有権表がある場合だけ複数の`rim_domain_writer`を起動します。`max_concurrent_threads_per_session`は全体の同時数を制限しますが、所有権の重複自体はplanner、メイン調整役、最終reviewerが検査します。

GitHub checkpoint hooksはPowerShellとGitだけで動き、AIモデルを呼びません。開始時、応答終了時、セッション終了時の退避を担当しますが、検証や公開判断の代わりにはなりません。

## 構成ファイル

- `.codex/config.toml`: 同時実行上限と既定の軽量モデル。
- `.codex/agents/rim-planner.toml`: Sol計画担当。
- `.codex/agents/rim-worker.toml`: Luna実装担当。
- `.codex/agents/rim-domain-writer.toml`: 複数領域用Luna writer。
- `.codex/agents/rim-integrator.toml`: 共有概念用Sol integration writer。
- `.codex/agents/rim-reviewer.toml`: Solレビュー担当。
- `.codex/hooks.json`: GitHub checkpoint lifecycle hooks。
- `AGENTS.md`: 起動条件、停止条件、RIM固有規則。
- `Scripts/Write-AgentCoordinationEvent.ps1`: event-driven共有台帳への記録。
- `Scripts/Read-AgentCoordinationEvents.ps1`: 共有台帳の読取り。
- `Scripts/Test-AgentCoordinationClaims.ps1`: 編集開始前のclaim、baseline、path、canonical owner重複検査。

## 初回導入と変更後の再読込み

project-localな`.codex`設定は、信頼済みプロジェクトで使用します。初回cloneではプロジェクトを信頼したうえで、CLIの`/hooks`を開き、実行コマンドを確認してhookを信頼します。hookの定義が変わるとhashが変わるため、再レビューが必要です。

agentまたはconfigを変更した後は、新しいCodexセッションを開始して設定を再読込みします。開始後、必要に応じてCLIの`/agent`またはアプリのsubagent表示で、担当スレッドを確認します。
