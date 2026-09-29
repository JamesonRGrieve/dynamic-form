# @jgrieve/forms

Schema-driven forms for React 19, plus the shadcn-style UI primitives they are built from.

## Install

```bash
pnpm add @jgrieve/forms react react-dom
```

`react` and `react-dom` are peer dependencies. The components are styled with Tailwind CSS 4 utility classes and ship no stylesheet of their own, so add the package to your Tailwind sources:

```css
@import 'tailwindcss';
@source '../node_modules/@jgrieve/forms/dist';
```

## Usage

```tsx
import { DynamicForm } from '@jgrieve/forms';

<DynamicForm
  fields={{
    email: { type: 'text', display: 'E-Mail', value: '' },
    password: { type: 'password', display: 'Password', value: '' },
  }}
  onConfirm={(values) => console.warn(values)}
/>;
```

| Layer     | Exports                                                                 |
| --------- | ----------------------------------------------------------------------- |
| Form      | `DynamicForm`                                                           |
| Field     | `Field` (label, error and layout; dispatches on `type`)                 |
| Primitive | `TextField`, `PasswordField`, `SelectField`, `RadioField`, `CheckField` |

UI primitives and hooks are importable by path, e.g. `@jgrieve/forms/components/ui/button` and `@jgrieve/forms/hooks/useToast`.

The package is ESM, compiled for bundlers (Next.js, Vite).

## License

AGPL-3.0-or-later
