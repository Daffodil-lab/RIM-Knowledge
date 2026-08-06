## Imported Claude Cowork project instructions

## Project knowledge

- Read `knowledge/index.md` first and load only the relevant domain indexes.
- Treat `knowledge/` as an OKF 0.2 bundle.
- Use `knowledge_role` and `canonical_for` to locate the single owner of a fact. Follow `canonical_owner` from summaries and projections.
- Use `authority` and `status` only after roles and ownership have been resolved. `canonical` outranks `catalog`, `reference`, `protected-draft`, and `historical`.
- Keep one decision, requirement, concept, or record per file.
- Add standard Markdown links under `## 関連項目` when creating or changing a concept.
- Use active OKF concept owners as current authority; `_to_delete/` and `archive/` contain history material.
- After changing concepts, run `node knowledge/tools/maintain-okf.mjs --write`; it updates derived material in the required order and runs the complete validation suite.
- Before handoff, run `node knowledge/tools/maintain-okf.mjs --check` to verify the committed tree without changing files.
- Treat `overhaul-divergence`, protected unresolved questions, implementation reservations, and historical differences separately from active canon conflicts when interpreting the integrated contradiction audit.
- Treat `retired-source://project/...` values as provenance tombstones for deleted source files.
- Maintain the current concept files with the refinement, navigation, normalization, validation, overlap, and contradiction tools; `knowledge/tools/build-okf.mjs` belongs to the retired import history.
- Treat `knowledge/navigation/` as generated, non-authoritative views. Edit concept metadata or the navigation generator instead of editing generated indexes by hand.
- Except for explicit history records, write every document as positive current specification: name the adopted owner, data, behavior, state transition, failure result, and performance condition. Keep former designs, rejected alternatives, comparisons, migration narratives, and provenance detail in history records.
- Follow `knowledge/governance/human-approval-boundary-人間による承認境界.md`. Do not require the repository owner to understand code line by line or treat approval as proof that the owner verified code.
- Before handoff, provide a Japanese owner-facing approval summary that states what becomes true, what remains unchanged, the canonical owner, AI or generator involvement, checks and results, unverified items, rollback, and the decision still required from the owner.
- Keep knowledge-only changes distinguishable from active maintenance-tool or CI changes. For tool or CI changes, record an independent review of write scope, deletion or overwrite behavior, failure paths, repeat-run safety, and test coverage.
- Keep a pull request in draft when its Japanese approval summary does not match the diff, required checks fail, undeclared destructive or reference-material changes appear, unverified work is presented as verified, or rollback is unclear.
- For C#, XML Defs, scripts, generators, behavior-affecting configuration, or CI changes, follow `knowledge/governance/code-explanation-policy-コード解説の作成規則.md` and include a Japanese one-minute summary, numbered execution flow, code map, failure behavior, evidence, unknowns, and glossary in the same pull request.
- Store durable behavior, state transitions, and ownership boundaries in the existing canonical implementation owner. Use the pull request to explain the current diff, and do not create a duplicate explanation owner.
- Use inline code comments for rationale, invariants, ordering, performance constraints, failure guarantees, and external API constraints. Do not replace the owner-facing explanation with syntax-by-syntax comments.
