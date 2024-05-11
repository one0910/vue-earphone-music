/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  env: { /*env 這個屬性它可以讓eslint支援各種不同的環境*/
    node: true
  },
  rules: {
    "vue/multi-word-component-names": "off" /*這個選項月用來決定Vue compoent的名稱是否要符合Multi-word的規定*/
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
