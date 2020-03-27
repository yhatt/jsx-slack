import { PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { flattenDeep } from '../../utils'

const renderAsPlainText = (children: JSXSlack.ChildElements) =>
  flattenDeep<string>(
    JSXSlack.Children.toArray(children).map((child) =>
      JSXSlack.isValidElement(child) ? child.$$jsxslack.children : child
    )
  ).join('')

export const plainText = (
  textOrElements: JSXSlack.ChildElements,
  { emoji }: Omit<PlainTextElement, 'type' | 'text'> = { emoji: true }
): PlainTextElement => {
  const text =
    typeof textOrElements === 'string'
      ? textOrElements
      : renderAsPlainText(textOrElements)

  return { type: 'plain_text', text, emoji }
}
