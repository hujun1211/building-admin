import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default antfu({
  ignores: ['src/shadcn/*'],
  formatters: true,
  react: true,
  rules: {
    'curly': ['error', 'all'], // 要求使用大括号
    'no-console': 'warn', // console
    'sort-imports': 'off', // import排序
    'style/jsx-max-props-per-line': [1, { maximum: 3 }], // jsx一行最多3个属性
  },
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
}, ...tailwindcss.configs['flat/recommended'])
