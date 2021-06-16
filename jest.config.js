const esModules = [
  'mdast-util-phrasing',
  'unist-util-parents',
  'unist-util-is',
  'unist-util-visit',
]

module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  moduleFileExtensions: [
    'js',
    'jsx',
    'cjs',
    'mjs',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  moduleNameMapper: {
    '^jsx-slack(.*)$': '<rootDir>$1',
  },
  preset: 'ts-jest/presets/js-with-babel',
  resetMocks: true,
  restoreMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/!(_)*.[jt]s?(x)'],
  transformIgnorePatterns: [`/node_modules/(?!${esModules.join('|')})`],
}
