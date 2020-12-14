module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    curly: 'off',
    camelcase: 'off',
    'no-case-declarations': 'off',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'only-multiline'],
    'space-before-function-paren': 'off',
    yoda: 'off',
  },
};
