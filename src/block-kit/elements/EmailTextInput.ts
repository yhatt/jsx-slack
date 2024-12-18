import type { EmailInput, DispatchActionConfig } from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'

export interface EmailTextInputProps {
  children?: never
  actionId?: string
  initialValue?: string
  placeholder?: string
  dispatchActionConfig?: DispatchActionConfig
  focusOnLoad?: boolean
}

// NOTE: <EmailTextInput> is not public component
export const EmailTextInput = createComponent<EmailTextInputProps, EmailInput>(
  'EmailTextInput',
  (props) => ({
    type: 'email_text_input',
    action_id: props.actionId,
    placeholder:
      // Placeholder for input HTML element should disable emoji conversion
      props.placeholder
        ? plainText(props.placeholder, { emoji: false })
        : undefined,
    initial_value: props.initialValue,
    dispatch_action_config: props.dispatchActionConfig,
    focus_on_load: props.focusOnLoad,
  }),
)
