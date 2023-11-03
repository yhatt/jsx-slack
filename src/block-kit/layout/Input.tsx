/** @jsx createElementInternal */
import { InputBlock } from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack } from '../../jsx'
import {
  cleanMeta,
  createComponent,
  createElementInternal,
  BuiltInComponent,
} from '../../jsx-internals'
import { DistributedProps, coerceToString, coerceToInteger } from '../../utils'
import {
  plainText,
  inputDispatchActionConfig,
  InputDispatchActionProps,
} from '../composition/utils'
import { EmailTextInput } from '../elements/EmailTextInput'
import { NumberTextInput } from '../elements/NumberTextInput'
import { PlainTextInput } from '../elements/PlainTextInput'
import { UrlTextInput } from '../elements/UrlTextInput'
import {
  ActionProps,
  AutoFocusibleProps,
  focusOnLoadFromProps,
} from '../elements/utils'
import { resolveTagName } from '../utils'
import { LayoutBlockProps } from './utils'

interface InputLayoutProps extends LayoutBlockProps {
  children: JSXSlack.Node

  /** The label string for the interactive element. */
  label: string

  /**
   * By setting `true`, the input element will dispatch
   * [`block_actions` payload](https://api.slack.com/reference/interaction-payloads/block-actions)
   * when used this.
   */
  dispatchAction?: boolean

  /** Set a helpful text appears under the element. */
  hint?: string

  /** A HTML-compatible alias into `hint` prop. */
  title?: string

  /**
   * Set whether any value must be filled when user confirms modal.
   *
   * @remarks
   * HTML-compatible `required` prop means reversed `optional` field in Slack
   * API. _Please notice jsx-slack's default `required: false` is different from
   * Slack's default `optional: false`._
   */
  required?: boolean
}

interface InputComponentBaseProps extends Omit<InputLayoutProps, 'children'> {
  /**
   * A string of unique identifier for the implicit parent `input` layout block.
   *
   * @input-component-remarks
   * _This is only working in input components enabled by defining `label` prop._
   */
  blockId?: string

  /**
   * By setting `true`, the input element will dispatch
   * [`block_actions` payload](https://api.slack.com/reference/interaction-payloads/block-actions)
   * when used this.
   *
   * @input-component-remarks
   * _This is only working in input components enabled by defining `label` prop._
   */
  dispatchAction?: boolean

  /**
   * Set `label` prop for the implicit parent `input` layout block, to display
   * the label string.
   *
   * @input-component-remarks
   * Please notice that this prop is **always required** in input components,
   * and _**never** in interactive elements for `<Section>` and `<Actions>`._
   */
  label: string

  /**
   * Set a helpful text appears under the element.
   *
   * @input-component-remarks
   * _This is only working in input components enabled by defining `label` prop._
   */
  hint?: string

  /**
   * Set whether any value must be filled when user confirms modal.
   *
   * @input-component-remarks
   * _This is only working in input components enabled by defining `label` prop._
   *
   * HTML-compatible `required` prop means reversed `optional` field in Slack
   * API. _Please notice jsx-slack's default `required: false` is different from
   * Slack's default `optional: false`._
   */
  required?: boolean
}

interface InputTextBaseProps
  extends Omit<InputComponentBaseProps, 'dispatchAction'>,
    ActionProps,
    AutoFocusibleProps,
    InputDispatchActionProps {
  children?: never

  /**
   * The placeholder text shown in empty text field.
   *
   * Please notice the text input element cannot use emoji shorthand unlike the
   * other many plain text fields.
   */
  placeholder?: string

  /**
   * The _initial_ value of the input element.
   *
   * This prop would rather similar to `defaultValue` than `value` in React. A
   * defined value would be filled to the element only when the view was opened.
   * [`views.update`](https://api.slack.com/methods/views.update) cannot
   * update the text changed by user even if changed this prop.
   *
   * @remark
   * If `type` prop is `url`, `email`, or `number`, an initial value should be a
   * valid string for the type.
   */
  value?: string
}

export interface InputTextProps extends InputTextBaseProps {
  /**
   * Select input type from `text`, `url`, `email`, `number`, `hidden`, and
   * `submit`.
   *
   * The default type is `text`, for the input layout block with single-text
   * element.
   */
  type?: 'text'

  /**
   * Set the maximum number of characters user can enter into the text element.
   */
  maxLength?: number

  /**
   * Set the minimum number of characters user can enter into the text element.
   */
  minLength?: number
}

export interface InputURLProps extends InputTextBaseProps {
  type: 'url'
}

