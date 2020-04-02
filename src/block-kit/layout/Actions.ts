/* eslint-disable @typescript-eslint/no-empty-function */
import { ActionsBlock, Action } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { Button } from '../elements/Button'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

interface ActionsProps extends LayoutBlockProps {
  children: JSXSlack.ChildNodes
}

const throwMultiSelectError = (element: unknown): never => {
  const tag = resolveTagName(element)
  throw new Error(
    `<Actions> cannot include the element for selection from multiple options${
      tag ? `: <${tag.slice(1, -1)} multiple>` : '.'
    }`
  )
}

const actionTypeValidators = {
  button: () => {},
  channels_select: () => {},
  checkboxes: () => {},
  conversations_select: () => {},
  datepicker: () => {},
  external_select: () => {},
  overflow: () => {},
  radio_buttons: () => {},
  static_select: () => {},
  users_select: () => {},

  // Extra validators to throw better error
  multi_channels_select: throwMultiSelectError,
  multi_conversations_select: throwMultiSelectError,
  multi_external_select: throwMultiSelectError,
  multi_static_select: throwMultiSelectError,
  multi_users_select: throwMultiSelectError,
} as const

/**
 * {@link https://api.slack.com/reference/messaging/blocks#actions|The `actions` layout block}
 * to hold interactive elements.
 *
 * `<Actions>` allows containing up to 25 interactive elements, but Slack
 * recommends to place up to 5 elements.
 *
 * It can include following interactive elements:
 *
 * - `<Button>` / `<button>`
 * - `<Select>` / `<select>` _(Single-select only)_
 * - `<ExternalSelect>` _(Single-select only)_
 * - `<UsersSelect>` _(Single-select only)_
 * - `<ConversationsSelect>` _(Single-select only)_
 * - `<ChannelsSelect>` _(Single-select only)_
 * - `<Overflow>`
 * - `<DatePicker>`
 * - `<CheckboxGroup>` _(Only for `<Modal>` and `<Home>` container)_
 * - `<RadioButtonGroup>` _(Only for `<Modal>` and `<Home>` container)_
 *
 * @return The partial JSON for `actions` layout block
 */
export const Actions = createComponent<ActionsProps, ActionsBlock>(
  'Actions',
  ({ blockId, children, id }) => {
    const elements = JSXSlack.Children.toArray(children).reduce(
      (reduced: Action[], child: any) => {
        let target = child

        if (JSXSlack.isValidElement(child)) {
          if (child.$$jsxslack.type === 'button') target = alias(child, Button)
        }

        if (typeof target === 'object') {
          const validator = actionTypeValidators[target.type]

          if (!validator) {
            const tag = resolveTagName(child)
            throw new Error(
              `<Actions> has detected an incompatible element in its children${
                tag ? `: ${tag}` : '.'
              }`
            )
          }

          validator(target)
          return [...reduced, target]
        }
        return reduced
      },
      []
    )

    if (elements.length > 25)
      throw new Error(
        `<Actions> can include up to 25 elements, but there are ${elements.length} elements.`
      )

    return { type: 'actions', block_id: blockId || id, elements }
  }
)
