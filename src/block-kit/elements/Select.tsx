/* eslint-disable dot-notation */
/** @jsx createElementInternal */
import { StaticSelect, MultiStaticSelect, InputBlock } from '@slack/types'
import {
  ActionProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
} from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { OptionComposition } from '../composition/Option'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import {
  SelectFragmentInternal as SelectFragment,
  SelectFragmentObject,
  selectFragmentSelectedOptionsSymbol,
} from '../other/SelectFragment'
import { JSXSlackError } from '../../error'
import {
  JSXSlack,
  BuiltInComponent,
  createComponent,
  createElementInternal,
  isValidElementFromComponent,
} from '../../jsx'
import { coerceToInteger } from '../../utils'

interface SingleSelectProps
  extends ActionProps,
    ConfirmableProps,
    SingleSelectableProps {
  children: JSXSlack.ChildNodes

  /** The placeholder text shown in select field. */
  placeholder?: string

  /**
   * A value of the initially selected option.
   *
   * It must choose a string of `value` prop from defined `<Option>` elements in
   * children. If not defined, an inital option will follow the state of
   * `<Option selected>`.
   */
  value?: string | null
}

interface MultiSelectProps
  extends MultiSelectablePropsFrom<SingleSelectProps, 'value'> {
  /** In multiple select, you can choose multiple values through array. */
  value?: string | string[] | null
}

export type SelectProps = InputComponentProps<
  SingleSelectProps | MultiSelectProps
>

/**
 * The interactive component or input component for
 * {@link https://api.slack.com/reference/block-kit/block-elements#static_select the `static_select` block element} and
 * {@link https://api.slack.com/reference/block-kit/block-elements#static_multi_select the `multi_static_select` block element}.
 *
 * Provide a menu element with static options by the similar interface to
 * `<select>` HTML element. It must contain elements either of `<Option>` or
 * `<Optgroup>` as immediate children.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <Select actionId="rating" placeholder="Rate it!">
 *       <Option value="5">5 {':star:'.repeat(5)}</Option>
 *       <Option value="4">4 {':star:'.repeat(4)}</Option>
 *       <Option value="3">3 {':star:'.repeat(3)}</Option>
 *       <Option value="2">2 {':star:'.repeat(2)}</Option>
 *       <Option value="1">1 {':star:'.repeat(1)}</Option>
 *     </Select>
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for selecting from static
 *   options, or `input` layout block with it
 */
export const Select: BuiltInComponent<SelectProps> = createComponent<
  SelectProps,
  StaticSelect | MultiStaticSelect | InputBlock
>('Select', (props) => {
  const fragment: SelectFragmentObject = ((): any => {
    if (isValidElementFromComponent(props.children, SelectFragment))
      return props.children

    return <SelectFragment from={Select} children={props.children} />
  })()

  if (fragment['options'] && fragment['options'].length === 0)
    throw new JSXSlackError(
      '<Select> must contain least of one <Option> or <Optgroup>.',
      props['__source']
    )

  const initialOptions: OptionComposition[] =
    props.value === undefined
      ? fragment[selectFragmentSelectedOptionsSymbol] || []
      : ((v) => {
          const opts: OptionComposition[] =
            (fragment as any).options ||
            [].concat(...(fragment as any).option_groups.map((g) => g.options))

          const values = ([] as Array<string | null>).concat(v)

          return opts.filter((o) => values.includes(o.value))
        })(props.value)

  const action_id = props.actionId || props.name
  const placeholder =
    props.placeholder !== undefined ? plainText(props.placeholder) : undefined

  return wrapInInput<StaticSelect | MultiStaticSelect>(
    props.multiple
      ? {
          type: 'multi_static_select',
          action_id,
          placeholder,
          ...fragment,
          initial_options:
            initialOptions.length > 0 ? initialOptions : undefined,
          max_selected_items: coerceToInteger(props.maxSelectedItems),
          confirm: props.confirm as any,
        }
      : {
          type: 'static_select',
          action_id,
          placeholder,
          ...fragment,
          initial_option:
            initialOptions.length > 0
              ? initialOptions[initialOptions.length - 1]
              : undefined,
          confirm: props.confirm as any,
        },
    props,
    Select
  )
})
