import * as appHomeExamples from './examples/app-home'
import * as basicExamples from './examples/basic'
import * as messagingExamples from './examples/messaging'
import * as modalExamples from './examples/modal'

export default Object.freeze(
  Object.assign(
    Object.create(null),
    basicExamples,
    messagingExamples,
    modalExamples,
    appHomeExamples,
  ),
)
