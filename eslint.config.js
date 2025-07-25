const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    settings: {
      'import/resolver': {
        'babel-module': {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.svg'],
        },
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['.svg$'],
        },
      ],
    },
  },
]);