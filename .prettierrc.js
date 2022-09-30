module.exports = {
  endOfLine: 'lf',
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],

  importOrder: ['^[^#\\.](.*)', '^#(.*)$', '^\\.+'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
