const nx = require('@nx/eslint-plugin');
const eslint = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist']
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['@ng-doc/generated'],
          depConstraints: [
            {
              sourceTag: 'type:application',
              onlyDependOnLibsWithTags: ['type:integration', 'type:core']
            },
            {
              sourceTag: 'type:integration',
              onlyDependOnLibsWithTags: ['type:core']
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public'
          }
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-deprecated': 'error'
    }
  },
  {
    files: ['**/*.spec.ts'],
    ...jest.configs['flat/recommended'],
    ...jest.configs['flat/style']
  },
  {
    files: ['**/*.json'],
    rules: {},
    languageOptions: {
      parser: require('jsonc-eslint-parser')
    }
  }
);
