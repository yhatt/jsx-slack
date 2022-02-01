import {
  ChannelsSelect as SlackChannelsSelect,
  MultiChannelsSelect,
  InputBlock,
} from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx-internals'
import { DistributedProps, coerceToInteger } from '../../utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import {
  ActionProps,
  AutoFocusibleProps,
  SingleSelectableProps,
  MultiSelectablePropsFrom,
  ResponsableUrlProps,
  focusOnLoadFromProps,
} from './utils'

interface SingleChannelsSelectProps
  extends ActionProps,
    AutoFocusibleProps,
    ConfirmableProps,
    SingleSelectableProps {
  children?: never

  /** A string of ID for the initially selected public channel. */
  initialChannel?: string

  /** The placeholder text shown in select field. */
  placeholder?: string

  /** An alias into `initialChannel` prop. */
  value?: string
}

interface MultiChannelsSelectProps
  extends MultiSelectablePropsFrom<
    SingleChannelsSelectProps,
    'initialChannel' | 'value'
  > {
  /** In multiple select, you can set multiple channel IDs through array. */
  initialChannel?: string | string[]
  value?: string | string[]
}

type ChannelsSelectElement = SlackChannelsSelect & {
  response_url_enabled?: boolean
}

type MultiChannelsSelectElement = MultiChannelsSelect

export type ChannelsSelectProps = DistributedProps<
  | InputComponentProps<SingleChannelsSelectProps, ResponsableUrlProps>
  | InputComponentProps<MultiChannelsSelectProps>
>

/**
 * The interactive component or input component for
 * [the `channels_select` block element](https://api.slack.com/reference/block-kit/block-elements#channel_select) and
 * [the `multi_channels_select` block element](https://api.slack.com/reference/block-kit/block-elements#channel_multi_select).
 *
 * Provide a selectable menu element from a list of _public_ channels visible to
 * the current user in the active workspace.
 *
 * @return The partial JSON of a block element for selecting from channels, or
 *   `input` layout block with it
 */
export const ChannelsSelect: BuiltInComponent<ChannelsSelectProps> =
  createComponent<
    ChannelsSelectProps,
    ChannelsSelectElement | MultiChannelsSelectElement | InputBlock
  >('ChannelsSelect', (props) => {
    const action_id = props.actionId || props.name
    const placeholder =
      props.placeholder !== undefined ? plainText(props.placeholder) : undefined

    return wrapInInput<ChannelsSelectElement | MultiChannelsSelectElement>(
      props.multiple
        ? {
            type: 'multi_channels_select',
            action_id,
            placeholder,
            initial_channels: ((v) =>
              v !== undefined ? ([] as string[]).concat(v) : undefined)(
              props.initialChannel || props.value
            ),
            max_selected_items: coerceToInteger(props.maxSelectedItems),
            confirm: props.confirm as any,
            focus_on_load: focusOnLoadFromProps(props),
          }
        : {
            type: 'channels_select',
            action_id: props.actionId || props.name,
            placeholder,
            initial_channel: props.initialChannel || props.value,
            response_url_enabled:
              props.responseUrlEnabled !== undefined
                ? !!props.responseUrlEnabled
                : undefined,
            confirm: props.confirm as any,
            focus_on_load: focusOnLoadFromProps(props),
          },
      props,
      ChannelsSelect
    )
  })
