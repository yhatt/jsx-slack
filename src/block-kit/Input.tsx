/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { JSXSlack, jsxOnParsed } from '../jsx'
import { ObjectOutput, coerceToInteger } from '../utils'
import { BlockComponentProps } from './Blocks'
import { plainText } from './composition/utils'
import { PlainTextInput } from './elements/PlainTextInput'

export interface InputCommonProps extends BlockComponentProps {
  hint?: string
  title?: string
  label: string
  required?: boolean
}

interface InputBlockProps extends InputCommonProps {
  children: JSXSlack.Node<{}>

  // Disallow defining attributes for component usage
  actionId?: undefined
  name?: undefined
  placeholder?: undefined
  value?: undefined
  maxLength?: undefined
  minLength?: undefined
}

interface InputComponentProps extends InputCommonProps {
  children?: undefined

  actionId?: string // => PlainTextInput.actionId
  name?: string // => PlainTextInput.actionId (Alias)
  placeholder?: string // => PlainTextInput.placeholder
  value?: string // => PlainTextInput.initialValue
  maxLength?: number // => PlainTextInput.maxLength
  minLength?: number // => PlainTextInput.minLength
}

export type InputProps = InputBlockProps | InputComponentProps
export type TextareaProps = InputComponentProps

export type WithInputProps<T> =
  | T & { [key in keyof InputCommonProps]?: undefined }
  | T & InputCommonProps

const knownInputs = [
  'channels_select',
  'conversations_select',
  'datepicker',
  'external_select',
  'multi_channels_select',
  'multi_conversations_select',
  'multi_external_select',
  'multi_static_select',
  'multi_users_select',
  'plain_text_input',
  'static_select',
  'users_select',
]

export const wrapInInput = (
  element: JSXSlack.Node<any>,
  props: InputCommonProps
) => (
  <Input
    blockId={props.blockId}
    children={element}
    hint={props.hint}
    id={props.id}
    label={props.label}
    required={props.required}
    title={props.title}
  />
)

const InputComponent: JSXSlack.FC<
  InputComponentProps & { multiline?: boolean }
> = props =>
  wrapInInput(
    <PlainTextInput
      actionId={props.actionId || props.name}
      initialValue={props.value}
      maxLength={coerceToInteger(props.maxLength)}
      minLength={coerceToInteger(props.minLength)}
      multiline={props.multiline}
      placeholder={props.placeholder}
    />,
    props
  )

export const Input: JSXSlack.FC<InputProps> = props => {
  if (props.children === undefined) return InputComponent(props)

  const hintText = props.hint || props.title
  const node = (
    <ObjectOutput<InputBlock>
      type="input"
      block_id={props.id || props.blockId}
      hint={hintText ? plainText(hintText) : undefined}
      label={plainText(props.label)}
      optional={!props.required}
      element={JSXSlack(props.children)}
    />
  )

  node.props[jsxOnParsed] = parsed => {
    // Check the final output
    if (!(parsed.element && knownInputs.includes(parsed.element.type)))
      throw new Error('A wrapped element in <Input> is invalid.')
  }

  return node
}

export const Textarea: JSXSlack.FC<TextareaProps> = props =>
  InputComponent({ ...props, multiline: true })
