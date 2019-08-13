/** @jsx JSXSlack.h */
import { Dialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { validateElement } from './Dialog'
import { DialogValidationError } from './error'

export interface TextProps {
  children?: undefined
  hint?: string
  label: string
  maxLength?: number
  minLength?: number
  name: string
  optional?: boolean
  placeholder?: string
  subtype?: TextElement['subtype']
  title?: string
  value?: string
}

export type TextElement = Pick<
  Dialog['elements'][0],
  | 'hint'
  | 'label'
  | 'max_length'
  | 'min_length'
  | 'name'
  | 'optional'
  | 'placeholder'
  | 'subtype'
  | 'type'
  | 'value'
> & { type: 'text' }

export const Text: JSXSlack.FC<TextProps> = props => {
  const validated = validateElement(props)

  if (typeof props.maxLength === 'number') {
    if (props.maxLength <= 0)
      throw new DialogValidationError(
        `Maximum length of text field must be greater than zero but maxLength=${props.maxLength} was passed.`
      )

    if (props.maxLength > 150)
      throw new DialogValidationError(
        `Maximum length of text field must be up to 150 but maxLength=${props.maxLength} was passed.`
      )
  }

  if (typeof props.minLength === 'number') {
    if (props.minLength <= 0)
      throw new DialogValidationError(
        `Minimum length of text field must be greater than zero but minLength=${props.minLength} was passed.`
      )

    if (props.minLength > 150)
      throw new DialogValidationError(
        `Minimum length of text field must be up to 150 but minLength=${props.minLength} was passed.`
      )
  }

  if (props.placeholder && props.placeholder.length > 150)
    throw new DialogValidationError(
      `A placeholder string of text field must be up to 150 characters but a string with ${props.placeholder.length} characters was passed.`
    )

  if (props.value && props.value.length > 150)
    throw new DialogValidationError(
      `A default value of text field must be up to 150 characters but a string with ${props.value.length} characters was passed.`
    )

  return (
    <ObjectOutput<TextElement>
      hint={validated.hint}
      label={props.label}
      max_length={props.maxLength}
      min_length={props.minLength}
      name={props.name}
      optional={props.optional}
      placeholder={props.placeholder}
      subtype={props.subtype}
      type="text"
      value={props.value}
    />
  )
}