export interface InputEmailProps extends InputTextBaseProps {
  type: 'email'
}

export interface InputNumberProps extends Omit<InputTextBaseProps, 'value'> {
  type: 'number'
  value?: number | string

  /**
   * @doc-input-number
   * Set whether the number input element accepts decimal fractions. The default
   * value is `false`.
   */
  decimal?: boolean

  /**
   * @doc-input-number
   * The maximum value to accept for this number input.
   */
  max?: number | string

  /**
   * @doc-input-number
   * The minimum value to accept for this number input.
   */
  min?: number | string
}

interface InputHiddenProps {
  children?: never
  type: 'hidden'

  /**
   * @doc-input-hidden
   * A key of private metadata JSON to store.
   */
  name: string

  /**
   * @doc-input-hidden
   * A value of private metadata JSON to store.
   *
   * It must be able to serializable into JSON (except while using custom
   * transformer in the container).
   * */
  value: any
}

interface InputSubmitProps {
  children?: never
  type: 'submit'

  /**
   * @doc-input-submit
   * The label string of submit button for the modal.
   *
   * If the parent `<Modal>` has defined `submit` prop, this value will ignore.
   */
  value: string
}

export type InputComponentProps<
  P extends {}, // eslint-disable-line @typescript-eslint/ban-types
  T extends {} = {}, // eslint-disable-line @typescript-eslint/ban-types
> = DistributedProps<P | (P & InputComponentBaseProps & T)>

export type InputProps = DistributedProps<
  | InputLayoutProps
  | InputTextProps
  | InputURLProps
  | InputEmailProps
  | InputNumberProps
  | InputHiddenProps
  | InputSubmitProps
>

export const knownInputs = [
  'channels_select',
  'checkboxes',
  'conversations_select',
  'datepicker',
  'datetimepicker',
  'email_text_input',
  'external_select',
  'multi_channels_select',
  'multi_conversations_select',
  'multi_external_select',
  'multi_static_select',
  'multi_users_select',
  'number_input',
  'plain_text_input',
  'radio_buttons',
  'static_select',
  'timepicker',
  'url_text_input',
  'users_select',
]

const ElementValidator = ({ element, from }): any => {
  if (typeof element !== 'object')
    throw new JSXSlackError(
      `${from} has invalid value as an element of input layout block.`,
    )

  if (!knownInputs.includes(element.type)) {
    const generator = resolveTagName(element)

    throw new JSXSlackError(
      `${from} has detected an invalid type as the element of input layout block: "${
        element.type
      }"${generator ? ` (Provided by ${generator})` : ''}`,
      element,
    )
  }

  return cleanMeta(element)
}

export const wrapInInput = <T extends object>(
  obj: T,
  props: Omit<Partial<InputLayoutProps>, 'children'>,
  generatedFrom?: BuiltInComponent<any>,
): T | InputBlock => {
  // Require to pass through the element into JSX for normalize as JSON certainly
  const element: any = cleanMeta(
    <ElementValidator
      element={obj}
      from={
        generatedFrom
          ? `<${generatedFrom.$$jsxslackComponent.name}>`
          : 'Input layout block'
      }
    />,
  )

  if (props.label) {
    const hint = props.hint || props.title

    return {
      type: 'input',
      block_id: props.blockId || props.id,
      label: plainText(props.label),
      hint: hint ? plainText(hint) : undefined,
      optional: !props.required,
      dispatch_action:
        props.dispatchAction !== undefined ? !!props.dispatchAction : undefined,
      element,
    }
  }

  return obj
}

