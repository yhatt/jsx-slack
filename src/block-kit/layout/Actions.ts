import { ActionsBlock } from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { Button } from '../elements/Button'
import { Select } from '../elements/Select'
import { alias, resolveTagName } from '../utils'
import { LayoutBlockProps, generateInputValidator } from './utils'

type Actionable = ActionsBlock['elements'][number]

interface ActionsProps extends LayoutBlockProps {
  children: JSXSlack.ChildNodes
}

const throwMultiSelectError = (element: unknown): never => {
  const tag = resolveTagName(element)
  throw new JSXSlackError(
    `<Actions> cannot include the element for selection from multiple options${
      tag ? `: <${tag.slice(1, -1)} multiple>` : '.'
    }`,
    element,
  )
}

export const availableActionTypes = [
  'button',
  'channels_select',
  'checkboxes',
  'conversations_select',
  'datepicker',
  'datetimepicker',
  'external_select',
  'overflow',
  'radio_buttons',
  'static_select',
  'timepicker',
  'users_select',
] as const

const actionTypeValidators: Record<string, (action: Actionable) => void> = {
  ...availableActionTypes.reduce(
    (reduced, type) => ({ ...reduced, [type]: () => {} }),
    {},
  ),

  // Validator for responseUrlEnabled prop
  channels_select: (element: any) => {
    if (element.response_url_enabled)
      throw new JSXSlackError(
        '<ChannelsSelect responseUrlEnabled> is available only in the usage of input components.',
        element,
      )
  },
  conversations_select: (element: any) => {
    if (element.response_url_enabled)
      throw new JSXSlackError(
        '<ConversationsSelect responseUrlEnabled> is available only in the usage of input components.',
        element,
      )
  },

  // Extra validators to throw better error
  multi_channels_select: throwMultiSelectError,
  multi_conversations_select: throwMultiSelectError,
  multi_external_select: throwMultiSelectError,
  multi_static_select: throwMultiSelectError,
  multi_users_select: throwMultiSelectError,
  input: generateInputValidator('Actions'),
}

/**
 * [The `actions` layout block](https://api.slack.com/reference/messaging/blocks#actions)
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
 * - `<TimePicker>`
 * - `<DateTimePicker>`
 * - `<CheckboxGroup>`
 * - `<RadioButtonGroup>`
 *
 * @return The partial JSON for `actions` layout block
 */
export const Actions = createComponent<ActionsProps, ActionsBlock>(
  'Actions',
  ({ blockId, children, id, ...rest }) => {
    const elements = JSXSlack.Children.toArray(children).reduce(
      (reduced: Actionable[], child: any) => {
        let target = child

        if (JSXSlack.isValidElement(child)) {
          if (child.$$jsxslack.type === 'button') target = alias(child, Button)
          if (child.$$jsxslack.type === 'select') target = alias(child, Select)
        }

        if (typeof target === 'object') {
          const validator = actionTypeValidators[target.type]

          if (!validator) {
            const tag = resolveTagName(child)
            throw new JSXSlackError(
              `<Actions> has detected an incompatible element in its children${
                tag ? `: ${tag}` : '.'
              }`,
              child,
            )
          }

          validator(target)
          return [...reduced, target]
        }
        return reduced
      },
      [],
    )

    if (elements.length > 25)
      throw new JSXSlackError(
        `<Actions> can contain up to 25 elements, but there are ${elements.length} elements.`,
        rest['__source'],
      )

    return { type: 'actions', block_id: blockId || id, elements }
  },
)
