/** @jsx JSXSlack.h */
import { Dialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { validateElement } from './Dialog'
import { DialogValidationError } from './error'

export interface TextareaProps {
  children?: undefined
  hint?: string
  label: string
  maxLength?: number
  minLength?: number
  name: string
  placeholder?: string
  required?: boolean // HTML compatible
  subtype?: TextareaElement['subtype']
  value?: string
}

export type TextareaElement = Pick<
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
> & { type: 'textarea' }

export const Textarea: JSXSlack.FC<TextareaProps> = props => {
  validateElement(props)

  if (typeof props.maxLength === 'number') {
    if (props.maxLength <= 0)
      throw new DialogValidationError(
        `Maximum length of textarea must be greater than zero but maxLength=${props.maxLength} was passed.`
      )

    if (props.maxLength > 3000)
      throw new DialogValidationError(
        `Maximum length of textarea must be up to 3000 but maxLength=${props.maxLength} was passed.`
      )
  }

  if (typeof props.minLength === 'number') {
    if (props.minLength < 0)
      throw new DialogValidationError(
        `Minimum length of textarea must be greater than or equal to zero but minLength=${props.minLength} was passed.`
      )

    if (props.minLength > 3000)
      throw new DialogValidationError(
        `Minimum length of textarea must be up to 3000 but minLength=${props.minLength} was passed.`
      )
  }

  if (props.hint && props.hint.length > 150)
    throw new DialogValidationError(
      `A hint string of textarea must be up to 150 characters but a string with ${props.hint.length} characters was passed.`
    )

  if (props.placeholder && props.placeholder.length > 150)
    throw new DialogValidationError(
      `A placeholder string of textarea must be up to 150 characters but a string with ${props.placeholder.length} characters was passed.`
    )

  if (props.value && props.value.length > 3000)
    throw new DialogValidationError(
      `A default value of textarea must be up to 3000 characters but a string with ${props.value.length} characters was passed.`
    )

  return (
    <ObjectOutput<TextareaElement>
      hint={props.hint}
      label={props.label}
      max_length={props.maxLength}
      min_length={props.minLength}
      name={props.name}
      optional={!props.required}
      placeholder={props.placeholder}
      subtype={props.subtype}
      type="textarea"
      value={props.value}
    />
  )
}
