/** @jsx JSXSlack.h */
import { PlainTextElement, View } from '@slack/types'
import {
  generateActionsValidator,
  generateBlocksContainer,
  generateSectionValidator,
} from './utils'
import { plainText } from '../composition/utils'
import { Select } from '../elements/Select'
import { Textarea } from '../input/Textarea'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'
import { Input, knownInputs } from '../layout/Input'
import { Section } from '../layout/Section'
import { JSXSlack, cleanMeta, createComponent } from '../../jsx'

type PrivateMetadataTransformer = (
  hiddenValues: object | undefined
) => string | undefined

interface ModalProps {
  children: JSXSlack.ChildNodes

  /**
   * An identifier for this modal to recognize it in various events from Slack.
   */
  callbackId?: string

  /**
   * Set whether all stacked views will clear by the close button on this modal.
   */
  clearOnClose?: boolean

  /** A text for close button of the modal. (24 characters maximum) */
  close?: string

  /** A unique ID for all views on a per-team basis. */
  externalId?: string

  /**
   * Set whether to send `view_closed` event to the request URL of Slack app
   * when closed modal.
   */
  notifyOnClose?: boolean

  /**
   * An optional metadata string for handling stored data in callback events
   * from Slack API. (3000 characters maximum)
   *
   * If not defined, the modal will use values defined in
   * `<Input type="hidden">` as metadata stringified to JSON.
   *
   * You can also customize how to transform hidden values into string by
   * passing the custom transformer function.
   *
   * @example
   * ```jsx
   * <Modal
   *   title="example"
   *   privateMetadata={(hidden) => hidden && new URLSearchParams(hidden).toString()}
   * >
   *   <Input type="hidden" name="A" value="foobar" />
   *   <Input type="hidden" name="B" value={123} />
   *   <Input type="hidden" name="C" value={true} />
   * </Modal>
   * ```
   *
   * In this example, the private metadata would be `A=foobar&B=123&C=true` by
   * transformation using `URLSearchParams`.
   *
   * The transformer takes an argument: JSON object of hidden values, or
   * `undefined` when there was no hidden values. It must return the transformed
   * string, or `undefined` if won't assign private metadata.
   */
  privateMetadata?: string | PrivateMetadataTransformer

  /**
   * A text for submit button of the modal. (24 characters maximum)
   *
   * If not defined this prop and the modal required the submit button, the
   * label will be defined by `<input type="submit">` in children, or used
   * default label "Submit".
   */
  submit?: string

  /** An user-facing title of the modal. (24 characters maximum) */
  title: string
}

const ModalBlocks = generateBlocksContainer({
  name: 'Modal',
  availableBlockTypes: {
    actions: generateActionsValidator(),
    context: true,
    divider: true,
    image: true,
    input: true,
    section: generateSectionValidator(),
  },
  aliases: {
    hr: Divider,
    img: Image,
    input: Input,
    section: Section,
    select: Select,
    textarea: Textarea,
  },
  typesToCheckMissingLabel: knownInputs,
})

const commonDefaultSubmit = plainText('Submit')

/**
 * The container component for the view of
 * {@link https://api.slack.com/surfaces/modals|modals}.
 *
 * `<Modal>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Context>`
 * - `<Actions>`
 * - `<Input>` (`<input>`)
 *
 * ...and these input components (Require defining `label` prop):
 *
 * - `<Input label="...">` (`<input label="...">`)
 * - `<Textarea label="...">` (`<textarea label="...">`)
 * - `<Select label="...">` (`<select label="...">`)
 * - `<ExternalSelect label="...">`
 * - `<UsersSelect label="...">`
 * - `<ConversationsSelect label="...">`
 * - `<ChannelsSelect label="...">`
 * - `<DatePicker label="...">`
 * - `<CheckboxGroup label="...">`
 * - `<RadioButtonGroup label="...">`
 *
 * @example
 * ```jsx
 * api.views.open({
 *   trigger_id: 'xxxxx.xxxxx.xxxxxxxxxxxx',
 *   view: (
 *     <Modal title="My first modal">
 *       <Section>Hello, modal!</Section>
 *     </Modal>
 *   ),
 * })
 * ```
 *
 * **NOTE**: TypeScript requires to cast JSX into suited type / `any`, or wrap
 * with `JSXSlack(<Modal>...</Modal>)`.
 *
 * @return The object of `view` payload, for `view` field in
 *   {@link https://api.slack.com/methods/views.open|views.open} and some
 *   similar APIs
 */
export const Modal = createComponent<ModalProps, View>('Modal', (props) => {
  let hasInput = false
  let submit: PlainTextElement | undefined
  let pmObject: Record<string, any> | undefined

  const children = JSXSlack.Children.toArray(props.children).reduce(
    (reducer: any[], child) => {
      if (JSXSlack.isValidElement(child)) {
        const { type, props: childProps } = child.$$jsxslack

        if (type === Input || type === 'input') {
          if (childProps.type === 'hidden') {
            pmObject = pmObject || {}
            pmObject[childProps.name] = childProps.value
            return reducer
          }
          if (childProps.type === 'submit') {
            submit = plainText(childProps.value)
            return reducer
          }
          hasInput = true
        }
      }
      if (typeof child === 'object') {
        if ((child as any).type === 'input') hasInput = true
        return [...reducer, child]
      }
      return reducer
    },
    []
  )

  if (!submit && hasInput) submit = commonDefaultSubmit

  const privateMetadata = (() => {
    if (typeof props.privateMetadata === 'string') return props.privateMetadata
    if (typeof props.privateMetadata === 'function')
      return props.privateMetadata(pmObject)

    return pmObject && JSON.stringify(pmObject)
  })()

  return {
    type: 'modal',
    title: plainText(props.title),
    callback_id: props.callbackId,
    external_id: props.externalId,
    submit: props.submit ? plainText(props.submit) : submit,
    close: props.close ? plainText(props.close) : undefined,
    private_metadata: privateMetadata,
    clear_on_close:
      props.clearOnClose !== undefined ? !!props.clearOnClose : undefined,
    notify_on_close:
      props.notifyOnClose !== undefined ? !!props.notifyOnClose : undefined,
    blocks: cleanMeta(<ModalBlocks children={children} />) as any[],
  }
})
