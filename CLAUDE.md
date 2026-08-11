# Claude Code Instructions — @jgrieve/forms

This is a **React/Next.js component library** providing a `DynamicForm` and a set of related field components (`TextField`, `PasswordField`, `SelectField`, `RadioField`, `CheckField`, etc.) plus the underlying `Field` primitive. The library is consumed by other Next.js apps as a pre-built package (`dist/`) and is developed in Storybook.

Workspace-level TS/JS standards (Direction, Casting, Ratchets, ESLint, TS, Test, Pre-commit, Hard Rules) live in `../CLAUDE.md` §7 and apply here. This file documents the rules **specific** to this repo. The canonical ratchet scripts in `scripts/` are the workspace reference implementation.

The package manager is **pnpm**. The toolchain is **TypeScript + Vite (via Storybook) + Vitest + Playwright + ESLint + Prettier**. There is no runtime backend in this repo — everything is component-level.

---

## Repo-Specific Direction (in addition to `/home/jameson/Source/ai-prompts/typescript.md` + `/home/jameson/Source/ai-prompts/react-next.md`)

The generic a11y-default-story rule (every component ships with the a11y-pass story by default) and the shared-primitives-through-one-`Field` rule are canonical in `/home/jameson/Source/ai-prompts/react-next.md` §4 / §1. Repo-local specifics:

- **Field-shared primitives go through `Field.tsx`.** Adding a new field type means extending `DynamicFormProps['fields'][string]['type']` and the corresponding renderer branch — never special-casing inside a consumer.

---

## Architecture

### Component layering

The general Primitive/Field/Form layering principle is canonical in `/home/jameson/Source/ai-prompts/react-next.md` §1. This repo's concrete layering contract:

| Layer         | Purpose                                                  | Example                              |
| ------------- | -------------------------------------------------------- | ------------------------------------ |
| **Primitive** | Single-input form control with no business logic         | `TextField.tsx`, `PasswordField.tsx` |
| **Field**     | Wrapper that adds label, error, helper-text, layout      | `Field.tsx`                          |
| **Form**      | Schema-driven composition that wires primitives together | `DynamicForm.tsx`                    |

`DynamicForm` consumes a `fields` schema or a `toUpdate` object and instantiates Field/Primitive pairs for each entry.

### Path aliases

The general path-alias-in-lockstep policy is canonical in `/home/jameson/Source/ai-prompts/react-next.md` §7. This repo's specifics: `@/*` maps to `./src/*`. The `@/dynamic-form/*` alias preserves compatibility with the upstream consuming app's import paths. Do not introduce additional aliases without updating `tsconfig.json`, `vitest.config.ts`, and the Storybook Vite config in lockstep.

### State

The general uncontrolled-at-form-level pattern (`{ value, error }` keyed by name, consumer receives the final dict via `onConfirm`) is canonical in `/home/jameson/Source/ai-prompts/react-next.md` §9. This repo's concrete shape: `DynamicForm` keeps an internal `editedState` keyed by field name, where each entry has `{ value, error }`. Validation runs on submit. The component is intentionally uncontrolled at the form level (the consumer receives the final dict via `onConfirm`). New field types must integrate with this state shape.

---

## Commands

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
pnpm lint / pnpm lint:fix
pnpm format / pnpm format:fix
pnpm typecheck                        # tsc --noEmit
pnpm symmetry                         # rebuild .symmetry-coverage.json
pnpm check                            # Aggregate: lint + format + typecheck + test

# Ratchets
pnpm lint:ratchet[:update]
pnpm typecheck:ratchet[:update]
pnpm symmetry:ratchet[:update]
```

---

## Project quick reference

| Key       | Value                                               |
| --------- | --------------------------------------------------- |
| Package   | `@jgrieve/forms`                             |
| Manager   | pnpm                                                |
| Language  | TypeScript                                          |
| Framework | React 18 + Next.js 15 (peer)                        |
| UI        | Radix primitives + Tailwind + shadcn/ui patterns    |
| Tests     | Vitest + happy-dom; Playwright over built Storybook |
| Stories   | Storybook 8 (Next.js framework)                     |
| Style     | Functional components, hook-based state, Tailwind   |

---

## Ratchet Re-seed Required

The ESLint / Biome rule set was hardened toward foundry parity (new `warn`-level
rules: `@typescript-eslint/no-use-before-define`, `no-unused-expressions`,
`no-implied-eval`, `no-new-native-nonconstructor`, `no-duplicate-imports`,
`no-self-assign`, expanded `no-shadow` / `naming-convention`, the
`unknown`-outside-`catch` `no-restricted-syntax` selector, `eslint-comments` +
`promise` plugins, the `@vitest/eslint-plugin` test override, and the Biome
`noThisInStatic` / `useFilenamingConvention` rules).

These add new warnings, so after `pnpm install` run:

```bash
pnpm lint:ratchet:update
pnpm biome:ratchet:update
```

Commit the regenerated baseline files (`.eslint-warning-baseline`,
`.biome-baseline`) **in the same commit** as the config change, per workspace
`../CLAUDE.md` §7.3 (ratchet baselines are bumped in the same commit that
changes the rule set).
