---
type: "Governance Rule"
title: "正本優先の通常参照方針"
description: "RIMの通常読み込み入口を現行正本・カタログビューへ限定し、決定履歴と調査・参照資料を履歴・補助層として扱う。"
tags:
  - "okf"
  - "governance"
  - "canonical"
  - "reading-order"
status: stable
authority: canonical
knowledge_role: governance
granularity: requirement
canonical_for: "governance/canonical-first-reading-policy"
canonical_scope: "okf-governance"
generated:
  by: "process:canonical-first-reading-policy"
  at: "2026-08-17T00:00:00Z"
  precision: "date"
---

# 正本優先の通常参照方針

RIMの通常参照層は、現行正本を一覧する`authority: canonical`と現行カタログを一覧する`authority: catalog`の両方とする。最初に[現行正本ビュー](/navigation/state/authority/canonical/)と[現行カタログビュー](/navigation/state/authority/catalog/)を別々に確認する。各事実は、まず`knowledge_role`と荷札の`canonical_owner`または`canonical_for`を解決し、その後に`authority`と`status`を適用して確認する。

## 層の扱い

- `knowledge/decisions/`は`authority: historical`かつ`status: deprecated`のリンク維持履歴層であり、決定の経緯、未解決の判断理由、移行履歴を確認するために使う。
- `knowledge/research/`は補助層であり、各ファイルの`knowledge_role`と`authority`に従って扱う。`authority: reference`は外部出典、ライセンス、固定コミットなどの証拠・来歴を保持し、`authority: protected-draft`は未確定・保護された案を保持する。research全体を現行仕様や検証根拠の所有者として扱わない。
- 現行の事実、採用済みの構造、状態、振る舞い、境界は、対応する`canonical_owner`または`canonical_for`の所有者である正本・カタログ記録で確認する。

決定・参照文書は、正本へ吸収された事実を再記述しない。正本に吸収されていない判断理由、移行履歴、外部出典、ライセンス、固定コミット、検証根拠だけを維持し、現行仕様の読み込み入口にはしない。`protected-draft`の案は未確定・保護案として扱い、現行仕様や検証根拠にはしない。

## 物理配置

この方針は通常参照経路の優先順位を定めるものであり、`decisions/`や`research/`の物理削除・一括移動を行わない。既存の概念ファイル、既存URL、小索引リンク、履歴・証拠としての来歴を保持する。

## 関連項目

- 上位索引: [RIM Project Knowledge](/index.md)
- 通常参照層: [現行正本ビュー](/navigation/state/authority/canonical/) / [現行カタログビュー](/navigation/state/authority/catalog/)
- 権威とライフサイクル: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle.md)
- 所有者判定: [知識所有者マップ](/governance/ownership-map.md)
- 正仕様記述: [現行資料の正仕様記述](/governance/positive-specification-policy.md)
- 決定履歴: [決定履歴](/decisions/)
- 調査・参照: [調査・参照](/research/)
