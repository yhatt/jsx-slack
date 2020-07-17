import { PlainTextElement } from '@slack/types'
import { JSXSlack, createComponent } from '../../jsx'
import { plainText } from './utils'

export const optionSelectedSymbol = Symbol('jsx-slack-option-selected')

export interface OptionComposition {
  text: PlainTextElement
  value: string
  readonly [optionSelectedSymbol]?: boolean
}

export interface OptionProps {
  children: JSXSlack.ChildElements

  /**
   * A boolean value to indicate an initially selected option.
   *
   * `<Select>` component may reflect this state.
   */
  selected?: boolean

  /**
   * A string value to send to Slack App when choose item.
   *
   * If not defined, jsx-slack will generate the value string from the label
   * content.
   */
  value?: string
}

/**
 * Generate the composition object, for the option item in the static select
 * element.
 *
 * You should set the plain-text label in its children.
 *
 * @returns The JSON of the composition object for option
 */
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
