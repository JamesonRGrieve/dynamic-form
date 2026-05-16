/**
 * dependency-cruiser config for @jgrieve/dynamic-form.
 *
 * Forbids circular dependencies and cross-imports between sibling top-level
 * folders under `src/` (components / hooks / lib). Field/Form primitives at
 * the `src/` root may still be imported from any layer.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: 'Circular dependencies are a code smell. Extract the shared piece.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Module is not reachable from any entry point.',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.[^/]+\\.json$',
          '(^|/)package\\.json$',
        ],
      },
      to: {},
    },
    {
      name: 'components-no-import-hooks-directly',
      severity: 'warn',
      comment: 'Components should consume hooks via re-exports from index, not reach into src/hooks/* internals.',
      from: { path: '^src/components/' },
      to: { path: '^src/hooks/' },
    },
    {
      name: 'hooks-no-import-components',
      severity: 'warn',
      comment:
        'Hooks must not depend on components (would create cycles). Type-only imports are allowed since they erase at runtime.',
      from: { path: '^src/hooks/' },
      to: { path: '^src/components/', dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'lib-no-import-components-or-hooks',
      severity: 'warn',
      comment: 'lib/ is the lowest layer — must not pull from components/ or hooks/.',
      from: { path: '^src/lib/' },
      to: { path: '^src/(components|hooks)/' },
    },
    {
      name: 'no-unresolvable',
      severity: 'error',
      comment: 'Imports that cannot be resolved indicate a typo or missing module.',
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: {
      path: ['node_modules', 'dist', 'storybook-static', '\\.test\\.', '\\.stories\\.'],
    },
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
