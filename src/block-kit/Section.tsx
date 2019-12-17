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

export const sectionAccessoryTypes = [
  'image',
  'button',
  'static_select',
  'external_select',
  'users_select',
  'conversations_select',
  'channels_select',
  'multi_static_select',
  'multi_external_select',
  'multi_users_select',
  'multi_conversations_select',
  'multi_channels_select',
  'overflow',
  'datepicker',
  'radio_buttons',
] as const

export const Section: JSXSlack.FC<BlockComponentProps & {
  children: JSXSlack.Children<{}>
}> = ({ blockId, children, id }) => {
  const normalized: (string | JSXSlack.Node)[] = []

  let accessory: SectionBlock['accessory']
  let fields: SectionBlock['fields']
  let hasVerbatimField = false


  for (const child of JSXSlack.normalizeChildren(children)) {
    let eaten = false

    if (typeof child === 'object') {
      // Accessory and fields
      if (child.type === JSXSlack.NodeType.object) {
        if (sectionAccessoryTypes.includes(child.props.type)) {
          accessory = JSXSlack(child)
        } else if (child.props.type === 'mrkdwn') {
          if (!fields) fields = []
          fields.push(child.props)
        } else if(child.props.type === 'mrkdwn_component'){
          if (!fields) fields = []
          fields.push({
            type: "mrkdwn",
            text: child.props.text,
            verbatim: child.props.verbatim
          })
          hasVerbatimField = true;
        }else {
          throw new Error('<Section> has unexpected component as an accessory.')
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

  if(hasVerbatimField && ((fields && fields.length > 1) || normalized.length > 0)){
    throw new Error('<Section> can only contain a single <MrkDwn> child and no other children')
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
