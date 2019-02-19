/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/client'
import { JSXSlack } from '../../jsx'
import { ConfirmProps } from '../composition/Confirm'

export interface ButtonProps {
  actionId?: string
  children: JSXSlack.Children
  confirm?: JSXSlack.Node<ConfirmProps>
  url?: string
  value?: string
}

export const Button: JSXSlack.FC<ButtonProps> = (
  props
): JSXSlack.Node<SlackButton> => (
  <JSXSlack.Obj<SlackButton>
    type="button"
    text={{
      type: 'plain_text',
      text: JSXSlack(<JSXSlack.Plain>{props.children}</JSXSlack.Plain>),
      emoji: true, // TODO: Controlable emoji
    }}
    action_id={props.actionId}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    url={props.url}
    value={props.value}
  />
)
