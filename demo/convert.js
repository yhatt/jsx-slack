import { JSXSlack, jsxslack } from '../src/index'
import { isValidComponent } from '../src/jsx'

const generateUrl = (params) => {
  const q = new URLSearchParams()
  Object.keys(params).forEach((k) => q.append(k, params[k]))

  return `https://api.slack.com/tools/block-kit-builder?${q}`
}

export const convert = (jsx) => {
  const output = jsxslack([jsx])

  if (!JSXSlack.isValidElement(output))
    throw new Error('Cannot parse as jsx-slack component.')

  const ret = { text: JSON.stringify(output, null, 2) }
  const encoded = JSON.stringify(output).replace(/\+/g, '%2b')

  if (isValidComponent(output.$$jsxslack.type)) {
    const { name } = output.$$jsxslack.type.$$jsxslackComponent

    if (name === 'Blocks') {
      ret.url = generateUrl({ blocks: encoded, mode: 'message' })
    } else if (name === 'Modal') {
      ret.url = generateUrl({ view: encoded, mode: 'modal' })
    } else if (name === 'Home') {
      ret.url = generateUrl({ view: encoded, mode: 'appHome' })
    }
  }

  return ret
}
