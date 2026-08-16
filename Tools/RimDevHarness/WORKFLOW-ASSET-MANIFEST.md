# Workflow asset migration manifest

- Destination branch: `codex/rim-dev-harness`
- Baseline: `origin/main` at `399696c`
- Source worktree: `C:\Users\sputn\Claude\Projects\RIM`
- Acceptance: the main coordinator explicitly accepted only the files listed below for exact mechanical migration on 2026-08-16.
- Excluded: `AGENTS.md`, `knowledge/**`, generated navigation, MOD source, and every other dirty path in the source worktree.

| Destination path | Accepted source SHA-256 |
|---|---|
| `.gitignore` | `b56cb827fbc5f836b11c554d255fa98ee1f2897a257af6dbe2e45c26a6e212ff` |
| `.codex/config.toml` | `d049e237b69707855d098687cbf3b1a1ee1a1282cc61df01fb85f86561eff033` |
| `.codex/agents/rim-planner.toml` | `bf721ef0e1ae9539e7ae879edb296599437b339764ed80b4ae98dd78009069e3` |
| `.codex/agents/rim-worker.toml` | `e8da39fe744bc63d5e620c5d6fe5bd1c2d13701728636975874a8054e504cb0b` |
| `.codex/agents/rim-reviewer.toml` | `8a20a06bb7ff84717303ec01e472413a0512f27f3ffd891cff6de8bf24a28333` |
| `.codex/agents/rim-domain-writer.toml` | `7ec7ca9e6d3e072029c9171b436a3d30f975e5874279e401ec59770f13c28cad` |
| `.codex/agents/rim-integrator.toml` | `0336735959be448bab4da35667ce84b6852bf0a529e2ba06b00b6d417293c70f` |
| `.codex/hooks.json` | `dc038e34ff82b1ac44e4ab16e4036fa881e27a8859d172507df66060944bbe27` |
| `Scripts/Test-AgentCoordinationClaims.ps1` | `0cd4c95c12738aa98ccb55765fec6cfd8d8fe528cb28d57628c7ee41d7c698e0` |
| `Scripts/Write-AgentCoordinationEvent.ps1` | `620c334a9561298ae7bfb2a5d73dc338253425b2f7a80d204a46b5f89b85ab71` |
| `Scripts/Read-AgentCoordinationEvents.ps1` | `06df5abc6a60e06b85b0becf9a1b7e37d2e5c5a5751eb70ce3522e251af31f06` |
| `Scripts/Sync-GitHubCheckpoint.ps1` | `32f161eaf0768f250f842fdbcc95ee6f482fd32dd1dac2c537fc92bbbdead5f4` |
| `Scripts/Invoke-GitHubSyncHook.ps1` | `95ee9bd9b9151cfb25527b2a8e233a13c02a0d831c018dd49010b1c39a05080b` |
| `Scripts/Install-GitHubSyncTask.ps1` | `54ca6f1db73787db7b05fb16f17c0a48a21d9a18b2e704d75a5b859a4f3d69a9` |
| `Scripts/GitHub常時同期.md` | `433ed7266874d19bf0af7f5c296f01c24086b0d09537c6bdee182e9d0eca8571` |
| `docs/CODEX-WORKFLOW.md` | `74ce226396bf1abad6e8400f9f2009ac98996fb732c8836b855afc5afb6be234` before the harness link was added |

The accepted `.gitignore` source differs from `origin/main` only by the `/.git-sync/` rule shown in the staged diff.
