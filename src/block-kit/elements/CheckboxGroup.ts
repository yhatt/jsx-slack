import { Checkboxes as CheckboxesElement, InputBlock } from '@slack/types'
import { Checkbox, CheckboxOption, checkboxCheckedSymbol } from './Checkbox'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { resolveTagName } from '../utils'
import { JSXSlack, BuiltInComponent, createComponent } from '../../jsx'

interface Checkboxes
  extends Omit<CheckboxesElement, 'options' | 'initial_options'> {
  options: CheckboxOption[]
  initial_options?: CheckboxOption[]
}

interface CheckboxGroupBaseProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes
  values?: string[]
}

type CheckboxGroupProps = InputComponentProps<CheckboxGroupBaseProps>

export const CheckboxGroup: BuiltInComponent<CheckboxGroupProps> = createComponent<
  CheckboxGroupProps,
  Checkboxes | InputBlock
>('CheckboxGroup', (props) => {
  const states = new Map<string, boolean>()
  const values = props.values || []

  const options = JSXSlack.Children.toArray(props.children).filter(
    (option): option is CheckboxOption => {
      if (!JSXSlack.isValidElement(option)) return false

      if (option.$$jsxslack.type !== Checkbox) {
        const tag = resolveTagName(option)
        throw new Error(
          `<CheckboxGroup> must contain only <Checkbox>${
            tag ? ` but it is included ${tag}` : ''
          }.`
        )
      }

      const { value } = option as any

      if (value) {
        if (option[checkboxCheckedSymbol] !== undefined) {
          states.set(value, !!option[checkboxCheckedSymbol])
        } else if (values.includes(value)) {
          states.set(value, true)
        }
      }

      return true
    }
  )

  if (options.length === 0)
    throw new Error('<CheckboxGroup> must include least of one <Checkbox>.')

  const initialOptions = options.reduce(
    (reduced: CheckboxOption[], opt) =>
      opt.value && states.get(opt.value) ? [...reduced, opt] : reduced,
    []
  )

  const checkboxes: Checkboxes = {
    type: 'checkboxes',
    action_id: props.actionId || props.name,
    options,
    initial_options: initialOptions.length > 0 ? initialOptions : undefined,
    confirm: props.confirm as any,
  }

  return wrapInInput(checkboxes, props, CheckboxGroup)
})