/**
 * `<Input>` has various usages: Input component for single text element,
 * helpers for the container, and Slack-style
 * [`input` layout block](https://api.slack.com/reference/messaging/blocks#input).
 *
 * It should place on immidiate children of container component.
 *
 * ---
 *
 * ### Input component for single-text
 *
 * `<Input label="..." />` means the input component for single text element and
 * will render `input` layout block containing with single-line text input.
 *
 * It has an interface very similar to `<input>` HTML element, but an important
 * difference is to require defining `label` prop.
 *
 * ```jsx
 * <Modal title="My App">
 *  <Input label="Title" type="text" name="title" maxLength={80} required />
 *  <Input label="URL" type="url" name="url" placeholder="https://..." />
 *  <Input label="Email" type="email" name="email" required />
 *  <Input label="Number" type="number" name="num" required min={1} max={100} />
 * </Modal>
 * ```
 *
 * ---
 *
 * ### Store hidden values to modal and home tab
 *
 * `<Input type="hidden" />` can assign hidden values for the private metadata
 * JSON of `<Modal>` and `<Home>` with a familiar way in HTML form.
 *
 * ```jsx
 * <Modal title="modal">
 *  <Input type="hidden" name="foo" value="bar" />
 *  <Input type="hidden" name="userId" value={123} />
 *  <Input type="hidden" name="data" value={[{ hidden: 'value' }]} />
 * </Modal>
 * ```
 *
 * Take care that the maximum length validation by Slack will still apply for
 * stringified JSON. The value like string and array that cannot predict the
 * length might over the limit of JSON string length easily (3000 characters).
 *
 * The best practice is only storing the value of a pointer to reference data
 * stored elsewhere. It's better not to store complex data as hidden value
 * directly.
 *
 * When the parent `<Modal>` or `<Home>` has assigned `privateMetadata` prop,
 * hidden values may override by assigned string or manipulate through the
 * custom transformer.
 *
 * ---
 *
 * ### Set the label of submit button for modal
 *
 * `<Input type="submit" />` can set the label of submit button for the current
 * modal. It's meaning just an alias into `submit` prop of `<Modal>`, but JSX
 * looks like more natural HTML form.
 *
 * ```jsx
 * <Modal title="Example">
 *  <Input name="name" label="Name" />
 *  <Input type="submit" value="Send" />
 * </Modal>
 * ```
 * ---
 *
 * ### Slack-style `input` layout block
 *
 * `<Input>` also can render
 * [`input` layout block](https://api.slack.com/reference/messaging/blocks#input)
 * as same usage as other components for Slack layout block. Please place one of
 * the available interactive component as a child.
 *
 * ```jsx
 * <Modal title="Register" submit="OK" close="Cancel">
 *  <Input label="User" title="Please select user." required>
 *    <UsersSelect placeholder="Choose user..." />
 *  </Input>
 * </Modal>
 * ```
 *
 * #### Available interactive components
 *
 * - `<Select>`
 * - `<ExternalSelect>`
 * - `<UsersSelect>`
 * - `<ConversationsSelect>` *
 * - `<ChannelsSelect>` *
 * - `<DatePicker>`
 * - `<TimePicker>`
 * - `<DateTimePicker>`
 * - `<CheckboxGroup>`
 * - `<RadioButtonGroup>`
 *
 * __*__: Some components have unique properties only for input components. You
 * cannot define them to the interactive component wrapped in `<Input>` layout
 * block because TypeScript would throw error while compile.
 *
 * **NOTE**: _We usually recommend to use input components instead of using
 * `<Input>` layout block._ This usage is provided for user that want templating
 * with Slack API style rather than HTML style.
 *
 * @return The partial JSON for `input` layout block or internal JSX element
 */
export const Input: BuiltInComponent<InputProps> = createComponent<
  InputProps,
  InputBlock | {} // eslint-disable-line @typescript-eslint/ban-types
>('Input', (props) => {
  if (props.type === 'hidden' || props.type === 'submit') return {}

  return wrapInInput(
    props.children ||
      cleanMeta(
        (() => {
          const baseProps = {
            actionId: props.actionId || props.name,
            placeholder: props.placeholder,
            dispatchActionConfig: inputDispatchActionConfig(props),
            focusOnLoad: focusOnLoadFromProps(props),
          }

          if (props.type === 'url') {
            return (
              <UrlTextInput
                {...baseProps}
                // Empty string seems not to be allowed as initial value
                initialValue={coerceToString(props.value) || undefined}
              />
            )
          } else if (props.type === 'email') {
            return (
              <EmailTextInput
                {...baseProps}
                initialValue={coerceToString(props.value) || undefined}
              />
            )
          } else if (props.type === 'number') {
            return (
              <NumberTextInput
                {...baseProps}
                initialValue={coerceToString(props.value) || undefined}
                isDecimalAllowed={
                  props.decimal === undefined ? undefined : !!props.decimal
                }
                maxValue={coerceToString(props.max)}
                minValue={coerceToString(props.min)}
              />
            )
          } else {
            return (
              <PlainTextInput
                {...baseProps}
                initialValue={props.value}
                maxLength={coerceToInteger(props.maxLength)}
                minLength={coerceToInteger(props.minLength)}
              />
            )
          }
        })(),
      ),
    {
      ...props,
      dispatchAction:
        props.dispatchAction === undefined ? undefined : !!props.dispatchAction,
    },
    Input,
  )
})
