import { PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { plainText } from './utils'

export const optionSelectedSymbol = Symbol('jsx-slack-option-selected')

export interface OptionComposition {
  text: PlainTextElement
  value: string
  description?: PlainTextElement
  readonly [optionSelectedSymbol]?: boolean
}

export interface OptionProps {
  children: JSXSlack.ChildElements

  /**
   * A string for the secondary description label of the option item.
   *
   * The description appears next to the item label in small gray text.
   */
  description?: string

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
  ({ children, description, selected, value }) => {
    const text = plainText(children)
    const opt: OptionComposition = {
      text,
      value: value || text.text,
      description:
        description !== undefined ? plainText(description) : undefined,
    }

    if (selected !== undefined)
      Object.defineProperty(opt, optionSelectedSymbol, { value: selected })

    return opt
  },
)
