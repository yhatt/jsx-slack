import { MrkdwnElement, PlainTextElement } from '@slack/types'
import html from '../../html'
import { JSXSlack } from '../../jsx'
import { mrkdwnSymbol } from './Mrkdwn'

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

export const mrkdwnFromNode = (
  node: JSXSlack.Children<{}>,
  defaultOptions?: {
    verbatim?: boolean
  }
): MrkdwnElement => {
  const [child] = JSXSlack.normalizeChildren(node)

  if (typeof child === 'object' && child.props.type === mrkdwnSymbol)
    return mrkdwn(html(child.props.children), child.props.verbatim)

  return mrkdwn(html(node), defaultOptions ? defaultOptions.verbatim : true)
}
