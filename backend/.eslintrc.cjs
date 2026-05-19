module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-types': 'warn',
    'no-console': 'warn',
  },
};
