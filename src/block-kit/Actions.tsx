/** @jsx JSXSlack.h */
import { ActionsBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { wrap } from '../utils'
import { BlockComponentProps } from './Block'
import { ButtonProps, LinkButtonProps } from './interactive/Button'

type InteractiveComponent = JSXSlack.Node<ButtonProps | LinkButtonProps>

interface ActionsProps extends BlockComponentProps {
  children: InteractiveComponent | InteractiveComponent[]
}

export const Actions: JSXSlack.FC<ActionsProps> = ({
  blockId,
  children,
  id,
}): JSXSlack.Node<ActionsBlock> => (
  <JSXSlack.Obj
    type="actions"
    block_id={id || blockId}
    elements={JSXSlack(<JSXSlack.Arr>{wrap(children)}</JSXSlack.Arr>)}
  />
)
