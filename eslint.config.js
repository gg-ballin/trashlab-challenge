// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const rawExpo = require('eslint-config-expo/flat');
// Strip typescript resolver so unrs-resolver native binding is never loaded (fails in IDE arm64).
const expoConfig = Array.isArray(rawExpo) ? rawExpo.map((block) => {
  if (block.settings?.['import/resolver'] && 'typescript' in block.settings['import/resolver']) {
    const { typescript: _, ...rest } = block.settings['import/resolver'];
    return { ...block, settings: { ...block.settings, 'import/resolver': rest } };
  }
  return block;
}) : rawExpo;

module.exports = defineConfig([
  ...expoConfig,
  { ignores: ['dist/*'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'] },
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    },
  },
]);
