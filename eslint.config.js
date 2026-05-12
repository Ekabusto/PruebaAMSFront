import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // Plugin react-hooks: reglas para el uso correcto de hooks
      reactHooks.configs.flat.recommended,
    ],
    plugins: {
      // Plugin react: reglas de buenas prácticas para componentes React
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      // Necesario para que eslint-plugin-react detecte la versión automáticamente
      react: { version: 'detect' },
    },
  },
])
