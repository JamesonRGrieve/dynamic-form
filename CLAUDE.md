# Claude Code Instructions — @jgrieve/dynamic-form

This is a **React/Next.js component library** providing a `DynamicForm` and a set of related field components (`TextField`, `PasswordField`, `SelectField`, `RadioField`, `CheckField`, etc.) plus the underlying `Field` primitive. The library is consumed by other Next.js apps as a pre-built package (`dist/`) and is developed in Storybook.

The package manager is **pnpm**. The toolchain is **TypeScript + Vite (via Storybook) + Vitest + Playwright + ESLint + Prettier**. There is no runtime backend in this repo — everything is component-level.

---

## Direction (every change must advance these)

These are not optional polish items. Every PR, refactor, and new component must move the codebase in these directions, or it does not land. A change that is neutral on all of them is suspicious — ask whether it's worth doing.

1. **Full strong TypeScript coverage.** No new `any`. No new `@ts-ignore` / `@ts-expect-error` (existing suppressions may stay until the underlying issue is fixed, but every PR should reduce, not grow, that count). New code is fully typed at signatures and return values; prefer narrow types over `unknown`. **Never resort to `any`** for convenience. Use generics or precise prop interfaces. **Fix the root cause, not the symptom**: if the compiler complains about a 'possibly undefined' property, do not sprinkle `??` / `?.` throughout the component. Tighten the prop / state type so the compiler can infer presence. Inference is preferred over casting.

2. **Storybook coverage for every component.** Every `*.tsx` source under `src/` (excluding `app/` boilerplate) gets a `*.stories.tsx`. Stories cover the realistic prop matrix — default, with-error, disabled, loading, edge cases. A "renders without throwing" story is not enough for an interactive component.

3. **Vitest coverage for every behavior unit.** Pure helpers (`toTitleCase`, validators, formatters), hook logic, and reducer-shaped state transitions get unit tests. Tests live under `tests/` (top-level) or co-located as `*.test.ts(x)`. `pnpm test` must pass before commit.

4. **Interactive unit testing in stories.** Stories with behavior use Storybook's `play` function and `@storybook/test` (or `@testing-library/react` against the rendered output) to assert on user interaction — typing, click, submit. Static stories only satisfy the symmetry ratchet for non-interactive components.

5. **Full DRY.** No copy-paste between field components. Field-shared primitives go through `Field.tsx`. If you write similar logic twice, the third time you extract — and prefer extracting on the second instance when the abstraction is obvious.

6. **Accessibility is non-negotiable.** `jsx-a11y` warnings are tracked by the lint ratchet. Form fields have associated labels, controls have appropriate ARIA roles, focus management works under keyboard navigation. New components ship with the a11y-pass story by default.

---

## Testing & coverage (required for every component)

These are not aspirational. Code without these is incomplete.

- **Vitest covers all functionality.** Pure logic (helpers, validators, parsers), hook behavior, state transitions all get unit tests. Use `happy-dom` for DOM-touching tests; the Vitest setup file at `tests/setup.ts` wires in `@testing-library/jest-dom` matchers.
- **Storybook stories for every component.** Each component gets a `*.stories.tsx` colocated next to the source. Use `@storybook/test`'s `userEvent`, `expect`, and `within` inside `play` functions for interaction assertions.
- **Playwright + built Storybook smoke test.** The `tests/storybook/` directory holds Playwright specs that run against a `storybook build`-produced static site (served on a local HTTP server). This catches storyshot-style render regressions without needing Chromatic. Runner: `pnpm test:storybook`.
- **Symmetry ratchet (`pnpm symmetry`)** — counts `*.tsx` components without `*.stories.*` neighbors and source files without `*.test.*` neighbors. The pre-commit ratchet (`pnpm symmetry:ratchet`) gates regressions on either count.

When you add a component, the story and tests are part of the same PR. When you fix a component, also add the story/tests if they don't exist — leave the area better covered than you found it.

---

## Coverage metrics & ratchets

Every direction in the previous section is backed by a coverage script and a ratchet. The ratchets enforce a one-way valve: any PR may improve a metric, no PR may regress one. When a metric drops, run the matching `*:ratchet:update` to lower the baseline in the same commit. **Bypassing a ratchet via `--no-verify` requires explicit user authorization.**

### Ratchet inventory

| Direction | Coverage | Ratchet | Baseline file |
| --- | --- | --- | --- |
| ESLint warnings (new `any`, a11y, complexity, etc.) | (built in) | `pnpm lint:ratchet` | `.eslint-warning-baseline` |
| `tsc --noEmit` total errors | (built in) | `pnpm typecheck:ratchet` | `.tsc-error-baseline` |
| Component → story / source → test pairing | `pnpm symmetry` | `pnpm symmetry:ratchet` | `.symmetry-baseline` |

The baselines are committed plain-text counts (lint, typecheck) or JSON (symmetry). When a PR drops a count, **update the baseline in the same commit** so the next PR is gated against the new floor:

```bash
pnpm lint:ratchet:update
pnpm typecheck:ratchet:update
pnpm symmetry:ratchet:update
```

### Casting policy

