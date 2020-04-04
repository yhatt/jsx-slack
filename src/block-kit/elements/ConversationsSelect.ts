/** @jsx JSXSlack.h */
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
  initialConversation?: string
  placeholder?: string
}

interface MultiConversationsSelectProps
  extends MultiSelectablePropsFrom<
    SingleConversationsSelectProps,
    'initialConversation'
  > {
  initialConversation?: string | string[]
}

type ConversationsSelectElement = SlackConversationsSelect & {
  response_url_enabled?: boolean
}

export type ConversationsSelectProps = DistributedProps<
  | InputComponentProps<SingleConversationsSelectProps, ResponsableUrlProps>
  | InputComponentProps<MultiConversationsSelectProps>
>

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
          initial_conversations:
            props.initialConversation !== undefined
              ? ([] as string[]).concat(props.initialConversation)
              : undefined,
          filter: filterComposition,
          max_selected_items: coerceToInteger(props.maxSelectedItems),
          confirm: props.confirm as any,
        }
      : {
          type: 'conversations_select',
          action_id: props.actionId || props.name,
          placeholder,
          initial_conversation: props.initialConversation,
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
