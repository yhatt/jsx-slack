/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { plainText } from '../composition/utils'
import { ActionProps } from '../elements/utils'
import { PlainTextInput } from '../elements/PlainTextInput'
import { resolveTagName } from '../utils'
import {
  JSXSlack,
  cleanMeta,
  createComponent,
  BuiltInComponent,
} from '../../jsx'
import { DistributedProps, coerceToInteger } from '../../utils'

interface InputLayoutProps extends LayoutBlockProps {
  children: JSXSlack.Node

  /** The label string for the interactive element. */
  label: string

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
   * @remarks
   * _This is only working in input components for `<Modal>` enabled by defining
   * `label` prop._
   */
  blockId?: string

  /**
   * Set `label` prop for the implicit parent `input` layout block, to display
   * the label string.
   *
   * @remarks
   * Please notice that this prop is **always required** in input components for
   * `<Modal>`, and _**never** in interactive elements for `<Section>` and
   * `<Actions>`._
   */
  label: string

  /**
   * Set a helpful text appears under the element.
   *
   * @remarks
   * _This is only working in input components for `<Modal>` enabled by defining
   * `label` prop._
   */
  hint?: string

  /**
   * Set whether any value must be filled when user confirms modal.
   *
   * @remarks
   * _This is only working in input components for `<Modal>` enabled by defining
   * `label` prop._
   *
   * HTML-compatible `required` prop means reversed `optional` field in Slack
   * API. _Please notice jsx-slack's default `required: false` is different from
   * Slack's default `optional: false`._
   */
  required?: boolean
}

export interface InputTextProps extends InputComponentBaseProps, ActionProps {
  children?: never
  type?: 'text'
  maxLength?: number
  minLength?: number
  placeholder?: string
  value?: string
}

interface InputHiddenProps {
  children?: never
  type: 'hidden'
  name: string
  value: any
}

interface InputSubmitProps {
  children?: never
  type: 'submit'
  value: string
}

export type InputComponentProps<
  P extends {},
  T extends {} = {}
> = DistributedProps<P | (P & InputComponentBaseProps & T)>

export type InputProps = DistributedProps<
  InputLayoutProps | InputTextProps | InputHiddenProps | InputSubmitProps
>

export const knownInputs = [
  'channels_select',
  'checkboxes',
  'conversations_select',
  'datepicker',
  'external_select',
  'multi_channels_select',
  'multi_conversations_select',
  'multi_external_select',
  'multi_static_select',
  'multi_users_select',
  'plain_text_input',
  'radio_buttons',
  'static_select',
  'users_select',
]

const ElementValidator = ({ element, from }): any => {
  if (typeof element !== 'object')
    throw new Error(
      `${from} has invalid value as an element of input layout block.`
    )

  if (!knownInputs.includes(element.type)) {
    const generator = resolveTagName(element)

    throw new Error(
      `${from} has detected an invalid type as the element of input layout block: "${
        element.type
      }"${generator ? ` (Provided by ${generator})` : ''}`
    )
  }

  return cleanMeta(element)
}

export const wrapInInput = <T extends object>(
  obj: T,
  props: Omit<Partial<InputLayoutProps>, 'children'>,
  generatedFrom?: BuiltInComponent<any>
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
    />
  )

  if (props.label) {
    const hint = props.hint || props.title

    return {
      type: 'input',
      block_id: props.blockId || props.id,
      label: plainText(props.label),
      hint: hint ? plainText(hint) : undefined,
      optional: !props.required,
      element,
    }
  }

  return obj
}

/**
 * {@link https://api.slack.com/reference/messaging/blocks#input|The `input` layout block}
 * to insert the element for input.
 *
 * @return The partial JSON for `input` layout block
 */
export const Input: BuiltInComponent<InputProps> = createComponent<
  InputProps,
  InputBlock | {}
>('Input', (props) => {
  if (props.type === 'hidden' || props.type === 'submit') return {}

  return wrapInInput(
    props.children ||
      cleanMeta(
        <PlainTextInput
          actionId={props.actionId || props.name}
          initialValue={props.value}
          maxLength={coerceToInteger(props.maxLength)}
          minLength={coerceToInteger(props.minLength)}
          placeholder={props.placeholder}
        />
      ),
    props,
    Input
  )
})
