const baseConfig = require('../../eslint.config.js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {},
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.*?.json'],
        tsconfigRootDir: __dirname
      }
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/unified-signatures': 'error'
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
