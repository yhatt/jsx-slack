import {
  ExternalSelect as ExternalSelectElement,
  InputBlock,
  MultiExternalSelect,
  Option as OptionComposition,
} from '@slack/types'
import {
  ActionProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
} from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { OptionProps } from '../composition/Option'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { JSXSlack, BuiltInComponent, createComponent } from '../../jsx'
import { coerceToInteger } from '../../utils'

type OptionType = JSXSlack.Node<OptionProps> | OptionComposition

interface SingleExternalSelectProps
  extends ActionProps,
    ConfirmableProps,
    SingleSelectableProps {
  children?: never
  initialOption?: OptionType
  minQueryLength?: number
  placeholder?: string
}

interface MultiExternalSelectProps
  extends MultiSelectablePropsFrom<SingleExternalSelectProps, 'initialOption'> {
  initialOption?: OptionType | OptionType[]
}

export type ExternalSelectProps = InputComponentProps<
  SingleExternalSelectProps | MultiExternalSelectProps
>

export const ExternalSelect: BuiltInComponent<ExternalSelectProps> = createComponent<
  ExternalSelectProps,
  ExternalSelectElement | MultiExternalSelect | InputBlock
>('ExternalSelect', (props) => {
  const action_id = props.actionId || props.name
  const placeholder =
    props.placeholder !== undefined ? plainText(props.placeholder) : undefined
  const min_query_length = coerceToInteger(props.minQueryLength)

  return wrapInInput<ExternalSelectElement | MultiExternalSelect>(
    props.multiple
      ? {
          type: 'multi_external_select',
          action_id,
          placeholder,
          initial_options: (Array.isArray(props.initialOption)
            ? props.initialOption
            : [props.initialOption]) as any[],
          min_query_length,
          max_selected_items: coerceToInteger(props.maxSelectedItems),
          confirm: props.confirm as any,
        }
      : {
          type: 'external_select',
          action_id: props.actionId || props.name,
          placeholder,
          initial_option: props.initialOption as any,
          min_query_length,
          confirm: props.confirm as any,
        },
    props,
    ExternalSelect
  )
})
