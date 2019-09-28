/** @jsx JSXSlack.h */
import { InputBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import { plainText } from './composition/utils'
import { PlainTextInput } from './interactive/PlainTextInput'

interface InputBlockProps extends BlockComponentProps {
  children: JSXSlack.Node<{}>
  hint?: string
  label: string
  required?: boolean
}

interface InputComponentProps extends Omit<InputBlockProps, 'children'> {
  children?: undefined
  title?: string // => InputBlockProps.hint (Alias)
  actionId?: string // => PlainTextInput.actionId
  name?: string // => PlainTextInput.actionId (Alias)
  placeholder?: string // => PlainTextInput.placeholder
  value?: string // => PlainTextInput.initialValue
  maxLength?: number // => PlainTextInput.maxLength
  minLength?: number // => PlainTextInput.minLength
}

type InputProps = InputBlockProps | InputComponentProps

export const Input: JSXSlack.FC<InputProps> = props => {
  if (props.children === undefined) return InputComponent(props)

  return (
    <ObjectOutput<InputBlock>
      type="input"
      block_id={props.id || props.blockId}
      hint={props.hint ? plainText(props.hint) : undefined}
      label={plainText(props.label)}
      optional={!props.required}
      element={JSXSlack(props.children)}
    />
  )
}

const InputComponent: JSXSlack.FC<InputComponentProps> = props => (
  <Input
    blockId={props.blockId}
    hint={props.hint || props.title}
    id={props.id}
    label={props.label}
    required={props.required}
  >
    <PlainTextInput
      actionId={props.actionId || props.name}
      initialValue={props.value}
      maxLength={props.maxLength}
      minLength={props.minLength}
      placeholder={props.placeholder}
    />
  </Input>
)
