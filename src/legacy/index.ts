import { JSXSlack, customHtmlToMrkdwn, customJsxToHtml } from '../jsx'
import legacyJsxToHtml from './jsx'
import legacyHtmlToMrkdwn from './turndown'

export default function legacyParser() {
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
