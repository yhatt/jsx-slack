/** @jsx JSXSlack.h */
import { Dialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'

export interface TextareaProps {
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

export const Textarea: JSXSlack.FC<TextareaProps> = props => (
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
