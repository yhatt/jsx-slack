/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** @jsx JSXSlack.h */
import { ConversationsSelect, MrkdwnElement, SectionBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput, aliasTo } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Blocks'
import { mrkdwnSymbol } from './composition/Mrkdwn'
import { mrkdwn, mrkdwnFromNode } from './composition/utils'
import { Button } from './elements/Button'
import { Select, ChannelsSelect } from './elements/Select'
import { Image } from './Image'

const fieldSymbol = Symbol('jsx-slack-field')

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

interface FieldInternalObject {
  type: typeof fieldSymbol
  textElement: MrkdwnElement
}

const sectionAccessoryValidators = {
  button: noop,
  channels_select: accessory => {
    if (accessory.response_url_enabled)
      throw new Error(
        "responseUrlEnabled in <ChannelsSelect> is available only in the usage of Modal's input component."
      )
  },
  checkboxes: noop,
  conversations_select: (accessory: ConversationsSelect) => {
    if (accessory.response_url_enabled)
      throw new Error(
        "responseUrlEnabled in <ConversationsSelect> is available only in the usage of Modal's input component."
      )
  },
  datepicker: noop,
  external_select: noop,
  image: noop,
  multi_channels_select: noop,
  multi_conversations_select: noop,
  multi_external_select: noop,
  multi_static_select: noop,
  multi_users_select: noop,
  overflow: noop,
  radio_buttons: noop,
  static_select: noop,
  users_select: noop,
} as const

export const sectionAccessoryTypes = Object.keys(
  sectionAccessoryValidators
) as (keyof typeof sectionAccessoryValidators)[]

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
          sectionAccessoryValidators[child.props.type](accessory)
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
