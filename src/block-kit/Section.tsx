/** @jsx JSXSlack.h */
import { SectionBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Block'

export const Section: JSXSlack.FC<
  BlockComponentProps & { children: JSXSlack.Children<{}> }
> = ({ blockId, children, id }) => {
  const normalized: (string | JSXSlack.Node)[] = []
  let accessory: SectionBlock['accessory'] = undefined

  for (const child of JSXSlack.normalizeChildren(children)) {
    if (typeof child === 'object' && child.type === JSXSlack.NodeType.object) {
      // Accessory
      switch (child.props.type) {
        case 'image':
        case 'button':
        case 'static_select':
        case 'external_select':
        case 'users_select':
        case 'conversations_select':
        case 'channels_select':
        case 'overflow':
        case 'datepicker':
          accessory = JSXSlack(child)
          break
        default:
          throw new Error('<Section> has unexpected component as accessory.')
      }
    } else {
      normalized.push(child)
    }
  }

  return (
    <ObjectOutput<SectionBlock>
      type="section"
      block_id={id || blockId}
      text={{
        type: 'mrkdwn',
        text: html(normalized),
        verbatim: false,
      }}
      accessory={accessory}
    />
  )
}
