/** @jsx JSXSlack.h */
import { Dialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'

export interface TextProps {
  hint?: string
  label: string
  maxLength?: number
  minLength?: number
  name: string
  optional?: boolean
  placeholder?: string
  subtype?: TextElement['subtype']
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

export const Text: JSXSlack.FC<TextProps> = props => (
  <ObjectOutput<TextElement>
    hint={props.hint}
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
