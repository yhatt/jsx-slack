/** @jsx JSXSlack.h */
import {
  UsersSelect as UsersSelectElement,
  MultiUsersSelect,
  InputBlock,
} from '@slack/types'
import {
  ActionProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
} from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { BuiltInComponent, createComponent } from '../../jsx'
import { coerceToInteger } from '../../utils'

interface SingleUsersSelectProps
  extends ActionProps,
    ConfirmableProps,
    SingleSelectableProps {
  children?: never
  initialUser?: string
  placeholder?: string

  /** An alias into `initialUser` prop. */
  value?: string
}

interface MultiUsersSelectProps
  extends MultiSelectablePropsFrom<
    SingleUsersSelectProps,
    'initialUser' | 'value'
  > {
  initialUser?: string | string[]
  value?: string | string[]
}

export type UsersSelectProps = InputComponentProps<
  SingleUsersSelectProps | MultiUsersSelectProps
>

export const UsersSelect: BuiltInComponent<UsersSelectProps> = createComponent<
  UsersSelectProps,
  UsersSelectElement | MultiUsersSelect | InputBlock
>('UsersSelect', (props) => {
  const action_id = props.actionId || props.name
  const placeholder =
    props.placeholder !== undefined ? plainText(props.placeholder) : undefined

  return wrapInInput<UsersSelectElement | MultiUsersSelect>(
    props.multiple
      ? {
          type: 'multi_users_select',
          action_id,
          placeholder,
          initial_users: ((v) =>
            v !== undefined ? ([] as string[]).concat(v) : undefined)(
            props.initialUser || props.value
          ),
          max_selected_items: coerceToInteger(props.maxSelectedItems),
          confirm: props.confirm as any,
        }
      : {
          type: 'users_select',
          action_id: props.actionId || props.name,
          placeholder,
          initial_user: props.initialUser || props.value,
          confirm: props.confirm as any,
        },
    props,
    UsersSelect
  )
})
