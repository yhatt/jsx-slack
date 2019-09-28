/** @jsx JSXSlack.h */
import { PlainTextInput as SlackPlainTextInput } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { plainText } from '../composition/utils'

export interface PlainTextInputProps {
  actionId?: string
  children?: undefined
  placeholder?: string
  initialValue?: string
  multiline?: boolean
  maxLength?: number
  minLength?: number
}

export const PlainTextInput: JSXSlack.FC<PlainTextInputProps> = props => (
  <ObjectOutput<SlackPlainTextInput>
    type="plain_text_input"
    action_id={props.actionId}
    placeholder={
      // Placeholder for input HTML element should disable emoji conversion
      props.placeholder
        ? plainText(props.placeholder, { emoji: false })
        : undefined
    }
    initial_value={props.initialValue}
    multiline={props.multiline}
    max_length={props.maxLength}
    min_length={props.minLength}
  />
)
