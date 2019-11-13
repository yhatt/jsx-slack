/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { DistributedProps, ObjectOutput, coerceToInteger } from '../utils'
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
  type?: undefined
}

interface InputComponentProps extends InputCommonProps {
  children?: undefined
  type?: 'text'
  actionId?: string //    => PlainTextInput.actionId
  name?: string //        => PlainTextInput.actionId (Alias)
  placeholder?: string // => PlainTextInput.placeholder
  value?: string //       => PlainTextInput.initialValue
  maxLength?: number //   => PlainTextInput.maxLength
  minLength?: number //   => PlainTextInput.minLength
}

interface InputHiddenProps {
  children?: undefined
  type: 'hidden'
  name: string
  value: any
}

interface InputSubmitProps {
  children?: undefined
  type: 'submit'
  value: string
}

type InputPropsBase =
  | InputBlockProps
  | InputComponentProps
  | InputHiddenProps
  | InputSubmitProps

export type InputProps = DistributedProps<InputPropsBase>
export type TextareaProps = Omit<InputComponentProps, 'type'>

// Helper type for input components
export type WithInputProps<T> = DistributedProps<T | (T & InputCommonProps)>

export const internalHiddenType = Symbol('jsx-slack-input-internal-hidden-type')
export const internalSubmitType = Symbol('jsx-slack-input-internal-submit-type')

export interface InternalHiddenObject {
  type: typeof internalHiddenType
  name: string
  value: any
}

export interface InternalSubmitObject {
  type: typeof internalSubmitType
  value: string
}

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

const InputComponent: JSXSlack.FC<InputComponentProps & {
  multiline?: boolean
}> = props =>
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
  if (props.children === undefined) {
    switch (props.type) {
      case 'hidden':
        return (
          <ObjectOutput<InternalHiddenObject>
            type={internalHiddenType}
            name={props.name}
            value={props.value}
          />
        )
      case 'submit':
        return (
          <ObjectOutput<InternalSubmitObject>
            type={internalSubmitType}
            value={props.value}
          />
        )
      default:
        return InputComponent(props)
    }
  }

  const hintText = props.hint || props.title
  const element = JSXSlack(props.children)

  if (!(typeof element === 'object' && knownInputs.includes(element.type)))
    throw new Error('A wrapped element in <Input> is invalid.')

  return (
    <ObjectOutput<InputBlock>
      type="input"
      block_id={props.id || props.blockId}
      hint={hintText ? plainText(hintText) : undefined}
      label={plainText(props.label)}
      optional={!props.required}
      element={element}
    />
  )
}

export const Textarea: JSXSlack.FC<TextareaProps> = props =>
  InputComponent({ ...props, multiline: true })
