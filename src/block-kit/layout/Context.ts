import { ContextBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { createComponent, JSXSlack } from '../../jsx'

interface ContextProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

export const Context = createComponent<ContextProps, ContextBlock>(
  'Context',
  (props) => ({
    type: 'context',
    block_id: props.blockId || props.id,

    // TODO: Render HTML and images
    elements: [],
  })
)
