import { MrkdwnElement } from '@slack/types'
import { mrkdwn, mrkdwnForOption } from '../composition/Mrkdwn'
import { JSXSlack, createComponent } from '../../jsx'

export const checkboxCheckedSymbol = Symbol('jsx-slack-checkbox-checked')

export interface CheckboxOption {
  text: MrkdwnElement
  description?: MrkdwnElement
  value: string
  readonly [checkboxCheckedSymbol]?: boolean
}

export interface CheckboxProps {
  children: JSXSlack.ChildElements
  checked?: boolean
  description?: JSXSlack.ChildElements
  value: string
}

export const Checkbox = createComponent<CheckboxProps, CheckboxOption>(
  'Checkbox',
  ({ children, checked, description, value }) => {
    const opt = { ...mrkdwnForOption(children), value }

    if (description !== undefined)
      opt.description = mrkdwn(description, { verbatim: opt.text.verbatim })

    if (checked !== undefined)
      Object.defineProperty(opt, checkboxCheckedSymbol, { value: checked })

    return opt
  }
)
