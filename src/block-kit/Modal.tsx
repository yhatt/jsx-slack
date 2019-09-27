/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { Blocks, BlockComponentProps } from './Blocks'
import { plainText } from './composition/utils'

export interface ModalProps {
  children: JSXSlack.Children<BlockComponentProps>
  title: string
}

export const Modal: JSXSlack.FC<ModalProps> = props => (
  <ObjectOutput<View>
    type="modal"
    title={plainText(props.title)}
    blocks={JSXSlack(<Blocks children={props.children} />)}
  />
)
