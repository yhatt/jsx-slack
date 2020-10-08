/* eslint-disable @typescript-eslint/no-empty-function */
import { SectionBlock, MrkdwnElement } from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack, createComponent } from '../../jsx'
import { Escape } from '../../mrkdwn/jsx'
import { mrkdwn } from '../composition/Mrkdwn'
import { Button } from '../elements/Button'
import { Select } from '../elements/Select'
import { alias, assignMetaFrom, resolveTagName } from '../utils'
import { LayoutBlockProps, generateInputValidator } from './utils'

export interface SectionProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

interface FieldProps {
  children: JSXSlack.ChildElements
}

const fieldSymbol = Symbol('jsx-slack-field')

const sectionAccessoryValidators = {
  button: () => {},
  channels_select: (element) => {
    if (element.response_url_enabled)
      throw new JSXSlackError(
        '<ChannelsSelect responseUrlEnabled> is available only in the usage of input components.',
        element
      )
  },
  checkboxes: () => {},
  conversations_select: (element) => {
    if (element.response_url_enabled)
      throw new JSXSlackError(
        '<ConversationsSelect responseUrlEnabled> is available only in the usage of input components.',
        element
      )
  },
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
  timepicker: () => {},
  users_select: () => {},

  // Extra validators to throw better error
  input: generateInputValidator('Section'),
} as const

export const availableSectionAccessoryTypes = Object.keys(
  sectionAccessoryValidators
) as (keyof typeof sectionAccessoryValidators)[]

/**
 * Generate the field for `<Section>` block element.
 *
 * By using 1 to 10 `<Field>` components in immediate child of `<Section>`, you
 * can insert the additional two-column text(s) after the main message.
 *
 * Of course, you can format the text through HTML-like elements.
 *
 * ```jsx
 * <Blocks>
 *   <Section>
 *     Informations about jsx-slack are here.
 *     <Field>
 *       <b>GitHub:</b>
 *     </Field>
 *     <Field>
 *       <a href="https://github.com/speee/jsx-slack">speee/jsx-slack</a>
 *     </Field>
 *     <Field>
 *       <b>npm:</b>
 *     </Field>
 *     <Field>
 *       <a href="https://npm.im/@speee-js/jsx-slack">@speee-js/jsx-slack</a>
 *     </Field>
 *   </Section>
 * </Blocks>
 * ```
 *
 * @return The JSON of text composition object suited to section's field
 */
export const Field = createComponent<FieldProps, MrkdwnElement>(
  'Field',
  ({ children }) =>
    Object.defineProperty(mrkdwn(children), fieldSymbol, { value: true })
)

/**
 * {@link https://api.slack.com/reference/messaging/blocks#section|The `section` layout block}
 * to display text message, and optional fields / the accessory block element.
 *
 * You can style text contents through HTML-like formatting. For example, insert
 * a line break by `<br />`, style text as bold with `<b>`, make paragraph
 * through `<p>`, and create hyperlink via `<a>`.
 *
 * ```jsx
 * <Blocks>
 *   <Section>
 *     <p><i>Hello, world!</i></p>
 *     <p>
 *       <b><a href="https://github.com/speee/jsx-slack/">jsx-slack</a></b>
 *       <br />
 *       Helps to create an amazing Slack app, with familiar HTML syntax!
 *     </p>
 *   </Section>
 * </Blocks>
 * ```
 *
 * **NOTE**: Basic characters for styling text, `*bold*`, `_italic_`,
 * `~strike~`, `` `code` ``, ` ```code block``` `, and `> quote` _still can
 * use_. Consider using `<Escape>` to sanitize them if you want.
 *
 * ### Accessory
 *
 * A one of supported accessory component can show in side-by-side (or just
 * below) of the message by placing it in immediate child of `<Section>`.
 *
 * ```jsx
 * <Blocks>
 *   <Section>
 *     You can add an image of so cute kitten :cat:
 *     <Image src="https://placekitten.com/256/256" alt="Kitten" />
 *   </Section>
 * </Blocks>
 * ```
 *
 * You can pick one as an accessory from following:
 *
 * - `<Image>` (`<img>`)
 * - `<Button>` (`<button>`)
 * - `<Select>` (`<select>`)
 * - `<ExternalSelect>`
 * - `<UsersSelect>`
 * - `<ConversationsSelect>`
 * - `<ChannelsSelect>`
 * - `<Overflow>`
 * - `<DatePicker>`
 * - `<TimePicker>`
 * - `<CheckboxGroup>`
 * - `<RadioButtonGroup>`
 *
 * ### Fields
 *
 * By using `<Field>` component(s) in immediate child of `<Section>`, you can
 * insert the additional two-column text(s) after the main content of message.
 *
 * `<Section>` allows containing up to 10 fields.
 *
 * @return The partial JSON for `section` layout block
 */
export const Section = createComponent<SectionProps, SectionBlock>(
  'Section',
  ({ blockId, children, id, ...rest }) => {
    let text: MrkdwnElement | undefined
    let accessory: SectionBlock['accessory'] | undefined
    let fields: MrkdwnElement[] | undefined

    const contents = JSXSlack.Children.toArray(children).reduce(
      (reduced: ReturnType<typeof JSXSlack.Children.toArray>, child) => {
        if (JSXSlack.isValidElement(child)) {
          const { type } = child.$$jsxslack
          const props = child.$$jsxslack.props || {}

          if (type === 'img') {
            accessory = assignMetaFrom(child, {
              type: 'image' as const,
              image_url: props.src,
              alt_text: props.alt,
            })
            return reduced
          }
          if (type === 'button') {
            accessory = alias(child, Button) as any
            return reduced
          }
          if (type === 'select') {
            accessory = alias(child, Select) as any
            return reduced
          }

          if (typeof type !== 'string' && typeof child === 'object') {
            const obj: any = child

            if (obj[fieldSymbol]) {
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
              throw new JSXSlackError(
                `<Section> has detected the unexpected component as an accessory${
                  tag ? `: ${tag}` : '.'
                }`,
                child
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
      throw new JSXSlackError(
        `<Section> can contain up to 10 fields, but there are ${fields.length} fields.`,
        rest['__source']
      )

    return { type: 'section', block_id: blockId || id, text, accessory, fields }
  }
)
