import { resolveTagName } from '../utils'
import { isValidElementFromComponent } from '../../jsx'

export interface LayoutBlockProps {
  /** A string of unique identifier for the layout block. */
  blockId?: string

  /** An alias to `blockId` prop. */
  id?: string
}

export const generateInputValidator = (from: string) => (
  element: unknown
): never => {
  const tag = resolveTagName(element)
  const isComponent = isValidElementFromComponent(element)

  throw new Error(
    `<${from}> cannot include the ${(() => {
      if (tag) {
        if (isComponent && tag !== '<Input>') {
          const tagName = tag.slice(1, -1)
          return `input component. Please remove "label" prop from <${tagName} label="...">.`
        }
        return `element for "input" type: ${tag}`
      }
      return 'element for "input" type.'
    })()}`
  )
}
