import { MrkdwnElement, PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { mrkdwn as toMrkdwn } from '../../mrkdwn/index'

export const plainText = (
  text: string,
  { emoji }: Omit<PlainTextElement, 'type' | 'text'> = { emoji: true }
): PlainTextElement => ({
  type: 'plain_text',
  text,
  emoji,
})

export const mrkdwnFromChildren = (
  children: JSXSlack.ChildElements,
  opts: Omit<MrkdwnElement, 'type' | 'text'> = { verbatim: true }
): MrkdwnElement => {
  const mrkdwn: MrkdwnElement = { type: 'mrkdwn', text: '', ...opts }

  // TODO: Detect <Mrkdwn> composition component

  mrkdwn.text = toMrkdwn(children)
  return mrkdwn
}
