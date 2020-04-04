import { ConversationsSelect, PlainTextElement } from '@slack/types'
import { JSXSlack } from '../../jsx'

type FilterComposition = ConversationsSelect['filter']

export interface FilterProps {
  include?: string | ('im' | 'mpim' | 'private' | 'public')[]
  excludeExternalSharedChannels?: boolean
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

// Filter composition object (beta)
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
