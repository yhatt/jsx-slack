import { SectionBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { mrkdwn } from '../composition/Mrkdwn'
import { createComponent, JSXSlack } from '../../jsx'

interface SectionProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

export const Section = createComponent<SectionProps, SectionBlock>(
  'Section',
  (props) => ({
    type: 'section',
    block_id: props.blockId || props.id,
    text: mrkdwn(props.children),
    // TODO: Render accessory and fields
  })
)
