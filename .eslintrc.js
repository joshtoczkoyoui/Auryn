module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
  ],

  plugins: ['@typescript-eslint', 'import', 'jest', 'prettier', 'react', 'react-native'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    emcaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    fetch: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': 'off',
    'jest/no-mocks-import': 'off',
    'no-case-declarations': 'off',
    'react/prop-types': 'off',
    indent: 'off',
  },
};
