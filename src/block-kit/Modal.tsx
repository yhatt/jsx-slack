/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { Blocks, BlockComponentProps } from './Blocks'

export interface ModalProps {
  children: JSXSlack.Children<BlockComponentProps>
  title: string
}

export const Modal: JSXSlack.FC<ModalProps> = props => (
  <ObjectOutput<View>
    type="modal"
    title={{
      type: 'plain_text',
      text: props.title,
      emoji: true, // TODO: Controlable emoji
    }}
    blocks={JSXSlack(<Blocks children={props.children} />)}
  />
)
