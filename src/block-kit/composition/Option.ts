import { PlainTextElement } from '@slack/types'
import { plainText } from './utils'
import { JSXSlack, createComponent } from '../../jsx'

export const optionSelectedSymbol = Symbol('jsx-slack-option-selected')

export interface OptionComposition {
  text: PlainTextElement
  value: string
  readonly [optionSelectedSymbol]?: boolean
}

interface OptionProps {
  children: JSXSlack.ChildElements
  selected?: boolean
  value?: string
}

export const Option = createComponent<OptionProps, OptionComposition>(
  'Option',
  ({ children, selected, value }) => {
    const text = plainText(children)
    const opt: OptionComposition = { text, value: value || text.text }

    if (selected !== undefined)
      Object.defineProperty(opt, optionSelectedSymbol, { value: selected })

    return opt
  }
)
