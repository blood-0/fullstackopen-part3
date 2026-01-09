import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js','*.bundle.js'],
    files: ['**/*.js'],
    plugins: { js, stylistic },
    extends:["js/recommended"],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname:'readonly',
        __filename:'readonly'
      }
    },
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces':'error',
      'object-curly-spacing':['error', 'always'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 0
    }
  }
])