# Dynamic Form

Dynamic Form provides an accessible, type-safe React form builder that derives fields from configuration objects. The refactor focuses on strong validation, internationalisation-ready labelling, and dependable submission behaviour.

## Features

- **Deterministic validation:** The form validates every field in a single pass and blocks submission until all errors are resolved. Validation results never rely on asynchronous React state updates.
- **Security conscious:** Sensitive values are never logged. Validation warnings only report field names, avoiding inadvertent data disclosure.
- **Accessibility:** Inputs expose ARIA attributes, validation feedback uses `role="alert"`, and focus states remain visible without any third‑party UI kit.
- **Internationalisation ready:** Default labels honour the provided locale, and timezone options can be formatted through an overridable formatter.
- **Extensibility:** Custom field renderers can be registered by providing additional `options` metadata. Consumers can still supply a `toUpdate` object for backwards compatibility.

## Getting Started

1. Install the package alongside React (React 18 or 19 is supported).
2. Import the component and supply either a `fields` configuration object or a `toUpdate` record for quick scaffolding.

```tsx
import { DynamicForm } from '@jgrieve/dynamic-form';

const fields = {
  email: {
    type: 'text',
    display: 'Email address',
    required: true,
    validation: (value) => ({
      valid: /.+@.+/.test(String(value)),
      message: 'Please provide a valid email.',
    }),
  },
  marketingOptIn: {
    type: 'boolean',
    display: 'Receive product updates',
  },
};

function Example() {
  return (
    <DynamicForm
      fields={fields}
      onConfirm={(values) => {
        // Persist the values to your API.
        console.log(values);
      }}
    />
  );
}
```

## Scripts

Because the execution environment blocks package downloads, automated scripts may fail outside of a fully provisioned workspace. When dependencies are available, the following commands are supported:

- `npm run lint` – static analysis via ESLint.
- `npm run test` – executes Vitest + jsdom integration tests.
- `npm run build` – emits the TypeScript declaration files and ESM bundle in `dist/`.

## Testing Philosophy

- **Real interactions only:** Tests render full components and never mock browser APIs or modules.
- **Accessibility verification:** Assertions focus on visible text and ARIA attributes, ensuring that the rendered DOM remains accessible.

## Release Process

1. Update `CHANGELOG.md` and bump `package.json` when shipping new features or fixes.
2. Run `npm run validate` locally – it chains linting, testing, and the build.
3. Publish the generated `dist/` directory to npm along with `THIRD_PARTY_NOTICES.md`.

## Legal & Compliance

- Source code is licensed under ISC. See `LICENSE`.
- Third-party attributions and licence notices live in `THIRD_PARTY_NOTICES.md`.

## Contributing

1. Fork the repository and create a feature branch.
2. Ensure new functionality is covered by tests.
3. Submit a pull request that links to any tracked issues and summarises changes in the PR description.
