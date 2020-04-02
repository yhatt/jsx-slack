import { MrkdwnElement } from '@slack/types'
import { mrkdwn, mrkdwnForOption } from '../composition/Mrkdwn'
import { JSXSlack, createComponent } from '../../jsx'

export const radioButtonCheckedSymbol = Symbol('jsx-slack-radio-button-checked')

export interface RadioButtonOption {
  text: MrkdwnElement
  description?: MrkdwnElement
  value: string
  readonly [radioButtonCheckedSymbol]?: boolean
}

export interface RadioButtonProps {
  children: JSXSlack.ChildElements
  checked?: boolean
  description?: JSXSlack.ChildElements
  value: string
}

export const RadioButton = createComponent<RadioButtonProps, RadioButtonOption>(
  'RadioButton',
  ({ children, checked, description, value }) => {
    const opt = { ...mrkdwnForOption(children), value }

    if (description !== undefined)
      opt.description = mrkdwn(description, { verbatim: opt.text.verbatim })

    if (checked !== undefined)
      Object.defineProperty(opt, radioButtonCheckedSymbol, { value: checked })

    return opt
  }
)
