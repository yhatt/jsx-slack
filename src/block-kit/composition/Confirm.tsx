/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm, MrkdwnElement } from '@slack/types'
import html from '../../html'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { plainText, mrkdwn } from './utils'

export interface ConfirmProps {
  children: JSXSlack.Children<{}>
  confirm: string
  deny: string
  title: string
}

export const Confirm: JSXSlack.FC<ConfirmProps> = props => {
  let confirmTextObject: string | MrkdwnElement = mrkdwn(html(props.children))

  for (const child of JSXSlack.normalizeChildren(props.children)) {
    if (typeof child === 'object' && child.props.type === 'mrkdwn_component') {
      confirmTextObject = {
        type: 'mrkdwn',
        text: child.props.text,
        verbatim: child.props.verbatim,
      }
    }
  }

  return (
    <ObjectOutput<SlackConfirm>
      title={plainText(props.title)}
      text={confirmTextObject}
      confirm={plainText(props.confirm)}
      deny={plainText(props.deny)}
    />
  )
}
