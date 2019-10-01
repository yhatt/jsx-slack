/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** @jsx JSXSlack.h */
import { SectionBlock, MrkdwnElement } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput, aliasTo } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Blocks'
import { Image } from './Image'
import { Button } from './elements/Button'
import { Select } from './elements/Select'

export const Section: JSXSlack.FC<
  BlockComponentProps & { children: JSXSlack.Children<{}> }
> = ({ blockId, children, id }) => {
  const normalized: (string | JSXSlack.Node)[] = []

  let accessory: SectionBlock['accessory']
  let fields: SectionBlock['fields']

  for (const child of JSXSlack.normalizeChildren(children)) {
    let eaten = false

    if (typeof child === 'object') {
      // Accessory and fields
      if (child.type === JSXSlack.NodeType.object) {
        switch (child.props.type) {
          case 'image':
          case 'button':
          case 'static_select':
          case 'external_select':
          case 'users_select':
          case 'conversations_select':
          case 'channels_select':
          case 'multi_static_select':
          case 'multi_external_select':
          case 'multi_users_select':
          case 'multi_conversations_select':
          case 'multi_channels_select':
          case 'overflow':
          case 'datepicker':
            accessory = JSXSlack(child)
            break
          case 'mrkdwn':
            if (!fields) fields = []
            fields.push(child.props)
            break
          default:
            throw new Error(
              '<Section> has unexpected component as an accessory.'
            )
        }
        eaten = true
      } else if (child.type === 'img') {
        accessory = JSXSlack(
          <Image alt={child.props.alt} src={child.props.src} />
        )
        eaten = true
      } else if (child.type === 'button') {
        accessory = JSXSlack(aliasTo(Button, child)!)
        eaten = true
      } else if (child.type === 'select') {
        accessory = JSXSlack(aliasTo(Select, child)!)
        eaten = true
      }
    }

    if (!eaten) normalized.push(child)
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
