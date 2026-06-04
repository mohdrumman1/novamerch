## 2026-06-05 — Root `npm run build` failed because root tsconfig pulled in `admin-panel/` sub-project files

**Tags:** build, tsconfig, monorepo, admin-panel, mockup-builder
**Status:** Fixed

**Issue:** Running `npm run build` from the repo root failed with `Type error: Cannot find module '@/lib/admin-session'` pointing at `admin-panel/src/app/api/auth/login/route.ts`. The failure was reproducible before any new changes were applied, so it predates the mockup builder integration.

**Investigation:** The repo contains two Next.js projects side by side: the root site under `src/` and a separate admin tool under `admin-panel/`. Each has its own `tsconfig.json` with `paths: { "@/*": [...] }` pointing at its own `src/`. The root `tsconfig.json` declared `"include": ["**/*.ts", "**/*.tsx", ...]` which globs into `admin-panel/` (and `graphify-out/`, `local-catalogues/`, `out/`) but with the root's `@/*` mapping, so imports like `@/lib/admin-session` inside `admin-panel/` couldn't be resolved during type-checking.

**Root cause:** Missing exclusions in `/Users/rumman/Desktop/Coding Projects/novamerch/tsconfig.json`. The root project should not type-check files belonging to sibling Next.js projects or build outputs.

**Fix:** Updated the root tsconfig `exclude` array to skip the sibling/build directories:
```jsonc
"exclude": ["node_modules", "admin-panel", "graphify-out", "out", "local-catalogues"]
```
File: `tsconfig.json:26`.

**Verify:** `npm run build` from the repo root now compiles, type-checks, and exports successfully. The build summary should include `/mockup-builder` as a static route.

**If it recurs:** A new sibling project or build-output directory has been added. Add it to the root tsconfig `exclude` list. Do not relax the `@/*` mapping or add per-directory tsconfig hacks; each sub-project should remain self-contained.
