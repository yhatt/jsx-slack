/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'
import { ConfirmProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'

export interface ButtonProps {
  actionId?: string
  children: JSXSlack.Children<{}>
  confirm?: JSXSlack.Node<ConfirmProps>
  name?: string
  style?: SlackButton['style']
  url?: string
  value?: string
}

export const Button: JSXSlack.FC<ButtonProps> = props => (
  <ObjectOutput<SlackButton>
    type="button"
    text={plainText(JSXSlack(<PlainText>{props.children}</PlainText>))}
    action_id={props.actionId || props.name}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    style={props.style}
    url={props.url}
    value={props.value}
  />
)
