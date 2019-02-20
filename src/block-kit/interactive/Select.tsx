/** @jsx JSXSlack.h */
import {
  StaticSelect,
  ChannelsSelect as SlackChannelsSelect,
  ConversationsSelect as SlackConversationsSelect,
  ExternalSelect as SlackExternalSelect,
  Option as SlackOption,
  UsersSelect as SlackUsersSelect,
} from '@slack/client'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'

export interface SelectPropsBase {
  actionId?: string
  placeholder?: string
  confirm?: JSXSlack.Node<ConfirmProps>
}

interface SelectProps extends SelectPropsBase {
  value?: string
  children: JSXSlack.Children<OptionInternal | OptgroupInternal>
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

interface OptionInternal extends OptionProps {
  type: 'option'
  text: string
}

interface OptgroupInternal extends OptgroupProps {
  type: 'optgroup'
}

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

export const Select: JSXSlack.FC<SelectProps> = props => {
  const opts = filter(props.children)

  if (opts.length === 0)
    throw new Error(
      '<Select> must include least of one <Option> or <Optgroup>.'
    )

  const { type } = opts[0].props
  if (!opts.every(o => o.props.type === type))
    throw new Error(
      '<Select> must only include either of <Option> and <Optgroup>.'
    )

  let initialOption: SlackOption | undefined

  const createAndMatchOption = (cmProps: OptionInternal) => {
    const opt: SlackOption = createOption(cmProps)

    if (typeof props.value === 'string' && opt.value === props.value) {
      initialOption = opt
    }

    return opt
  }

  const rest: Pick<StaticSelect, 'options' | 'option_groups'> = {}

  // TODO: Create `options` / `option_groups` prop by <SelectFragment> component
  // to support generating external data source with jsx-slack.
  switch (type) {
    case 'option':
      rest.options = (opts as JSXSlack.Node<OptionInternal>[]).map(n =>
        createAndMatchOption(n.props)
      )
      break
    case 'optgroup':
      rest.option_groups = (opts as JSXSlack.Node<OptgroupInternal>[]).map(
        n => ({
          label: {
            type: 'plain_text',
            text: n.props.label,
            emoji: true, // TODO: Controlable emoji
          },
          options: filter(n.props.children).map(o =>
            createAndMatchOption(o.props)
          ),
        })
      ) as any
      break
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }

  return (
    <ObjectOutput<StaticSelect>
      type="static_select"
      {...baseProps(props)}
      initial_option={initialOption}
      {...rest}
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
