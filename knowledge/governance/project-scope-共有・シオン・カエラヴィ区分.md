---
type: "Governance Rule"
title: "共有・シオン・カエラヴィ区分"
description: "概念を共有、シオン、カエラヴィのいずれか一つの所属MOD区分へ解決し、所属MODから探す派生索引を安定して生成する。"
tags:
  - "okf"
  - "governance"
  - "authoring"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/project-scope"
canonical_scope: "okf-governance"
source_section: "共有・シオン・カエラヴィ区分"
generated:
  by: "process:project-scope-navigation"
  at: "2026-08-16T00:00:00Z"
---

# 所属MOD区分（共有・シオン・カエラヴィ）

`project_scope`は、知識上の所属MODを閲覧・整理するための派生区分である。値は`shared`（共有）、`shion`（シオン）、`caelavi`（カエラヴィ）のいずれか一つとし、`tags`、`authority`、`status`、`knowledge_role`、`canonical_for`とは独立して扱う。この区分はpackageId、実際のロード所有、依存関係を確定しない。

## 解決規則

保守ツールは、完全一致のoverride、明示された`project_scope`、安定した相対パス・タイトル・荷札にある両陣営の明示シグナル、カエラヴィのシグナル、シオンのシグナル、共有領域の順に判定する。両陣営の明示シグナルが併存する概念は`shared`へ解決する。本文やdescriptionにある相手への単なる言及は所属を変更せず、双方の接続を所有する概念だけをoverrideで共有へ固定する。

共有領域にはガバナンス、一般authoring、矛盾監査、決定履歴、固有シグナルを持たない共通研究・世界観・設計を含める。シオン領域にはKombinat、Pawn、独立開拓団、人物、プレイヤー向け運用、ロードマップとその固有荷札を含める。カエラヴィ領域にはCaelavi・Caelumの固有シグナルを含める。

## 正本と生成

区分の正本はこの規則、resolver、override台帳である。`knowledge/navigation/project-scope/`は生成物であり手編集しない。概念の物理パス、本文、権威、状態、正本所有者は区分付与のために変更しない。

## 関連項目

- メタデータ契約: [RIM OKFメタデータ契約](/governance/metadata-contract-メタデータ契約.md)
- 所有者規則: [知識所有者マップ](/governance/ownership-map-知識所有者マップ.md)
- 派生索引: [横断ナビゲーション](/navigation/index.md)
- 保守ツール: [OKF保守ツール](/tools/index.md)
