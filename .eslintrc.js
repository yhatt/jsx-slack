module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/react',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  rules: {
    'import/namespace': ['error', { allowComputed: true }],
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
    'no-console': 'warn',
    'react/jsx-key': 'off',
    'react/no-children-prop': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'] },
    },
    react: { pragma: 'JSXSlack' },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
