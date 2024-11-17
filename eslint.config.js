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
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked]
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
