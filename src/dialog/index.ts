export * from './components'
export { DialogValidationError } from './error'

console.warn(
  '[DEPRECATION WARNING] Classic dialog support was deprecated in favor of Slack Modals and will remove in v1. Please migrate into Modal provided by the main entry point.'
)
