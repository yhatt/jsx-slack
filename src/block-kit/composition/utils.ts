import { PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'

const renderAsPlainText = (children: JSXSlack.ChildElements) =>
  JSXSlack.Children.toArray(children)
    .map((child) =>
      JSXSlack.isValidElement(child)
        ? renderAsPlainText(child.$$jsxslack.children)
        : child
    )
    .join('')

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
