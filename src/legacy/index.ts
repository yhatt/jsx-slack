import { JSXSlack, customHtmlToMrkdwn, customJsxToHtml } from '../jsx'
import legacyJsxToHtml from './jsx'
import legacyHtmlToMrkdwn from './turndown'

export default function legacyParser() {
  console.warn(
    '[DEPRECATION WARNING] The legacy parser was deprecated and will remove in future version. Please migrate into the default parser by stop calling legacyParser().'
  )

  Object.defineProperties(JSXSlack, {
    [customHtmlToMrkdwn]: {
      configurable: true,
      enumerable: true,
      value: legacyHtmlToMrkdwn,
    },
    [customJsxToHtml]: {
      configurable: true,
      enumerable: true,
      value: legacyJsxToHtml,
    },
  })
}
