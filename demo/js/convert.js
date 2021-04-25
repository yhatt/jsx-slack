import { JSXSlack, jsxslack } from '../../src/index'
import { isValidComponent } from '../../src/jsx'

const generateUrl = (json) =>
  `https://api.slack.com/tools/block-kit-builder#${encodeURIComponent(
    JSON.stringify(json)
  )}`

export const convert = (jsx) => {
  const output = jsxslack([jsx])

  if (!JSXSlack.isValidElement(output))
    throw new Error('Cannot parse as jsx-slack component.')

  const ret = { text: JSON.stringify(output, null, 2) }

  if (isValidComponent(output.$$jsxslack.type)) {
    const { name } = output.$$jsxslack.type.$$jsxslackComponent

    if (name === 'Blocks') {
      ret.url = generateUrl({ blocks: output })
    } else if (name === 'Modal' || name === 'Home') {
      ret.url = generateUrl(output)
    }
  }

  return ret
}
