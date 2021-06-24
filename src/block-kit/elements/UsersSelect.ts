import {
  UsersSelect as UsersSelectElement,
  MultiUsersSelect,
  InputBlock,
} from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx'
import { coerceToInteger } from '../../utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import {
  ActionProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
} from './utils'

interface SingleUsersSelectProps
  extends ActionProps,
    ConfirmableProps,
    SingleSelectableProps {
  children?: never

  /** A string of ID for the initially selected user. */
  initialUser?: string

  /** The placeholder text shown in select field. */
  placeholder?: string

  /** An alias into `initialUser` prop. */
  value?: string
}

interface MultiUsersSelectProps
  extends MultiSelectablePropsFrom<
    SingleUsersSelectProps,
    'initialUser' | 'value'
  > {
  /** In multiple select, you can set multiple user IDs through array. */
  initialUser?: string | string[]
  value?: string | string[]
}

export type UsersSelectProps = InputComponentProps<
  SingleUsersSelectProps | MultiUsersSelectProps
>

/**
 * The interactive component or input component for
 * [the `users_select` block element](https://api.slack.com/reference/block-kit/block-elements#users_select) and
 * [the `multi_users_select` block element](https://api.slack.com/reference/block-kit/block-elements#users_multi_select).
 *
 * Provide a selectable menu element from a list of Slack users visible to the
 * current user in the active workspace.
 *
 * @return The partial JSON of a block element for selecting from users, or
 *   `input` layout block with it
 */
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
