import type { RichTextBlock } from '@slack/types'
import type { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'

export interface RichTextElementsProps {
  children: JSXSlack.ChildElements
}

/**
 * Generate rich text objects from children elements.
 */
export const RichTextElements = createComponent<
  RichTextElementsProps,
  RichTextBlock['elements']
>('RichTextElements', () => {
  return []
})
