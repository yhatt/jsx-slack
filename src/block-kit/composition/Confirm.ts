import { Confirm as ConfirmComposition } from '@slack/types'
import { mrkdwn } from './Mrkdwn'
import { plainText } from './utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface ConfirmProps {
  children: JSXSlack.ChildElements
  confirm?: string
  deny?: string
  title?: string
}

export interface ConfirmableProps {
  confirm?: ConfirmComposition | JSXSlack.Node<ConfirmProps>
}

export const Confirm = createComponent<ConfirmProps, ConfirmComposition>(
  'Confirm',
  ({ children, confirm, deny, title }) => ({
    title: title !== undefined ? plainText(title) : undefined,
    text: mrkdwn(children),
    confirm: confirm !== undefined ? plainText(confirm) : undefined,
    deny: deny !== undefined ? plainText(deny) : undefined,
  })
)
