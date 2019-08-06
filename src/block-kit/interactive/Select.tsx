/** @jsx JSXSlack.h */
import {
  StaticSelect,
  ChannelsSelect as SlackChannelsSelect,
  ConversationsSelect as SlackConversationsSelect,
  ExternalSelect as SlackExternalSelect,
  Option as SlackOption,
  UsersSelect as SlackUsersSelect,
} from '@slack/types'
import flatten from 'lodash.flatten'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'

export interface SelectPropsBase {
  actionId?: string
  placeholder?: string
  confirm?: JSXSlack.Node<ConfirmProps>
}

interface SelectFragmentProps {
  children?: JSXSlack.Children<OptionInternal | OptgroupInternal>
}

interface SelectProps extends SelectPropsBase, Required<SelectFragmentProps> {
  value?: string
}

interface ExternalSelectProps extends SelectPropsBase {
  initialOption?: JSXSlack.Node<OptionInternal> | SlackOption
  minQueryLength?: number
  children?: undefined
}

interface UsersSelectProps extends SelectPropsBase {
  initialUser?: string
  children?: undefined
}

interface ConversationsSelectProps extends SelectPropsBase {
  initialConversation?: string
  children?: undefined
}

interface ChannelsSelectProps extends SelectPropsBase {
  initialChannel?: string
  children?: undefined
}

interface OptionProps {
  value: string
  children: JSXSlack.Children<{}>
}

interface OptgroupProps {
  label: string
  children: JSXSlack.Children<OptionInternal>
}

export interface OptionInternal extends OptionProps {
  type: 'option'
  text: string
}

export interface OptgroupInternal extends OptgroupProps {
  type: 'optgroup'
}

type SelectFragmentObject<T extends 'options' | 'option_groups'> = Required<
  Pick<StaticSelect, T>
>

const baseProps = ({
  actionId,
  placeholder,
  confirm,
}: SelectPropsBase): Pick<
  StaticSelect,
  'action_id' | 'confirm' | 'placeholder'
> => ({
  placeholder: placeholder
    ? {
        type: 'plain_text',
        text: placeholder,
        emoji: true, // TODO: Controlable emoji
      }
    : undefined,
  action_id: actionId,
  confirm: confirm ? JSXSlack(confirm) : undefined,
})

const createOption = ({ value, text }: OptionInternal): SlackOption => ({
  value,
  text: { text, type: 'plain_text', emoji: true }, // TODO: Controlable emoji
})

const filter = <T extends {}>(children: JSXSlack.Children<T>) =>
  JSXSlack.normalizeChildren(children).filter(
    o => typeof o !== 'string'
  ) as JSXSlack.Node<T>[]

const generateFragments = (
  children: SelectFragmentProps['children']
): SelectFragmentObject<'options' | 'option_groups'> => {
  const fragment: SelectFragmentObject<'options' | 'option_groups'> = JSXSlack(
    <SelectFragment children={children} />
  )

  if (fragment.options && fragment.options.length === 0)
    throw new Error(
      'Component for selection must include least of one <Option> or <Optgroup>.'
    )

  return fragment
}

export const SelectFragment: JSXSlack.FC<SelectFragmentProps> = props => {
  const opts = filter(props.children)

  if (opts.length === 0)
    return <ObjectOutput<SelectFragmentObject<'options'>> options={[]} />

  const { type } = opts[0].props
  if (!opts.every(o => o.props.type === type))
    throw new Error(
      'Component for selection must only include either of <Option> and <Optgroup>.'
    )

  switch (type) {
    case 'option':
      return (
        <ObjectOutput<SelectFragmentObject<'options'>>
          options={(opts as JSXSlack.Node<OptionInternal>[]).map(n =>
            createOption(n.props)
          )}
        />
      )
    case 'optgroup':
      return (
        <ObjectOutput<SelectFragmentObject<'option_groups'>>
          option_groups={
            (opts as JSXSlack.Node<OptgroupInternal>[]).map(n => ({
              label: {
                type: 'plain_text',
                text: n.props.label,
                emoji: true, // TODO: Controlable emoji
              },
              options: filter(n.props.children).map(o => createOption(o.props)),
            })) as any
          }
        />
      )
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }
}

export const Select: JSXSlack.FC<SelectProps> = props => {
  const fragment = generateFragments(props.children)

  // Find initial option
  let initialOption: SlackOption | undefined

  if (typeof props.value === 'string') {
    const opts: SlackOption[] =
      fragment.options || flatten(fragment.option_groups.map(og => og.options))

    initialOption = opts.find(o => o.value === props.value)
  }

  return (
    <ObjectOutput<StaticSelect>
      type="static_select"
      {...baseProps(props)}
      initial_option={initialOption}
      {...fragment}
    />
  )
}

export const ExternalSelect: JSXSlack.FC<ExternalSelectProps> = props => {
  const initial = (() => {
    if (props.initialOption) {
      const isNode = (
        v: ExternalSelectProps['initialOption']
      ): v is JSXSlack.Node<OptionInternal> =>
        (v as JSXSlack.Node<OptionInternal>).type !== undefined

      if (isNode(props.initialOption)) {
        return createOption(props.initialOption.props)
      }

      return props.initialOption
    }
    return undefined
  })()

  return (
    <ObjectOutput<SlackExternalSelect>
      type="external_select"
      {...baseProps(props)}
      initial_option={initial}
      min_query_length={props.minQueryLength}
    />
  )
}

export const UsersSelect: JSXSlack.FC<UsersSelectProps> = props => (
  <ObjectOutput<SlackUsersSelect>
    type="users_select"
    {...baseProps(props)}
    initial_user={props.initialUser}
  />
)

export const ConversationsSelect: JSXSlack.FC<
  ConversationsSelectProps
> = props => (
  <ObjectOutput<SlackConversationsSelect>
    type="conversations_select"
    {...baseProps(props)}
    initial_conversation={props.initialConversation}
  />
)

export const ChannelsSelect: JSXSlack.FC<ChannelsSelectProps> = props => (
  <ObjectOutput<SlackChannelsSelect>
    type="channels_select"
    {...baseProps(props)}
    initial_channel={props.initialChannel}
  />
)

export const Option: JSXSlack.FC<OptionProps> = props => (
  <ObjectOutput<OptionInternal>
    {...props}
    type="option"
    text={JSXSlack(<PlainText>{props.children}</PlainText>)}
  />
)

export const Optgroup: JSXSlack.FC<OptgroupProps> = props => (
  <ObjectOutput<OptgroupInternal> {...props} type="optgroup" />
)
