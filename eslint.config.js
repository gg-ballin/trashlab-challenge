// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      // Use only node resolver to avoid unrs-resolver native binding issues (eslint-import-resolver-typescript).
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'] },
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    },
  },
]);
