// NOTE: jsx-slack uses Babel only for testing.
const babelPresets = (development) => [
  ['@babel/preset-env', { targets: { node: true } }],
  ['@babel/preset-react', { development, runtime: 'automatic' }],
]

module.exports = {
  presets: babelPresets(true),
  overrides: [
    {
      test: './src/**/*',
      presets: ['@babel/preset-typescript', { allowNamespaces: true }],
    },
    {
      test: './test/**/production.jsx',
      presets: babelPresets(false),
    },
  ],
  plugins: [
    [
      'transform-rename-import',
      { replacements: [{ original: '^node:(.+)$', replacement: '$1' }] },
    ],
  ],
}