`Record<string, unknown>` is strictly weaker than the alternatives but strictly stronger than `any`. Property access stays `unknown` instead of vanishing into `any`. Use it as a last resort, not a default.

**Where Record casts are acceptable** — true framework boundaries with no schema in this repo:
- `react-hook-form` raw form-data payloads when fields are dynamic.
- Third-party data with no shipped types.

**Where Record casts are a regression** — anything internal:
- Casting component prop bags. Type the props properly.
- Same Record cast appearing 3+ times in one file. That's a missing interface — extract one and use it.

**Enforcement:** `@typescript-eslint/no-explicit-any` (warn) flags new `any`. The lint ratchet baseline ensures the count only goes down. A `no-restricted-syntax` rule warns on `as Record<string, any>` casts.

---

## Architecture

### Component layering

| Layer | Purpose | Example |
| --- | --- | --- |
| **Primitive** | Single-input form control with no business logic | `TextField.tsx`, `PasswordField.tsx` |
| **Field** | Wrapper that adds label, error, helper-text, layout | `Field.tsx` |
| **Form** | Schema-driven composition that wires primitives together | `DynamicForm.tsx` |

`DynamicForm` consumes a `fields` schema or a `toUpdate` object and instantiates Field/Primitive pairs for each entry. New field types are added by extending `DynamicFormProps['fields'][string]['type']` and the corresponding renderer branch — never by special-casing inside a consumer.

### Path aliases

`@/*` maps to `./src/*`. The `@/dynamic-form/*` alias preserves compatibility with the upstream consuming app's import paths. Do not introduce additional aliases without updating `tsconfig.json`, `vitest.config.ts`, and the Storybook Vite/webpack config in lockstep.

### State

`DynamicForm` keeps an internal `editedState` keyed by field name, where each entry has `{ value, error }`. Validation runs on submit. The component is intentionally uncontrolled at the form level (the consumer receives the final dict via `onConfirm`). New field types must integrate with this state shape.

---

## Build, test, dev

```bash
pnpm install                          # First-time setup
pnpm dev                              # Storybook dev server (alias of pnpm storybook)
pnpm storybook                        # Storybook on :6006
pnpm build-storybook                  # Static Storybook build (storybook-static/)
pnpm compile                          # tsc → dist/

# Tests
pnpm test                             # Vitest run
pnpm test:watch                       # Vitest watch
pnpm test:coverage                    # Vitest with v8 coverage
pnpm test:storybook                   # Build storybook + run Playwright specs

# Quality gates
pnpm lint                             # ESLint over the whole repo
pnpm lint:fix                         # ESLint --fix
pnpm format                           # Prettier --check
pnpm format:fix                       # Prettier --write
pnpm typecheck                        # tsc --noEmit
pnpm symmetry                         # rebuild .symmetry-coverage.json
pnpm check                            # Aggregate: lint + format + typecheck + test

# Ratchets (run in pre-commit; can be invoked manually)
pnpm lint:ratchet                     # Compares warnings vs baseline
pnpm typecheck:ratchet                # Compares tsc errors vs baseline
pnpm symmetry:ratchet                 # Compares story/test gaps vs baseline

# Update a baseline AFTER a PR drops a count
pnpm lint:ratchet:update
pnpm typecheck:ratchet:update
pnpm symmetry:ratchet:update
```

### Pre-commit pipeline (recommended order)

1. `pnpm lint:fix` and Prettier on staged files.
2. `pnpm typecheck:ratchet` — TS error count cannot rise.
3. `pnpm lint:ratchet` — ESLint warning count cannot rise; errors are never allowed.
4. `pnpm symmetry:ratchet` — missing-story / missing-test counts cannot rise.
5. `pnpm test` — Vitest suite must pass.
6. `pnpm test:storybook` — Storybook build + Playwright smoke (CI only by default; locally if changing Storybook).

Do not silence a failing ratchet. Investigate, fix the underlying issue, or run the matching `*:ratchet:update` and commit the baseline change in the same commit.

---

## Hard rules (operational)

- **Never use `sed` or `awk` to edit files.** Always use the Edit tool for reviewability.
- **Never `rm -rf` inside `node_modules/`** to "fix" install errors. Just run `pnpm install` (or `pnpm install --force` if the lockfile is suspect).
- **`--no-verify`** on commits requires explicit user authorization. Don't reach for it to bypass a hook.
- **Read the source before guessing at fixes.** No rapid-fire commit-and-pray cycles.
- **Batch builds at the end** of a multi-edit task — make all changes first, then build once.
- **Dependency upgrades** that change major versions get their own commit with the changelog summary and any required code adjustments together.

---

## Project quick reference

| Key       | Value                                                |
| --------- | ---------------------------------------------------- |
| Package   | `@jgrieve/dynamic-form`                              |
| Manager   | pnpm                                                 |
| Language  | TypeScript                                           |
| Framework | React 18 + Next.js 15 (peer)                         |
| UI        | Radix primitives + Tailwind + shadcn/ui patterns     |
| Tests     | Vitest + happy-dom; Playwright over built Storybook  |
| Stories   | Storybook 8 (Next.js framework)                      |
| Style     | Functional components, hook-based state, Tailwind    |
