---
type: "Governance Rule"
title: "オーバーホール中の矛盾判定規則"
description: "改稿差分を誤って矛盾と判定せず、現行正本の衝突だけを止めるための規則。"
tags:
  - "okf"
  - "governance"
  - "canon"
  - "overhaul"
  - "contradiction"
status: stable
authority: canonical
knowledge_role: governance
granularity: section
canonical_for: "governance/contradiction-policy"
canonical_scope: "okf-governance"
source_section: "オーバーホール中の矛盾判定規則"
generated:
  by: "process:rim-contradiction-audit"
  at: "2026-07-26"
---

# オーバーホール中の矛盾判定規則

記述が異なるだけでは矛盾としない。主題の所有者、時点、対象、断定の強さを揃えた後も、同時に真にできない二つの主張だけを矛盾とする。

## 判定順

1. `knowledge_role`と`canonical_for`から主題の所有者を確定する。
2. `authority`と`status`から、現行判断に使える記述かを確定する。
3. 世界内事実、製品要件、ゲーム上の仮置き、人物の主観を分離する。
4. 時代、地域、人物、開始条件、版の違いを分離する。
5. 残った相互排他的な主張を[矛盾監査台帳](/contradictions/index.md)へ一件一ファイルで登録する。

## 分類

| 分類 | 意味 | 扱い |
|---|---|---|
| `hard-conflict` | 現行の正本同士が同じ範囲について両立不能 | 完成を止め、所有者を一つに直す |
| `projection-drift` | プレイヤー向け投影や要約が所有者と不一致 | 投影側を直す |
| `overhaul-divergence` | 改稿候補または旧案が現行正本と異なる | 候補を隔離し、採否決定まで保持 |
| `protected-unresolved` | 正史が意図的に答えを固定していない | 矛盾に数えず、断定を禁止 |
| `implementation-reservation` | 世界観と両立するが数値・UI・Defが未決定 | 世界内事実に昇格させない |
| `historical-difference` | 旧決定と現行正本が異なる | 履歴として保持し、現行判断に使わない |

## オーバーホール隔離

再審査中の概念は次の荷札を揃える。

- `status: draft`
- `authority: protected-draft`
- `knowledge_role: draft-proposal`
- `overhaul_state: under-review`

この状態の記述は消さないが、現行正史の根拠にも、正史との`hard-conflict`にも数えない。再採用するときは、関係する正本と禁止境界を照合してから一件ずつ昇格する。

## 関連項目

- 上位索引: [運用規則](/governance/index.md)
- 権威順位: [知識の権威順位とライフサイクル](/governance/authority-and-lifecycle.md)
- 知識所有者: [知識所有者マップ](/governance/ownership-map.md)
- 正史の禁止境界: [正史上の禁止境界](/world/12-正史上の禁止境界.md)
- 保護された未確定: [保護された未確定事項](/world/11-保護された未確定事項.md)
- 矛盾監査台帳: [矛盾監査台帳](/contradictions/index.md)
