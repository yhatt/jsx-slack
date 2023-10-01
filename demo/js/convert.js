import { JSXSlack, jsxslack } from '../../src/index'
import { isValidComponent } from '../../src/jsx-internals'

const generateUrl = (json) =>
  `https://api.slack.com/tools/block-kit-builder#${encodeURIComponent(
    JSON.stringify(json),
  )}`

export const convert = (jsx) => {
  const output = jsxslack([jsx])

  if (!JSXSlack.isValidElement(output))
    throw new Error('Cannot parse as jsx-slack component.')

  const ret = { text: JSON.stringify(output, null, 2) }

  if (isValidComponent(output.$$jsxslack.type)) {
    const container = output.$$jsxslack
    const { name: containerName } = container.type.$$jsxslackComponent

    const checkVideoBlock = () => {
      const children = JSXSlack.Children.toArray(container.children)
      if (
        children.find(
          (block) =>
            block.type === 'video' || block.$$jsxslack.type === 'video',
        )
      ) {
        ret.tooltip =
          'NOTE: The video layout block may not test and preview in Slack Block Kit Builder.'
      }
    }

    if (containerName === 'Blocks') {
      ret.url = generateUrl({ blocks: output })
      checkVideoBlock()
    } else if (containerName === 'Modal' || containerName === 'Home') {
      if (output.type === 'modal' || output.type === 'home') {
        ret.url = generateUrl(output)
        checkVideoBlock()
      }
    }
  }

  return ret
}
