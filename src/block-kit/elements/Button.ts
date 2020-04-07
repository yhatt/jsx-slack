import { Button as ButtonElement } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmComposition, ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { assignMetaFrom } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface ButtonProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildElements
  style?: 'danger' | 'primary'
  url?: string
  value?: string
}

export const Button = createComponent<ButtonProps, ButtonElement>(
  'Button',
  (props) => {
    let confirm: ConfirmComposition | undefined

    if (props.confirm) {
      confirm = props.confirm as ConfirmComposition

      if (confirm.style === undefined && props.style !== undefined) {
        confirm = { ...confirm, style: props.style }

        if (JSXSlack.isValidElement(props.confirm))
          assignMetaFrom(props.confirm, confirm)
      }
    }

    return {
      type: 'button',
      action_id: props.actionId || props.name,
      text: plainText(props.children),
      value: props.value,
      url: props.url,
      style: props.style,
      confirm,
    }
  }
)
