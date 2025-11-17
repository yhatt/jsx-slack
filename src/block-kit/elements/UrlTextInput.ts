import type { URLInput, DispatchActionConfig } from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'

export interface UrlTextInputProps {
  children?: never
  actionId?: string
  initialValue?: string
  placeholder?: string
  dispatchActionConfig?: DispatchActionConfig
  focusOnLoad?: boolean
}

// NOTE: <UrlTextInput> is not public component
export const UrlTextInput = createComponent<UrlTextInputProps, URLInput>(
  'UrlTextInput',
  (props) => ({
    type: 'url_text_input',
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
