/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import { plainText } from './composition/utils'

interface InputProps extends BlockComponentProps {
  children: JSXSlack.Node<{}>
  hint?: string
  label: string
  required?: boolean
}

export const Input: JSXSlack.FC<InputProps> = props => (
  <ObjectOutput<InputBlock>
    type="input"
    block_id={props.id || props.blockId}
    hint={props.hint ? plainText(props.hint) : undefined}
    label={plainText(props.label)}
    optional={!props.required}
    element={JSXSlack(props.children)}
  />
)
