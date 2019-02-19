/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/client'
import { JSXSlack } from '../../jsx'
import { ConfirmProps } from '../composition/Confirm'

export interface ButtonProps {
  actionId: string
  children: JSXSlack.Children
  value?: string
  confirm?: JSXSlack.Node<ConfirmProps>
}

export interface LinkButtonProps {
  children: JSXSlack.Children
  url: string
  confirm?: JSXSlack.Node<ConfirmProps>
}

export const Button: JSXSlack.FC<ButtonProps> = (
  props
): JSXSlack.Node<SlackButton> => (
  <JSXSlack.Obj
    type="button"
    text={{
      type: 'plain_text',
      text: JSXSlack(<JSXSlack.Str>{props.children}</JSXSlack.Str>),
      emoji: true, // TODO: Controlable emoji
    }}
    action_id={props.actionId}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    value={props.value}
  />
)

export const LinkButton: JSXSlack.FC<LinkButtonProps> = (
  props
): JSXSlack.Node<SlackButton> => (
  <JSXSlack.Obj
    type="button"
    text={{
      type: 'plain_text',
      text: JSXSlack(<JSXSlack.Str>{props.children}</JSXSlack.Str>),
      emoji: true, // TODO: Controlable emoji
    }}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    url={props.url}
  />
)
