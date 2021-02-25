module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  moduleNameMapper: {
    '^jsx-slack(.*)$': '<rootDir>$1',
  },
  preset: 'ts-jest/presets/js-with-babel',
  resetMocks: true,
  restoreMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/!(_*).[jt]s?(x)'],
}
