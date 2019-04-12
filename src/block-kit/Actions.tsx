/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ArrayOutput, ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import { ButtonProps } from './interactive/Button'
import { SelectPropsBase } from './interactive/Select'
import { OverflowProps } from './interactive/Overflow'

interface ActionsProps extends BlockComponentProps {
  children: JSXSlack.Children<ButtonProps | SelectPropsBase | OverflowProps>
}

export const Actions: JSXSlack.FC<ActionsProps> = props => {
  const elements = JSXSlack(<ArrayOutput>{props.children}</ArrayOutput>)

  if (elements.length > 25)
    throw new Error(
      `The number of passed elements (${
        elements.length
      }) is over the limit. <Actions> block allows to include up to 25 elements.`
    )

  return (
    <ObjectOutput<ActionsBlock>
      type="actions"
      block_id={props.id || props.blockId}
      elements={elements}
    />
  )
}
