import { SectionBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { mrkdwnFromChildren } from '../composition/utils'
import { createComponent, JSXSlack } from '../../jsx'

interface SectionProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

export const Section = createComponent<SectionProps, SectionBlock>(
  'Section',
  (props) => ({
    type: 'section',
    block_id: props.blockId || props.id,
    text: mrkdwnFromChildren(props.children),
    // TODO: Render accessory and fields
  })
)
