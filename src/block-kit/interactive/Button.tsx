/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'
import { ConfirmProps } from '../composition/Confirm'

export interface ButtonProps {
  actionId?: string
  children: JSXSlack.Children<{}>
  confirm?: JSXSlack.Node<ConfirmProps>
  style?: 'primary' | 'danger'
  url?: string
  value?: string
}

export const Button: JSXSlack.FC<ButtonProps> = props => (
  <ObjectOutput<SlackButton>
    type="button"
    text={{
      type: 'plain_text',
      text: JSXSlack(<PlainText>{props.children}</PlainText>),
      emoji: true, // TODO: Controlable emoji
    }}
    action_id={props.actionId}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    style={props.style}
    url={props.url}
    value={props.value}
  />
)
