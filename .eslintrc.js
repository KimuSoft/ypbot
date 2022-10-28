module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  plugins: [
    'arca'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      './packages/*/tsconfig.json'
      // './packages/bot/tsconfig.json',
      // './packages/database/tsconfig.json',
      // './packages/rpc/tsconfig.json'

    ]
  },
  rules: {
    semi: ['error', 'never'],
    'arca/import-absolutes': 2,
    'arca/import-align': [2, { collapseExtraSpaces: true }],
    'arca/import-ordering': 2,
    'arca/jsx-longhand-props': 2,
    'arca/melted-constructs': 2,
    'arca/newline-after-import-section': 2,
    'arca/no-default-export': 2,
    'no-multi-spaces': ['error', { exceptions: { ImportDeclaration: true } }],
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/consistent-type-imports': 2
  }
}
