/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/types'
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

export const actionTypes = [
  'button',
  'static_select',
  'external_select',
  'users_select',
  'conversations_select',
  'channels_select',
  'overflow',
  'datepicker',
  'radio_buttons',
] as const

export const Actions: JSXSlack.FC<ActionsProps> = props => {
  const children = JSXSlack.normalizeChildren(props.children).map(child => {
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

  if (elements.some(({ type }) => !actionTypes.includes(type)))
    throw new Error(`<Actions> block has an incompatible element as children.`)

  return (
    <ObjectOutput<ActionsBlock>
      type="actions"
      block_id={props.id || props.blockId}
      elements={elements}
    />
  )
}
