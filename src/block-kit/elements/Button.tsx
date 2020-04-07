/** @jsx JSXSlack.h */
import { Button as SlackButton } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'
import { ConfirmComposition, ConfirmProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'

export interface ButtonProps {
  actionId?: string
  children: JSXSlack.Children<{}>
  confirm?: JSXSlack.Node<ConfirmProps>
  name?: string
  style?: 'danger' | 'primary'
  url?: string
  value?: string
}

export const Button: JSXSlack.FC<ButtonProps> = (props) => {
  let confirm: ConfirmComposition | undefined

  if (props.confirm) {
    confirm = JSXSlack(props.confirm) as ConfirmComposition

    if (confirm.style === undefined && props.style !== undefined)
      confirm.style = props.style
  }

  return (
    <ObjectOutput<SlackButton>
      type="button"
      text={plainText(JSXSlack(<PlainText>{props.children}</PlainText>))}
      action_id={props.actionId || props.name}
      confirm={confirm}
      style={props.style}
      url={props.url}
      value={props.value}
    />
  )
}
