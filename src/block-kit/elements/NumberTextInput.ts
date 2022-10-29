import {
  PlainTextInput as SlackPlainTextInput,
  DispatchActionConfig,
} from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'

// TODO: Use official type when it was available in `@slack/types`
interface SlackNumberTextInput
  extends Omit<
    SlackPlainTextInput,
    'max_length' | 'min_length' | 'multiline' | 'type'
  > {
  type: 'number_input'
  is_decimal_allowed: boolean
  max_value?: string
  min_value?: string
}

export interface NumberTextInputProps {
  children?: never
  actionId?: string
  initialValue?: string
  placeholder?: string
  isDecimalAllowed?: boolean
  maxValue?: string
  minValue?: string
  dispatchActionConfig?: DispatchActionConfig
  focusOnLoad?: boolean
}

// NOTE: <NumberTextInput> is not public component
export const NumberTextInput = createComponent<
  NumberTextInputProps,
  SlackNumberTextInput
>('NumberTextInput', (props) => ({
  type: 'number_input',
  action_id: props.actionId,
  placeholder:
    // Placeholder for input HTML element should disable emoji conversion
    props.placeholder
      ? plainText(props.placeholder, { emoji: false })
      : undefined,
  is_decimal_allowed: props.isDecimalAllowed ?? false,
  min_value: props.minValue,
  max_value: props.maxValue,
  initial_value: props.initialValue,
  dispatch_action_config: props.dispatchActionConfig,
  focus_on_load: props.focusOnLoad,
}))
