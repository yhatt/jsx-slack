/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  testEnvironment: 'node',
  testRegex: '(/(test|__tests__)/(?![_.]).*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transform: { ...tsjPreset.transform },
}
