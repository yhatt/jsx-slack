import { MrkdwnElement, PlainTextElement } from '@slack/types'

export const plainText = (
  text: string,
  opts: { emoji?: boolean } = { emoji: true }
): PlainTextElement => ({
  type: 'plain_text',
  text,
  emoji: !!opts.emoji,
})

export const mrkdwn = (
  mrkdwnText: string,
  verbatim?: boolean
): MrkdwnElement => ({
  type: 'mrkdwn',
  text: mrkdwnText,
  verbatim,
})
