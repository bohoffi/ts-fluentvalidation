const baseConfig = require('../../eslint.config.js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {},
    languageOptions: {
      parserOptions: {
        project: ['libs/core/tsconfig.*?.json']
      }
    }
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['tslib', '@faker-js/faker']
        }
      ]
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser')
    }
  }
);
