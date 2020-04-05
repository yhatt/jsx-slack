import { RadioButtons as RadioButtonsElement, InputBlock } from '@slack/types'
import {
  RadioButton,
  RadioButtonOption,
  radioButtonCheckedSymbol,
} from './RadioButton'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { resolveTagName } from '../utils'
import { JSXSlack, BuiltInComponent, createComponent } from '../../jsx'

interface RadioButtons
  extends Omit<RadioButtonsElement, 'options' | 'initial_option'> {
  options: RadioButtonOption[]
  initial_option?: RadioButtonOption
}

interface RadioButtonGroupBaseProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes
  value?: string | null
}

type RadioButtonGroupProps = InputComponentProps<RadioButtonGroupBaseProps>

export const RadioButtonGroup: BuiltInComponent<RadioButtonGroupProps> = createComponent<
  RadioButtonGroupProps,
  RadioButtons | InputBlock
>('RadioButtonGroup', (props) => {
  let initialOption: RadioButtonOption | undefined

  const options = JSXSlack.Children.toArray(props.children).filter(
    (option): option is RadioButtonOption => {
      if (!JSXSlack.isValidElement(option)) return false

      if (option.$$jsxslack.type !== RadioButton) {
        const tag = resolveTagName(option)
        throw new Error(
          `<RadioButtonGroup> must contain only <RadioButton>${
            tag ? ` but it is included ${tag}` : ''
          }.`
        )
      }

      if (option[radioButtonCheckedSymbol]) initialOption = option as any

      return true
    }
  )

  if (options.length === 0)
    throw new Error(
      '<RadioButtonGroup> must contain least of one <RadioButton>.'
    )

  const radioButtons: RadioButtons = {
    type: 'radio_buttons',
    action_id: props.actionId || props.name,
    options,
    initial_option:
      props.value !== undefined
        ? options.find((opt) => opt.value === props.value)
        : initialOption,
    confirm: props.confirm as any,
  }

  return wrapInInput(radioButtons, props, RadioButtonGroup)
})
