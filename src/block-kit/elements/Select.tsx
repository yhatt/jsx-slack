/** @jsx JSXSlack.h */
import { StaticSelect, MultiStaticSelect, InputBlock } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { OptionComposition } from '../composition/Option'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import {
  SelectFragmentInternal as SelectFragment,
  SelectFragmentObject,
  selectFragmentSelectedOptionsSymbol,
} from '../other/SelectFragment'
import {
  JSXSlack,
  BuiltInComponent,
  createComponent,
  isValidElementFromComponent,
} from '../../jsx'
import { flattenDeep } from '../../utils'

interface SingleSelectProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes
  multiple?: false
  placeholder?: string
  value?: string | null
}

interface MultiSelectProps
  extends Omit<SingleSelectProps, 'multiple' | 'value'> {
  maxSelectedItems?: number
  multiple: true
  value?: string | string[] | null
}

export type SelectProps = InputComponentProps<
  SingleSelectProps | MultiSelectProps
>

export const Select: BuiltInComponent<SelectProps> = createComponent<
  SelectProps,
  StaticSelect | MultiStaticSelect | InputBlock
>('Select', (props) => {
  const fragment: SelectFragmentObject = ((): any => {
    if (isValidElementFromComponent(props.children, SelectFragment))
      return props.children

    return <SelectFragment from={Select} children={props.children} />
  })()

  // eslint-disable-next-line dot-notation
  if (fragment['options'] && fragment['options'].length === 0)
    throw new Error(
      '<Select> must contain least of one <Option> or <Optgroup>.'
    )

  const initialOptions: OptionComposition[] =
    props.value === undefined
      ? fragment[selectFragmentSelectedOptionsSymbol] || []
      : ((v) => {
          const opts: OptionComposition[] =
            (fragment as any).options ||
            flattenDeep((fragment as any).option_groups.map((g) => g.options))

          const values = Array.isArray(v) ? v : [v]

          return opts.filter((o) => values.includes(o.value))
        })(props.value)

  const select = ((): StaticSelect | MultiStaticSelect => {
    const action_id = props.actionId || props.name
    const placeholder =
      props.placeholder !== undefined ? plainText(props.placeholder) : undefined

    if (props.multiple) {
      return {
        type: 'multi_static_select',
        action_id,
        placeholder,
        ...fragment,
        initial_options: initialOptions,
        max_selected_items: props.maxSelectedItems,
        confirm: props.confirm as any,
      }
    }

    return {
      type: 'static_select',
      action_id,
      placeholder,
      ...fragment,
      initial_option:
        initialOptions.length > 0
          ? initialOptions[initialOptions.length - 1]
          : undefined,
      confirm: props.confirm as any,
    }
  })()

  return wrapInInput<StaticSelect | MultiStaticSelect>(select, props, Select)
})
