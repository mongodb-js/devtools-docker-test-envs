const jsConfigurations = ['eslint:recommended'];

const tsConfigurations = [
  ...jsConfigurations,
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
];
const tsRules = {
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
};

const testConfigurations = ['plugin:mocha/recommended'];

module.exports = {
  parserOptions: {
    project: ['./tsconfig-lint.json'],
  },
  plugins: ['@typescript-eslint', 'mocha'],
  env: { node: true },
  overrides: [
    {
      parserOptions: {
        ecmaVersion: 2018,
      },
      files: ['**/*.js'],
      env: { node: true, es6: true },
      extends: [...jsConfigurations, 'prettier'],
    },
    {
      parser: '@typescript-eslint/parser',
      files: ['**/*.ts'],
      extends: [...tsConfigurations, 'prettier'],
      rules: { ...tsRules },
    },
    {
      files: ['**/*.spec.js', '**/*.spec.ts'],
      env: { mocha: true },
      extends: [...testConfigurations],
    },
  ],
};
