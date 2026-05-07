module.exports = {
  presets: [
    [
      '@vue/babel-preset-app',
      {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining'
  ]
}