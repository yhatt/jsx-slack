import { SectionBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { createComponent, JSXSlack } from '../../jsx'

interface SectionProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

export const Section = createComponent<SectionProps, SectionBlock>(
  'Section',
  (props) => ({
    type: 'section',
    block_id: props.blockId || props.id,
    // TODO: Render HTML, accessory, and fields
  })
)
