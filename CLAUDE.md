# Claude Code Instructions — @jgrieve/forms

Schema-driven dynamic form generation for React. Consumed by `@zephyrex/auth` and `zephyrex` (client framework).

## Stack Standards

Read **before your first edit**:

- `/home/jameson/Source/ai-prompts/typescript.md`
- `/home/jameson/Source/ai-prompts/react-next.md`

---

## Architecture

Three-layer component model:

| Layer         | Purpose                                                           | Files                                                                   |
| ------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Primitive** | Single input, no business logic                                   | `TextField`, `PasswordField`, `SelectField`, `RadioField`, `CheckField` |
| **Field**     | Label + error + layout wrapper, dispatches to Primitive by `type` | `Field.tsx`                                                             |
| **Form**      | Schema-driven composition                                         | `DynamicForm.tsx`                                                       |

Adding a new field type: extend `DynamicFormProps['fields'][string]['type']` and the renderer branch in `Field.tsx`.

### Exports

```typescript
import { DynamicForm, Field, TextField, PasswordField, SelectField } from '@jgrieve/forms';
import { Button, Input, Label } from '@jgrieve/forms/components/ui/button';
import { useToast, toast } from '@jgrieve/forms/hooks/useToast';
```

---

## Commands

```bash
pnpm install
pnpm compile          # Build to dist/
pnpm storybook        # Storybook on port 6006
pnpm test             # Vitest
pnpm check            # All ratchets
```

## Coverage

13 components, 13 stories, 18 tests. Full story/test parity.

## License

AGPL-3.0-or-later. SPDX header on every source file.
