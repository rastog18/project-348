module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'import'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error', // Ensure `import type` is used when it's necessary
    'no-console': 1,
    'no-underscore-dangle': 0,
    'no-unused-vars': 1,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-types': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
        endOfLine: 'auto',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
