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
}): JSXSlack.Node<ActionsBlock> => (
  <JSXSlack.Obj<ActionsBlock>
    type="actions"
    block_id={id || blockId}
    elements={JSXSlack(<JSXSlack.Arr>{wrap(children)}</JSXSlack.Arr>)}
  />
)
