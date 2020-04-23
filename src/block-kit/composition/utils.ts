import { ConversationsSelect, PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'

type FilterComposition = ConversationsSelect['filter']
type FilterIncludeKind = 'im' | 'mpim' | 'private' | 'public'

// It's a workaround for working auto-completion of string literals in IDE while
// still allowing space-separated string. This hack has called `LiteralUnion`.
// @see https://github.com/Microsoft/TypeScript/issues/29729
type SpaceSeparatedKind = string & { _?: never }

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
  include?: FilterIncludeKind | FilterIncludeKind[] | SpaceSeparatedKind

  /**
   * A boolean value whether to exclude external
   * {@link https://api.slack.com/enterprise/shared-channels shared channels}
   * from conversations list.
   */
  excludeExternalSharedChannels?: boolean

  /** A boolean value whether to exclude bot users from conversations list. */
  excludeBotUsers?: boolean
}

// Text composition object for plain text
const renderAsPlainText = (children: JSXSlack.ChildElements) =>
  JSXSlack.Children.toArray(children)
    .map((child) =>
      JSXSlack.isValidElement(child)
        ? renderAsPlainText(child.$$jsxslack.children)
        : child
    )
    .join('')

export const plainText = (
  textOrElements: JSXSlack.ChildElements,
  { emoji }: Omit<PlainTextElement, 'type' | 'text'> = { emoji: true }
): PlainTextElement => {
  const text =
    typeof textOrElements === 'string'
      ? textOrElements
      : renderAsPlainText(textOrElements)

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
    filterComposition.exclude_external_shared_channels = !!props.excludeExternalSharedChannels

  return Object.keys(filterComposition).length > 0
    ? filterComposition
    : undefined
}
