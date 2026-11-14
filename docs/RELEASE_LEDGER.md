# Local release ledger

| Gate | Reference | Evidence | State |
|---|---|---|---|
| R0 | `c5bb830`, `rimwake-pre-v6`, `release/r0-snapshot` | Baseline build/type/unit/Python/browser logs and screenshots | Protected |
| R1 | Reconstruction branch `design/meridian-cut-v6` | Routes, tokens, landing | In progress |
| R2 | Pending | Signed instrument, synchronized records, source-bound case | Pending |
| R3 | Pending | Visual iterations, mobile, keyboard, accessibility, performance | Pending |
| R4 | No public deployment | User requires local commits; no push | Withheld |

Rollback uses `git switch release/r0-snapshot` only after preserving any uncommitted work. Do not reset destructively. Restore dependencies with `npm.cmd ci` after stopping project build servers on Windows; then `npm.cmd run dev` or `npm.cmd run build`.
