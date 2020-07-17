import { PlainTextInput as SlackPlainTextInput } from '@slack/types'
import { createComponent } from '../../jsx'
import { plainText } from '../composition/utils'

export interface PlainTextInputProps {
  children?: never
  actionId?: string
  initialValue?: string
  maxLength?: number
  minLength?: number
  multiline?: boolean
  placeholder?: string
}

// NOTE: <PlainTextInput> is not public component
export const PlainTextInput = createComponent<
  PlainTextInputProps,
  SlackPlainTextInput
>('PlainTextInput', (props) => ({
  type: 'plain_text_input',
  action_id: props.actionId,
  placeholder:
    // Placeholder for input HTML element should disable emoji conversion
    props.placeholder
      ? plainText(props.placeholder, { emoji: false })
      : undefined,
  initial_value: props.initialValue,
  multiline: props.multiline,
  max_length: props.maxLength,
  min_length: props.minLength,
}))
