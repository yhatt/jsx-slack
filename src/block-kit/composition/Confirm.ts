import { Confirm as SlackConfirm } from '@slack/types'
import { mrkdwn } from './Mrkdwn'
import { plainText } from './utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface ConfirmComposition extends SlackConfirm {
  style?: 'danger' | 'primary'
}

export interface ConfirmProps {
  children: JSXSlack.ChildElements
  confirm?: string
  deny?: string
  style?: 'danger' | 'primary'
  title?: string
}

export interface ConfirmableProps {
  confirm?: ConfirmComposition | JSXSlack.Node<ConfirmProps>
}

export const Confirm = createComponent<ConfirmProps, ConfirmComposition>(
  'Confirm',
  ({ children, confirm, deny, style, title }) => ({
    title: title !== undefined ? plainText(title) : undefined,
    text: mrkdwn(children),
    confirm: confirm !== undefined ? plainText(confirm) : undefined,
    deny: deny !== undefined ? plainText(deny) : undefined,
    style,
  })
)
