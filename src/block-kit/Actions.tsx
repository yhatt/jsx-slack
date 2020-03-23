/** @jsx JSXSlack.h */
import { ActionsBlock, ConversationsSelect } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ArrayOutput, ObjectOutput, aliasTo, isNode } from '../utils'
import { BlockComponentProps } from './Blocks'
import { Button, ButtonProps } from './elements/Button'
import { Select, SingleSelectPropsBase } from './elements/Select'
import { OverflowProps } from './elements/Overflow'
import { DatePickerBaseProps } from './elements/DatePicker'

interface ActionsProps extends BlockComponentProps {
  children: JSXSlack.Children<
    ButtonProps | SingleSelectPropsBase | OverflowProps | DatePickerBaseProps
  >
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const actionTypeValidators = {
  button: noop,
  channels_select: (accessory) => {
    if (accessory.response_url_enabled)
      throw new Error(
        "responseUrlEnabled in <ChannelsSelect> is available only in the usage of Modal's input component."
      )
  },
  checkboxes: noop,
  conversations_select: (accessory: ConversationsSelect) => {
    if (accessory.response_url_enabled)
      throw new Error(
        "responseUrlEnabled in <ConversationsSelect> is available only in the usage of Modal's input component."
      )
  },
  datepicker: noop,
  external_select: noop,
  overflow: noop,
  radio_buttons: noop,
  static_select: noop,
  users_select: noop,
} as const

export const actionTypes = Object.keys(
  actionTypeValidators
) as (keyof typeof actionTypeValidators)[]

export const Actions: JSXSlack.FC<ActionsProps> = (props) => {
  const children = JSXSlack.normalizeChildren(props.children).map((child) => {
    if (isNode(child)) {
      if (child.type === 'button') return aliasTo(Button, child)
      if (child.type === 'select') return aliasTo(Select, child)
    }
    return child
  })

  const elements = JSXSlack(<ArrayOutput>{children}</ArrayOutput>)

  if (elements.length > 25)
    throw new Error(
      `The number of passed elements (${elements.length}) is over the limit. <Actions> block allows to include up to 25 elements.`
    )

  for (const element of elements) {
    if (!actionTypes.includes(element.type))
      throw new Error(
        `<Actions> block has an incompatible element as children.`
      )

    actionTypeValidators[element.type](element)
  }

  return (
    <ObjectOutput<ActionsBlock>
      type="actions"
      block_id={props.id || props.blockId}
      elements={elements}
    />
  )
}
