import { Button as ButtonElement } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface ButtonProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildElements
  style?: ButtonElement['style']
  url?: string
  value?: string
}

export const Button = createComponent<ButtonProps, ButtonElement>(
  'Button',
  (props) => ({
    type: 'button',
    action_id: props.actionId || props.name,
    text: plainText(props.children),
    value: props.value,
    url: props.url,
    style: props.style,
    confirm: props.confirm as any,
  })
)
