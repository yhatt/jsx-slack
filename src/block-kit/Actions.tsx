/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { wrap } from '../utils'
import { BlockComponentProps } from './Block'
import { ButtonProps } from './interactive/Button'
import { SelectPropsBase } from './interactive/Select'
import { OverflowProps } from './interactive/Overflow'

type InteractiveComponent = JSXSlack.Node<
  ButtonProps | SelectPropsBase | OverflowProps
>

interface ActionsProps extends BlockComponentProps {
  children: InteractiveComponent | InteractiveComponent[]
}

export const Actions: JSXSlack.FC<ActionsProps> = ({
  blockId,
  children,
  id,
}): JSXSlack.Node<ActionsBlock> => {
  const elements = JSXSlack(<JSXSlack.Arr>{wrap(children)}</JSXSlack.Arr>)

  if (elements.length > 25)
    throw new Error(
      `The number of passed elements (${
        elements.length
      }) is over the limit. <Actions> block allows to include up to 25 elements.`
    )

  return (
    <JSXSlack.Obj<ActionsBlock>
      type="actions"
      block_id={id || blockId}
      elements={elements}
    />
  )
}
