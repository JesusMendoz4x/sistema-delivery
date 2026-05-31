import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Patrón de carga de datos al montar (useEffect -> fetch -> setState).
      // La regla lo desaconseja por rendimiento, pero aquí es intencional y seguro,
      // así que lo dejamos como advertencia en lugar de error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
