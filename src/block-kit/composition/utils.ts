import { MrkdwnElement, PlainTextElement } from '@slack/types'

export const plainText = (text: string): PlainTextElement => ({
  type: 'plain_text',
  text,
  emoji: true, // TODO: Controlable emoji
})

export const mrkdwn = (mrkdwnText: string): MrkdwnElement => ({
  type: 'mrkdwn',
  text: mrkdwnText,
  verbatim: true,
})
