/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ArrayOutput, ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import { ButtonProps } from './interactive/Button'
import { SingleSelectPropsBase } from './interactive/Select'
import { OverflowProps } from './interactive/Overflow'
import { DatePickerProps } from './interactive/DatePicker'

interface ActionsProps extends BlockComponentProps {
  children: JSXSlack.Children<
    ButtonProps | SingleSelectPropsBase | OverflowProps | DatePickerProps
  >
}

const actionTypes = [
  'button',
  'static_select',
  'external_select',
  'users_select',
  'conversations_select',
  'channels_select',
  'overflow',
  'datepicker',
]

export const Actions: JSXSlack.FC<ActionsProps> = props => {
  const elements = JSXSlack(<ArrayOutput>{props.children}</ArrayOutput>)

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
