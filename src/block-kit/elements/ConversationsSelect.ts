import {
  ConversationsSelect as SlackConversationsSelect,
  MultiConversationsSelect,
  InputBlock,
} from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx'
import { DistributedProps, coerceToInteger } from '../../utils'
import { ConfirmableProps } from '../composition/Confirm'
import { FilterProps, filter, plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import {
  ActionProps,
  AutoFocusibleProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
  ResponsableUrlProps,
  focusOnLoadFromProps,
} from './utils'

declare const conversationIdString: unique symbol
type ConversationIdString = string & { [conversationIdString]?: never }

interface SingleConversationsSelectProps
  extends ActionProps,
    AutoFocusibleProps,
    ConfirmableProps,
    SingleSelectableProps,
    FilterProps {
  children?: never

  /**
   * A string of ID for the initially selected conversation. In multiple select,
   * you can set multiple conversation IDs through array.
   *
   * `initialConversation` accepts the conversation id prefixed with `C`, `D`,
   * and `G`. In addition, jsx-slack recognizes the special value `current` for
   * indicating the origin conversation that the container surface belongs to.
   *
   * **NOTE**: `current` corresponds to `default_to_current_conversation` field
   * in Slack API. It will be ignored if defined initial conversations, so
   * multiple conversations select cannot specify `current` along with specific
   * conversations.
   */
  initialConversation?: ConversationIdString | 'current'

  /** The placeholder text shown in select field. */
  placeholder?: string

  /** An alias into `initialConversation` prop. */
  value?: ConversationIdString | 'current'
}

interface MultiConversationsSelectProps
  extends MultiSelectablePropsFrom<
    SingleConversationsSelectProps,
    'initialConversation' | 'value'
  > {
  initialConversation?:
    | ConversationIdString
    | 'current'
    | ConversationIdString[]

  value?: ConversationIdString | 'current' | ConversationIdString[]
}

type SlackConversationsSelectElement = SlackConversationsSelect & {
  focus_on_load?: boolean
}

type MultiConversationsSelectElement = MultiConversationsSelect & {
  focus_on_load?: boolean
}

export type ConversationsSelectProps = DistributedProps<
  | InputComponentProps<SingleConversationsSelectProps, ResponsableUrlProps>
  | InputComponentProps<MultiConversationsSelectProps>
>

/**
 * The interactive component or input component for
 * [the `conversations_select` block element](https://api.slack.com/reference/block-kit/block-elements#conversation_select) and
 * [the `multi_conversations_select` block element](https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select).
 *
 * Provide a selectable menu element from a list of many kind of conversations
 * visible to the current user in the active workspace.
 *
 * @return The partial JSON of a block element for selecting from conversations,
 *   or `input` layout block with it
 */
export const ConversationsSelect: BuiltInComponent<ConversationsSelectProps> =
  createComponent<
    ConversationsSelectProps,
    | SlackConversationsSelectElement
    | MultiConversationsSelectElement
    | InputBlock
  >('ConversationsSelect', (props) => {
    const action_id = props.actionId || props.name
    const filterComposition = filter(props)
    const placeholder =
      props.placeholder !== undefined ? plainText(props.placeholder) : undefined

    const initialConversationsSet = new Set<string>(
      ((v) => ([] as string[]).concat(v ?? []))(
        props.initialConversation || props.value
      )
    )

    const defaultToCurrentConversation =
      initialConversationsSet.delete('current') || undefined

    const initialConversations =
      initialConversationsSet.size > 0
        ? [...initialConversationsSet.values()]
        : undefined

    return wrapInInput<
      SlackConversationsSelectElement | MultiConversationsSelectElement
    >(
      props.multiple
        ? {
            type: 'multi_conversations_select',
            action_id,
            placeholder,
            initial_conversations: initialConversations,
            filter: filterComposition,
            default_to_current_conversation: defaultToCurrentConversation,
            max_selected_items: coerceToInteger(props.maxSelectedItems),
            confirm: props.confirm as any,
            focus_on_load: focusOnLoadFromProps(props),
          }
        : {
            type: 'conversations_select',
            action_id: props.actionId || props.name,
            placeholder,
            initial_conversation: initialConversations?.[0],
            filter: filterComposition,
            default_to_current_conversation: defaultToCurrentConversation,
            response_url_enabled:
              props.responseUrlEnabled !== undefined
                ? !!props.responseUrlEnabled
                : undefined,
            confirm: props.confirm as any,
            focus_on_load: focusOnLoadFromProps(props),
          },
      props,
      ConversationsSelect
    )
  })
