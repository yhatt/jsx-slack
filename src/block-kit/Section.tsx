/** @jsx JSXSlack.h */
import { SectionBlock, MrkdwnElement } from '@slack/client'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Block'

export const Section: JSXSlack.FC<
  BlockComponentProps & { children: JSXSlack.Children<{}> }
> = ({ blockId, children, id }) => {
  const normalized: (string | JSXSlack.Node)[] = []

  let accessory: SectionBlock['accessory']
  let fields: SectionBlock['fields']

  for (const child of JSXSlack.normalizeChildren(children)) {
    if (typeof child === 'object' && child.type === JSXSlack.NodeType.object) {
      // Accessory and fields
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
        case 'mrkdwn':
          if (!fields) fields = []
          fields.push(child.props)
          break
        default:
          throw new Error('<Section> has unexpected component as accessory.')
      }
    } else {
      normalized.push(child)
    }
  }

  const text = html(normalized)

  return (
    <ObjectOutput<SectionBlock>
      type="section"
      block_id={id || blockId}
      text={text ? { text, type: 'mrkdwn', verbatim: true } : undefined}
      accessory={accessory}
      fields={fields}
    />
  )
}

export const Field: JSXSlack.FC<{
  children: JSXSlack.Children<{}>
}> = ({ children }) => (
  <ObjectOutput<MrkdwnElement>
    type="mrkdwn"
    text={html(children)}
    verbatim={true}
  />
)
