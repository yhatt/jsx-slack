import { PlainTextElement } from '@slack/types'

export const plainText = (
  text: string,
  opts: Omit<PlainTextElement, 'type' | 'text'> = { emoji: true }
): PlainTextElement => ({
  type: 'plain_text',
  text,
  emoji: !!opts.emoji,
})
