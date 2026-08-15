# GitHub常時同期

この仕組みは、作業中のファイルを5分ごとにPC専用の退避ブランチへ保存する。現在のブランチ、Git index、未コミット変更には触れない。

## 動作境界

- 送信先は `codex/autosync-<PC名>`。`main`や現在の作業ブランチへ自動commitしない。
- `.gitignore`対象を除く作業ツリー全体を、一時Git indexからsnapshot化する。
- GitHub側の変更は`fetch`するが、作業中ファイルへ自動mergeしない。
- force pushを使わない。遠隔更新との競合、通信失敗、capture中の変更、秘密らしいファイルを検出した場合は停止し、次回へ回す。
- これは作業退避であり、公開版・正本化ではない。公開は通常の検証、commit、Draft PRを通す。

`origin`が公開リポジトリの場合、退避ブランチも公開される。初回送信前に、`.gitignore`対象外のプロジェクトファイルを公開してよいか人が確認する。

ログは`.git-sync/github-checkpoint.log`に記録される。このディレクトリ自体はGit対象外である。

## 手動確認

```powershell
powershell -NoProfile -File .\Scripts\Sync-GitHubCheckpoint.ps1 -DryRun
```

実際に一度送信する場合:

```powershell
powershell -NoProfile -File .\Scripts\Sync-GitHubCheckpoint.ps1
```

## 定期実行の登録と解除

タスクを登録せず、設定と安全検査だけを確認する:

```powershell
powershell -NoProfile -File .\Scripts\Install-GitHubSyncTask.ps1 -ValidateOnly
```

5分間隔で登録し、その場で初回実行する:

```powershell
powershell -NoProfile -File .\Scripts\Install-GitHubSyncTask.ps1 -IntervalMinutes 5 -StartNow
```

解除する場合:

```powershell
powershell -NoProfile -File .\Scripts\Install-GitHubSyncTask.ps1 -Uninstall
```

解除してもGitHub上の退避ブランチは削除されない。

## 復元

まずGitHub側の退避ブランチを取得する。

```powershell
git fetch origin
git log --oneline origin/codex/autosync-<PC名>
```

必要なファイルだけを復元する例:

```powershell
git restore --source=origin/codex/autosync-<PC名> -- path/to/file
```

復元は現在のファイルを変更するため、対象を確認してから実行する。
