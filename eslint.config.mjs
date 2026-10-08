import config from '@tsuk1ko/eslint-config';

export default config(
  {
    ignores: [],
    rules: {
      yoda: 'off',
      'no-restricted-globals': 'off',
      'no-use-before-define': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
      'import/no-mutable-exports': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property-description': 'off',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      // 该插件使用 TS 规则，误判 Espree 的变量引用
      'unused-imports/no-unused-vars': 'off',
    },
  },
);
