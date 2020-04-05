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
  values?: string[] | null
}

type CheckboxGroupProps = InputComponentProps<CheckboxGroupBaseProps>

export const CheckboxGroup: BuiltInComponent<CheckboxGroupProps> = createComponent<
  CheckboxGroupProps,
  Checkboxes | InputBlock
>('CheckboxGroup', (props) => {
  const initialOptions: CheckboxOption[] = []

  const values =
    props.values !== undefined
      ? ([] as Array<string | null>).concat(props.values)
      : undefined

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

      if (values !== undefined) {
        // eslint-disable-next-line dot-notation
        if (option['value'] && values.includes(option['value']))
          initialOptions.push(option as any)
      } else if (option[checkboxCheckedSymbol]) {
        initialOptions.push(option as any)
      }

      return true
    }
  )

  if (options.length === 0)
    throw new Error('<CheckboxGroup> must contain least of one <Checkbox>.')

  const checkboxes: Checkboxes = {
    type: 'checkboxes',
    action_id: props.actionId || props.name,
    options,
    initial_options: initialOptions.length > 0 ? initialOptions : undefined,
    confirm: props.confirm as any,
  }

  return wrapInInput(checkboxes, props, CheckboxGroup)
})
