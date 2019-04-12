/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm } from '@slack/types'
import html from '../../html'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'

export interface ConfirmProps {
  children: JSXSlack.Children<{}>
  confirm: string
  deny: string
  title: string
}

export const Confirm: JSXSlack.FC<ConfirmProps> = props => (
  <ObjectOutput<SlackConfirm>
    title={{
      type: 'plain_text',
      text: props.title,
      emoji: true, // TODO: Controlable emoji
    }}
    text={{
      type: 'mrkdwn',
      text: html(props.children),
      verbatim: true,
    }}
    confirm={{
      type: 'plain_text',
      text: props.confirm,
      emoji: true, // TODO: Controlable emoji
    }}
    deny={{
      type: 'plain_text',
      text: props.deny,
      emoji: true, // TODO: Controlable emoji
    }}
  />
)
