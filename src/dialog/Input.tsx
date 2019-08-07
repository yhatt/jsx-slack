/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { ObjectOutput, coerceToInteger } from '../utils'
import { Text, TextProps } from './Text'

interface InputPropsBase {
  children?: undefined
  hint?: string
  label: string
  maxLength?: number
  minLength?: number
  name: string
  placeholder?: string
  required?: boolean
  title?: string
  value?: string
}

interface TextInputProps extends InputPropsBase {
  type?: 'text'
}

interface EmailInputProps extends InputPropsBase {
  type: 'email'
}

interface NumberInputProps extends InputPropsBase {
  type: 'number'
}

interface TelInputProps extends InputPropsBase {
  type: 'tel'
}

interface UrlInputProps extends InputPropsBase {
  type: 'url'
}

interface HiddenInputProps {
  type: 'hidden'
  name: string
  value: any
}

interface SubmitInputProps {
  type: 'submit'
  value: string
}

type InputProps =
  | TextInputProps
  | EmailInputProps
  | NumberInputProps
  | TelInputProps
  | UrlInputProps
  | HiddenInputProps
  | SubmitInputProps

type InputElementInternal = HiddenInputProps | SubmitInputProps

// <Input> has an interface to keep compatibility with HTML as possible.
export const Input: JSXSlack.FC<InputProps> = props => {
  let subtype: TextProps['subtype'] | undefined

  switch (props.type) {
    case 'hidden':
    case 'submit':
      return <ObjectOutput<InputElementInternal> {...props} />

    case 'email':
    case 'number':
    case 'tel':
    case 'url':
      subtype = props.type

    // eslint-disable-next-line no-fallthrough
    default:
      return (
        <Text
          hint={props.hint}
          label={props.label}
          maxLength={coerceToInteger(props.maxLength)}
          minLength={coerceToInteger(props.minLength)}
          name={props.name}
          optional={!props.required}
          placeholder={props.placeholder}
          subtype={subtype}
          title={props.title}
          value={props.value}
        />
      )
  }
}
