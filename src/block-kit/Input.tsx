/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
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

type InputProps = InputBlockProps | InputComponentProps
type TextareaProps = InputComponentProps

export type WithInputProps<T> =
  | T & { [key in keyof InputCommonProps]?: undefined }
  | T & InputCommonProps

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

  return (
    <ObjectOutput<InputBlock>
      type="input"
      block_id={props.id || props.blockId}
      hint={hintText ? plainText(hintText) : undefined}
      label={plainText(props.label)}
      optional={!props.required}
      element={JSXSlack(props.children)}
    />
  )
}

export const Textarea: JSXSlack.FC<TextareaProps> = props =>
  InputComponent({ ...props, multiline: true })
