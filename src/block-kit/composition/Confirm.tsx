/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm, MrkdwnElement } from '@slack/types'
import { mrkdwnSymbol } from '../composition/Mrkdwn'
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

export const Confirm: JSXSlack.FC<ConfirmProps> = props => (
  <ObjectOutput<SlackConfirm>
    title={plainText(props.title)}
    text={((): MrkdwnElement => {
      const [child] = JSXSlack.normalizeChildren(props.children)

      if (typeof child === 'object' && child.props.type === mrkdwnSymbol)
        return mrkdwn(child.props.text, child.props.verbatim)

      return mrkdwn(html(props.children), true)
    })()}
    confirm={plainText(props.confirm)}
    deny={plainText(props.deny)}
  />
)
