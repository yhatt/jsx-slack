import { ConversationsSelect, PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'

type DispatchActionConfigTriggerActionsOn =
  | 'onEnterPressed'
  | 'onCharacterEntered'

type FilterComposition = ConversationsSelect['filter']
type FilterIncludeKind = 'im' | 'mpim' | 'private' | 'public'

// It's a workaround for working auto-completion of string literals in IDE while
// still allowing space-separated string. This hack has called `LiteralUnion`.
// @see https://github.com/Microsoft/TypeScript/issues/29729
declare const spaceSeparatedDispatchActionConfigTriggerActionsOn: unique symbol
type SpaceSeparatedDispatchActionConfigTriggerActionsOn = string & {
  [spaceSeparatedDispatchActionConfigTriggerActionsOn]?: never
}
declare const spaceSeparatedFilterIncludeKind: unique symbol
type SpaceSeparatedFilterIncludeKind = string & {
  [spaceSeparatedFilterIncludeKind]?: never
}

export interface FilterProps {
  /**
   * An array of the kind of conversation types, or a string of space-separated
   * conversation types, to indicate which types are included in the list.
   *
   * - `im`: Direct message
   * - `mpim`: Group direct message
   * - `private`: Private channel
   * - `public`: Public channel
   *
   * By default, all conversation types are included.
   */
  include?:
    | FilterIncludeKind
    | FilterIncludeKind[]
    | SpaceSeparatedFilterIncludeKind

  /**
   * A boolean value whether to exclude external
   * {@link https://api.slack.com/enterprise/shared-channels shared channels}
   * from conversations list.
   */
  excludeExternalSharedChannels?: boolean

  /** A boolean value whether to exclude bot users from conversations list. */
  excludeBotUsers?: boolean
}

export interface DispatchActionConfigComposition {
  trigger_actions_on?: ('on_enter_pressed' | 'on_character_entered')[]
}

export interface InputDispatchActionProps {
  /**
   * @doc-plain-text-input
   * If defined interaction type(s) as space-separated string or array, you can
   * determine when the plain-text input component will return the payload, as
   * same as
   * {@link https://api.slack.com/reference/block-kit/composition-objects#dispatch_action_config defining `dispatch_action_config` in Slack API}.
   *
   * - `onEnterPressed`: Payload is dispatched when hitting Enter key while
   *   focusing to the input component.
   * - `onCharacterEntered`: Payload is dispatched when changing input
   *   characters.
   */
  dispatchAction?:
    | boolean
    | DispatchActionConfigTriggerActionsOn
    | DispatchActionConfigTriggerActionsOn[]
    | SpaceSeparatedDispatchActionConfigTriggerActionsOn
}

// Text composition object for plain text
const renderAsPlainText = (
  children: JSXSlack.ChildElements,
  layoutTags = false
) =>
  JSXSlack.Children.toArray(children)
    .map((child) => {
      if (!JSXSlack.isValidElement(child)) return child

      if (layoutTags) {
        if (child.$$jsxslack.type === 'br') return '\n'
        // TODO: Support pargraphs by <p> tag
      }

      return renderAsPlainText(child.$$jsxslack.children)
    })
    .join('')

export const plainText = (
  textOrElements: JSXSlack.ChildElements,
  {
    emoji = true,
    layoutTags = false,
  }: {
    emoji?: boolean
    layoutTags?: boolean
  } = {}
): PlainTextElement => {
  const text =
    typeof textOrElements === 'string'
      ? textOrElements
      : renderAsPlainText(textOrElements, layoutTags)

  return { type: 'plain_text', text, emoji }
}

// Filter composition object
export const filter = (props: FilterProps): FilterComposition => {
  const filterComposition: FilterComposition = {}
  let { include } = props

  if (include) {
    if (!Array.isArray(include)) include = include.split(' ') as any[]

    include = [...new Set(include)].filter((o) =>
      ['im', 'mpim', 'private', 'public'].includes(o)
    )

    if (include.length > 0) filterComposition.include = include
  }

  if (props.excludeBotUsers !== undefined)
    filterComposition.exclude_bot_users = !!props.excludeBotUsers

  if (props.excludeExternalSharedChannels !== undefined)
    filterComposition.exclude_external_shared_channels =
      !!props.excludeExternalSharedChannels

  return Object.keys(filterComposition).length > 0
    ? filterComposition
    : undefined
}

// Dispatch action configuration composition object
export const inputDispatchActionConfig = (
  props: InputDispatchActionProps
): DispatchActionConfigComposition | undefined => {
  const dispatchActionConfigComposition: DispatchActionConfigComposition = {}
  let { dispatchAction } = props

  if (typeof dispatchAction !== 'boolean' && dispatchAction) {
    if (!Array.isArray(dispatchAction)) {
      dispatchAction = dispatchAction.split(' ') as any[]
    }

    const triggerActionsOn = [
      ...new Set(
        dispatchAction
          .filter((a): a is DispatchActionConfigTriggerActionsOn =>
            ['onEnterPressed', 'onCharacterEntered'].includes(a)
          )
          .map((a) => {
            if (a === 'onEnterPressed') return 'on_enter_pressed'
            return 'on_character_entered'
          })
      ),
    ]

    if (triggerActionsOn.length > 0) {
      dispatchActionConfigComposition.trigger_actions_on = triggerActionsOn
    }
  }

  return Object.keys(dispatchActionConfigComposition).length > 0
    ? dispatchActionConfigComposition
    : undefined
}
