import { Checkboxes as CheckboxesElement, InputBlock } from '@slack/types'
import { ActionProps } from './utils'
import {
  Checkbox,
  CheckboxOption,
  checkboxCheckedSymbol,
} from '../composition/Checkbox'
import { ConfirmableProps } from '../composition/Confirm'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { resolveTagName } from '../utils'
import { JSXSlackError } from '../../error'
import { JSXSlack, BuiltInComponent, createComponent } from '../../jsx'

interface Checkboxes
  extends Omit<CheckboxesElement, 'options' | 'initial_options'> {
  options: CheckboxOption[]
  initial_options?: CheckboxOption[]
}

interface CheckboxGroupBaseProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes

  /**
   * An array of values for initially selected checkboxes.
   *
   * They must choose a string of `value` prop from defined `<Checkbox>`
   * elements in children. If not defined, initally checked states will follow
   * the state of `<Checkbox checked>`.
   */
  values?: string[] | null
}

type CheckboxGroupProps = InputComponentProps<CheckboxGroupBaseProps>

/**
 * The interactive component or input component for
 * {@link https://api.slack.com/reference/block-kit/block-elements#checkboxes the `checkboxes` block element}.
 *
 * Provide the container to choose multiple options supplied by `<Checkbox>`.
 *
 * _This component is available only in `<Modal>` and `<Home>` container, and
 * cannot use in `<Blocks>` container for messaging._
 *
 * @example
 * ```jsx
 * <Modal title="Quick survey">
 *   <CheckboxGroup
 *     blockId="foods"
 *     actionId="foods"
 *     label="What do you want to eat for the party in this Friday?"
 *     required
 *   >
 *     <Checkbox value="burger">Burger :hamburger:</Checkbox>
 *     <Checkbox value="pizza">Pizza :pizza:</Checkbox>
 *     <Checkbox value="taco">Tex-Mex taco :taco:</Checkbox>
 *     <Checkbox value="sushi">Sushi :sushi:</Checkbox>
 *     <Checkbox value="others">
 *       Others
 *       <small>
 *         <i>Let me know in a message!</i>
 *       </small>
 *     </Checkbox>
 *   </CheckboxGroup>
 * </Modal>
 * ```
 *
 * @return The partial JSON of a block element for the container of checkboxes,
 *   or `input` layout block with it
 */
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
        throw new JSXSlackError(
          `<CheckboxGroup> must contain only <Checkbox>${
            tag ? ` but it is included ${tag}` : ''
          }.`,
          option
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
    throw new JSXSlackError(
      '<CheckboxGroup> must contain least of one <Checkbox>.',
      props['__source'] // eslint-disable-line dot-notation
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
