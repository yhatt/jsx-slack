import {
  ConversationsSelect as SlackConversationsSelect,
  MultiConversationsSelect,
  InputBlock,
} from '@slack/types'
import {
  ActionProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
  ResponsableUrlProps,
} from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { FilterProps, filter, plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { BuiltInComponent, createComponent } from '../../jsx'
import { DistributedProps, coerceToInteger } from '../../utils'

interface SingleConversationsSelectProps
  extends ActionProps,
    ConfirmableProps,
    SingleSelectableProps,
    FilterProps {
  children?: never

  /** A string of ID for the initially selected conversation. */
  initialConversation?: string

  /** The placeholder text shown in select field. */
  placeholder?: string

  /** An alias into `initialConversation` prop. */
  value?: string
}

interface MultiConversationsSelectProps
  extends MultiSelectablePropsFrom<
    SingleConversationsSelectProps,
    'initialConversation' | 'value'
  > {
  /**
   * In multiple select, you can set multiple conversation IDs through array.
   */
  initialConversation?: string | string[]
  value?: string | string[]
}

type ConversationsSelectElement = SlackConversationsSelect & {
  response_url_enabled?: boolean
}

export type ConversationsSelectProps = DistributedProps<
  | InputComponentProps<SingleConversationsSelectProps, ResponsableUrlProps>
  | InputComponentProps<MultiConversationsSelectProps>
>

/**
 * The interactive component or input component for
 * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select the `conversations_select` block element} and
 * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select the `multi_conversations_select` block element}.
 *
 * Provide a selectable menu element from a list of many kind of conversations
 * visible to the current user in the active workspace.
 *
 * @return The partial JSON of a block element for selecting from conversations,
 *   or `input` layout block with it
 */
export const ConversationsSelect: BuiltInComponent<ConversationsSelectProps> = createComponent<
  ConversationsSelectProps,
  ConversationsSelectElement | MultiConversationsSelect | InputBlock
>('ConversationsSelect', (props) => {
  const action_id = props.actionId || props.name
  const filterComposition = filter(props)
  const placeholder =
    props.placeholder !== undefined ? plainText(props.placeholder) : undefined

  return wrapInInput<ConversationsSelectElement | MultiConversationsSelect>(
    props.multiple
      ? {
          type: 'multi_conversations_select',
          action_id,
          placeholder,
          initial_conversations: ((v) =>
            v !== undefined ? ([] as string[]).concat(v) : undefined)(
            props.initialConversation || props.value
          ),
          filter: filterComposition,
          max_selected_items: coerceToInteger(props.maxSelectedItems),
          confirm: props.confirm as any,
        }
      : {
          type: 'conversations_select',
          action_id: props.actionId || props.name,
          placeholder,
          initial_conversation: props.initialConversation || props.value,
          filter: filterComposition,
          response_url_enabled:
            props.responseUrlEnabled !== undefined
              ? !!props.responseUrlEnabled
              : undefined,
          confirm: props.confirm as any,
        },
    props,
    ConversationsSelect
  )
})
