import defaultConfig from './jest.config.js'

export default {
  ...defaultConfig,
  testMatch: ['<rootDir>/test/**/!(_)*.m[jt]s?(x)'],
}
