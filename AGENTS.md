## Imported Claude Cowork project instructions

## Project knowledge

- Read `knowledge/index.md` first and load only the relevant domain indexes.
- Treat `knowledge/` as an OKF 0.2 bundle.
- Use `knowledge_role` and `canonical_for` to locate the single owner of a fact. Follow `canonical_owner` from summaries and projections.
- Use `authority` and `status` only after roles and ownership have been resolved. `canonical` outranks `catalog`, `reference`, `protected-draft`, and `historical`.
- Keep one decision, requirement, concept, or record per file.
- Add standard Markdown links under `## 関連項目` when creating or changing a concept.
- Use active OKF concept owners as current authority; `_to_delete/` and `archive/` contain history material.
- Validate knowledge changes with `node knowledge/tools/validate-okf.mjs`.
- Audit unmanaged cross-domain duplication with `node knowledge/tools/audit-okf-overlap.mjs`.
- Audit setting contradictions with `node knowledge/tools/audit-okf-contradictions.mjs`; treat `overhaul-divergence`, protected unresolved questions, implementation reservations, and historical differences separately from active canon conflicts.
- After changing concepts, run `node knowledge/tools/refine-okf-descriptions.mjs --write`, `node knowledge/tools/build-okf-navigation.mjs --write`, and `node knowledge/tools/normalize-retired-source-links.mjs --write`; verify all three again with `--check`.
- Treat `retired-source://project/...` values as provenance tombstones for deleted source files.
- Maintain the current concept files with the refinement, navigation, normalization, validation, overlap, and contradiction tools; `knowledge/tools/build-okf.mjs` belongs to the retired import history.
- Treat `knowledge/navigation/` as generated, non-authoritative views. Edit concept metadata or the navigation generator instead of editing generated indexes by hand.
- Except for explicit history records, write every document as positive current specification: name the adopted owner, data, behavior, state transition, failure result, and performance condition. Keep former designs, rejected alternatives, comparisons, migration narratives, and provenance detail in history records.
