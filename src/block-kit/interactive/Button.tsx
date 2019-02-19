/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/client'
import { JSXSlack } from '../../jsx'

export interface ButtonProps {
  actionId: string
  children: JSXSlack.Children
  value?: string
  confirm?: JSXSlack.Node<{}> // TODO: Allow Confirm element
}

export interface LinkButtonProps {
  children: JSXSlack.Children
  url: string
  confirm?: JSXSlack.Node<{}> // TODO: Allow Confirm element
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
    url={props.url}
  />
)
