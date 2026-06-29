import config from '@tsuk1ko/eslint-config';

export default config({
  ignores: [],
  rules: {
    'no-restricted-globals': 'off',
    'no-use-before-define': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/optimal-quantifier-concatenation': 'off',
    'import/no-mutable-exports': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-property-description': 'off',
    yoda: 'off',
  },
});
