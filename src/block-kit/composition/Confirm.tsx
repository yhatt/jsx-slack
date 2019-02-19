/** @jsx JSXSlack.h */
import { Confirm as SlackConfirm } from '@slack/client'
import html from '../../html'
import { JSXSlack } from '../../jsx'

export interface ConfirmProps {
  children: JSXSlack.Children
  confirm: string
  deny: string
  title: string
}

export const Confirm: JSXSlack.FC<ConfirmProps> = ({
  children,
  confirm,
  deny,
  title,
}): JSXSlack.Node<SlackConfirm> => (
  <JSXSlack.Obj
    title={{
      type: 'plain_text',
      text: title,
      emoji: true, // TODO: Controlable emoji
    }}
    text={{
      type: 'mrkdwn',
      text: html(children),
      verbatim: false,
    }}
    confirm={{
      type: 'plain_text',
      text: confirm,
      emoji: true, // TODO: Controlable emoji
    }}
    deny={{
      type: 'plain_text',
      text: deny,
      emoji: true, // TODO: Controlable emoji
    }}
  />
)
