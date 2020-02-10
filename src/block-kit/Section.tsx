/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** @jsx JSXSlack.h */
import { SectionBlock, MrkdwnElement } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput, aliasTo } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Blocks'
import { mrkdwnSymbol } from './composition/Mrkdwn'
import { mrkdwn, mrkdwnFromNode } from './composition/utils'
import { Button } from './elements/Button'
import { Select } from './elements/Select'
import { Image } from './Image'

const fieldSymbol = Symbol('jsx-slack-field')

interface FieldInternalObject {
  type: typeof fieldSymbol
  textElement: MrkdwnElement
}

export const sectionAccessoryTypes = [
  'button',
  'channels_select',
  'checkboxes',
  'conversations_select',
  'datepicker',
  'external_select',
  'image',
  'multi_channels_select',
  'multi_conversations_select',
  'multi_external_select',
  'multi_static_select',
  'multi_users_select',
  'overflow',
  'radio_buttons',
  'static_select',
  'users_select',
] as const

export const Section: JSXSlack.FC<BlockComponentProps & {
  children: JSXSlack.Children<{}>
}> = ({ blockId, children, id }) => {
  const normalized: (string | JSXSlack.Node)[] = []

  let accessory: SectionBlock['accessory']
  let fields: SectionBlock['fields']
  let text: MrkdwnElement | undefined

  for (const child of JSXSlack.normalizeChildren(children)) {
    let eaten = false

    if (typeof child === 'object') {
      if (child.type === JSXSlack.NodeType.object) {
        // Accessory, fields, and Mrkdwn
        if (sectionAccessoryTypes.includes(child.props.type)) {
          accessory = JSXSlack(child)
        } else if (child.props.type === fieldSymbol) {
          if (!fields) fields = []
          fields.push(child.props.textElement)
        } else if (child.props.type === mrkdwnSymbol) {
          text = mrkdwn(html(child.props.children), child.props.verbatim)
        } else {
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

  if (!text) {
    const rendered = html(normalized)
    if (rendered) text = mrkdwn(rendered, true)
  }

  return (
    <ObjectOutput<SectionBlock>
      type="section"
      block_id={id || blockId}
      text={text}
      accessory={accessory}
      fields={fields}
    />
  )
}

export const Field: JSXSlack.FC<{
  children: JSXSlack.Children<{}>
}> = ({ children }) => (
  <ObjectOutput<FieldInternalObject>
    type={fieldSymbol}
    textElement={mrkdwnFromNode(children)}
  />
)
