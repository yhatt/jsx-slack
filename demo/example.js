import * as basicExamples from './examples/basic'
import * as messagingExamples from './examples/messaging'
import * as modalExamples from './examples/modal'
import * as appHomeExamples from './examples/app-home'

export default Object.freeze(
  Object.assign(
    Object.create(null),
    basicExamples,
    messagingExamples,
    modalExamples,
    appHomeExamples
  )
)
