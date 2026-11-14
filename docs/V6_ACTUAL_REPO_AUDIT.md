# V6 actual repository audit

Audited 14 November 2026 in `D:\Horizon`. Original source is retained inside the existing Vite/React/TypeScript package. Private origin is `https://github.com/rana-m-ahmed/RIMWAKE.git`; no push or deployment is authorized.

## Protected baseline

- Baseline commit: `c5bb830`; branch `release/r0-snapshot`; tag `rimwake-pre-v6`.
- Reconstruction branch: `design/meridian-cut-v6`.
- Scientific release: `rimwake-p0-20261114-v1`; SHA-256 `c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32`. Its bytes and the NASA/JPL raw records must remain unchanged by design work.
- User handoff ZIP SHA-256: `d9e857d521e29cf5a5296b0043eb830f604236b8abd5d78279ad6f76f13cef35`. All 27 manifest-listed file hashes matched after extraction into `design-reference/`.
- Source: one long `src/App.tsx`, CSS Module, Zod contract and Python preprocessing. Single root page, no router or backend. No public deployment exists.

## Executed baseline checks

TypeScript PASS; Vitest 15 PASS; Python 37 PASS; production build PASS; Playwright 8 PASS, including axe checks and drawer keyboard flow. Raw command outputs are in `docs/qa/v6/baseline/`. The combined PowerShell command returned nonzero because native stderr warnings became PowerShell error records, while the individual tool reports show successful execution. Future runs use a subprocess runner preserving true exit codes.

## Observed product

Two sourced sites, Sun/Earth apparent airless centre positions, one shared UTC, hourly/refined mode, true crossing brackets, sampled Loom, exact tables, mobile site switch, downloadable evidence, manifest hash validation and failure/retry are implemented. Scientific status is explicitly provisional; independent ephemeris/frame verification has not been run. No terrain, Cause, robustness or power/RF calculation exists.

## Design defects to correct

The root combines a short introductory hero with an oversized instrument. Tiny metadata and radial sky plots hide negative-elevation markers. Time is separated from comparison; the Loom is distant from the scientific stage. No Discover/Explore/Method distinction, swap, shareable case or guided story exists. Typography and muted green composition do not match Meridian Cut. Baseline screenshots are retained separately from v6 iterations.

## Authority and open gates

The v6 documents and visual boards govern design. Their prototype has no astronomy and must not replace the app. Existing released data govern scientific values. User instruction governs scope: implement and make deploy-ready, keep local commits, no push. Account, event/team, qualifying Resources source, official deadline and portal submission are not established by this audit and do not block authorized UI development.
