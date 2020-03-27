/* eslint-disable @typescript-eslint/no-empty-function */
import { SectionBlock, MrkdwnElement } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { mrkdwn } from '../composition/Mrkdwn'
import { alias, assignMetaFrom, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'
import { Escape } from '../../mrkdwn/jsx'

export interface SectionProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

interface FieldProps {
  children: JSXSlack.ChildElements
}

const sectionAccessoryValidators = {
  button: () => {},
  channels_select: () => {},
  checkboxes: () => {},
  conversations_select: () => {},
  datepicker: () => {},
  external_select: () => {},
  image: ({ type, image_url, alt_text }) => ({ type, image_url, alt_text }),
  multi_channels_select: () => {},
  multi_conversations_select: () => {},
  multi_external_select: () => {},
  multi_static_select: () => {},
  multi_users_select: () => {},
  overflow: () => {},
  radio_buttons: () => {},
  static_select: () => {},
  users_select: () => {},
} as const

export const Field = createComponent<FieldProps, MrkdwnElement>(
  'Field',
  ({ children }) =>
    Object.defineProperty(mrkdwn(children), '$$field', { value: true })
)

export const Section = createComponent<SectionProps, SectionBlock>(
  'Section',
  (props) => {
    let text: MrkdwnElement | undefined
    let accessory: SectionBlock['accessory'] | undefined
    let fields: MrkdwnElement[] | undefined

    const contents = JSXSlack.Children.toArray(props.children).reduce(
      (reduced: ReturnType<typeof JSXSlack.Children.toArray>, child) => {
        if (JSXSlack.isValidElement(child)) {
          const { type } = child.$$jsxslack
          const childProps = child.$$jsxslack.props || {}

          if (type === 'img') {
            accessory = assignMetaFrom(child, {
              type: 'image' as const,
              image_url: childProps.src,
              alt_text: childProps.alt,
            })
            return reduced
          }
          // if (type === 'button') {
          //   accessory = alias(child, Button)
          //   return reduced
          // }
          // if (type === 'select') {
          //   accessory = alias(child, Select)
          //   return reduced
          // }

          if (typeof type !== 'string' && typeof child === 'object') {
            const obj: any = child

            if (obj.$$field) {
              fields = [...(fields || []), obj]
            } else if (obj.type === 'mrkdwn' && obj.text) {
              text = obj
            } else if (sectionAccessoryValidators[obj.type]) {
              accessory = sectionAccessoryValidators[obj.type](obj) || obj
            } else if (type === Escape) {
              // <Escape> is an only built-in component to allow collecting
              return [...reduced, child]
            } else {
              const tag = resolveTagName(child)
              throw new Error(
                `<Section> has detected the unexpected component as an accessory${
                  tag ? `: ${tag}` : '.'
                }`
              )
            }

            return reduced
          }
        }
        return [...reduced, child]
      },
      []
    )

    if (!text) {
      const rendered = mrkdwn(contents)
      if (rendered.text) text = rendered
    }

    if (fields && fields.length > 10)
      throw new Error(
        `<Section> can contain up to 10 fields, but there are ${fields.length} fields.`
      )

    return {
      type: 'section',
      block_id: props.blockId || props.id,
      text,
      accessory,
      fields,
    }
  }
)
