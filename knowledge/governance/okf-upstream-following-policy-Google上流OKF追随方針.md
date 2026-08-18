---
type: "Governance Rule"
title: "Google上流OKF追随方針"
description: "GoogleCloudPlatform/knowledge-catalogのOKF規範とVisualize参照実装を確認し、RIM固有拡張をRIM側で所有する追随手順を定める。"
tags:
  - "okf"
  - "governance"
  - "research"
  - "verification"
status: stable
authority: canonical
knowledge_role: governance
granularity: requirement
canonical_for: "governance/okf-upstream-following-policy"
canonical_scope: "okf-governance"
source_section: "GoogleCloudPlatform/knowledge-catalog okf/SPEC.md and reference viewer"
generated:
  by: "process:codex-okf-upstream-following-policy"
  at: "2026-08-17T00:00:00Z"
  precision: "date"
sources:
  - id: "official-okf-v02-pinned"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/fe3268a70e8ca5110a43a8f1dfdf6d1a458cf79f/okf/SPEC.md"
    title: "Open Knowledge Format (OKF) Version 0.2"
  - id: "official-okf-reference-viewer"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/fe3268a70e8ca5110a43a8f1dfdf6d1a458cf79f/okf/src/reference_agent/viewer"
    title: "OKF reference Visualize viewer"
  - id: "official-okf-reference-cli"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/fe3268a70e8ca5110a43a8f1dfdf6d1a458cf79f/okf/src/reference_agent/cli.py"
    title: "OKF reference CLI"
  - id: "official-license"
    resource: "https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/fe3268a70e8ca5110a43a8f1dfdf6d1a458cf79f/LICENSE.md"
    title: "Apache License 2.0"
---

# Google上流OKF追随方針

RIM-Knowledgeは、`GoogleCloudPlatform/knowledge-catalog`の固定した`okf/SPEC.md`をOKF 0.2の上流規範として参照する。上流の`okf/src/reference_agent/viewer`と`okf/src/reference_agent/cli.py`は、概念を可視化・消費するVisualize（consumer PoC）の参照実装として扱う。

RIM側のcanonical world/design/knowledge ownerと、`canonical_for`、`canonical_owner`、`knowledge_role`、`authority`などのRIM拡張はRIM-Knowledgeが所有する。上流規範や参照実装は、RIM固有の正本所有や世界設定を置き換えない。Visualizeの存在や挙動はOKF 0.2の必須適合条件ではない。

毎週、`knowledge/tools/okf-upstream.json`の固定コミットと上流`main`のコミットをread-onlyで照合する。差分または取得失敗を検出した場合、更新は人のレビューで上流仕様、参照実装、ライセンス、RIM拡張への影響を確認した後に行う。自動更新、自動コミット、自動取り込みは行わない。

上流のsamples、agent、Dataplex、BigQueryのコードはRIM正本へ自動取り込まない。RIM-nativeのVisualizeツールは、上流viewerの挙動を参考にしつつ、RIMのOKF bundleと所有境界に合わせて独立実装する。

## 関連項目

- OKF解説: [Open Knowledge Format 0.2 日本語規範解説](/research/okf/00-Open-Knowledge-Format-v0.2-日本語解説.md)
- 保守ツール: [OKF保守ツール](/tools/index.md)
- 権威判定: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle-知識の権威順位とライフサイクル.md)
