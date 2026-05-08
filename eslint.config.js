import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const tsRules = {
  ...js.configs.recommended.rules,
  ...tseslint.configs.recommended.rules,
  ...reactPlugin.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  ...jsxA11y.configs.recommended.rules,

  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/explicit-function-return-type': [
    'warn',
    { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'warn',
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    { 'ts-expect-error': 'allow-with-description', 'ts-ignore': true, minimumDescriptionLength: 5 },
  ],
  '@typescript-eslint/naming-convention': [
    'warn',
    { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow', trailingUnderscore: 'allow' },
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow',
    },
    { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
    { selector: 'function', format: ['camelCase', 'PascalCase'] },
    { selector: 'memberLike', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'allow' },
    { selector: 'typeLike', format: ['PascalCase'] },
    { selector: 'enumMember', format: ['UPPER_CASE', 'PascalCase'] },
    { selector: 'objectLiteralProperty', format: null },
    { selector: 'typeProperty', format: null },
    { selector: 'import', format: ['camelCase', 'PascalCase'] },
  ],

  'no-restricted-syntax': [
    'warn',
    {
      selector: "TSAsExpression > TSTypeReference[typeName.name='Record'] > TSTypeParameterInstantiation > TSAnyKeyword",
      message:
        'Avoid `as Record<string, any>`. Type the value precisely; use `Record<string, unknown>` only at framework boundaries.',
    },
    {
      selector: 'TSAsExpression > TSUnknownKeyword',
      message: 'Avoid `as unknown` to bypass type errors. Validate at the boundary and propagate the narrow type.',
    },
    {
      selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
      message: 'Avoid `as any`. Fix the type at its source.',
    },
  ],

  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react/jsx-key': 'error',
  'react/jsx-no-undef': 'error',
  'react/jsx-no-duplicate-props': 'warn',
  'react/jsx-no-target-blank': 'warn',
  'react/jsx-no-useless-fragment': 'warn',
  'react/jsx-pascal-case': 'warn',
  'react/no-array-index-key': 'warn',
  'react/no-children-prop': 'warn',
  'react/no-danger': 'warn',
  'react/no-deprecated': 'warn',
  'react/no-direct-mutation-state': 'warn',
  'react/no-unescaped-entities': 'warn',
  'react/no-unstable-nested-components': 'warn',
  'react/no-unused-state': 'warn',
  'react/self-closing-comp': 'warn',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',

  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': 'off',

  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
      alphabetize: { order: 'asc' },
    },
  ],
  'import/newline-after-import': 'warn',
  'import/no-duplicates': 'warn',
  'import/no-named-as-default': 'warn',
  'import/no-named-as-default-member': 'warn',
  'import/no-self-import': 'warn',
  'import/first': 'warn',
  'import/no-unresolved': 'off',

  complexity: ['warn', 25],
  'max-depth': ['warn', 5],
  eqeqeq: ['warn', 'always'],
  curly: ['warn', 'all'],
  'prefer-template': 'warn',
  'prefer-const': 'warn',
  'no-var': 'warn',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-throw-literal': 'warn',
  'no-debugger': 'warn',
  'no-alert': 'warn',
  'no-param-reassign': ['warn', { props: false }],
  'consistent-return': 'warn',

  ...prettierConfig.rules,
  'prettier/prettier': [
    'warn',
    {
      printWidth: 125,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      jsxSingleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'always',
      endOfLine: 'lf',
    },
  ],
};

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      'storybook-static/',
      '.next/',
      'coverage/',
      'scripts/',
      '*.generated.ts',
      '*.generated.tsx',
      '.storybook/',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
    ],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: { project: './tsconfig.json' } },
    },
    rules: tsRules,
  },
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.ts', 'src/**/*.stories.tsx'],
    plugins: { storybook },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'react/no-unescaped-entities': 'off',
      ...storybook.configs['flat/recommended'][0].rules,
    },
  },
];
