/** @jsx JSXSlack.h */
import { Dialog, SelectOption } from '@slack/types'
import {
  Optgroup,
  OptgroupInternal,
  Option,
  OptionInternal,
} from '../block-kit/interactive/Select'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'

interface SelectFragmentProps {
  children: JSXSlack.Children<any>
}

interface SelectPropsBase {
  label: string
  name: string
  placeholder?: string
  required?: boolean
}

interface SelectProps extends SelectPropsBase {
  children: JSXSlack.Children<OptionInternal | OptgroupInternal>
  value?: string
}

interface ExternalSelectProps extends SelectPropsBase {
  children?: undefined
  initialOption?: JSXSlack.Node<OptionInternal> | SelectOption
  minQueryLength?: number
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

type DialogElement = Dialog['elements'][0]

type SelectBase = Pick<
  DialogElement,
  | 'data_source'
  | 'label'
  | 'name'
  | 'optional'
  | 'placeholder'
  | 'type'
  | 'value'
> & { type: 'select' }

type SelectFragmentObject<T extends 'options' | 'option_groups'> = Pick<
  DialogElement,
  T
>

type StaticSelectElement = Omit<SelectBase, 'data_source'> &
  Pick<DialogElement, 'option_groups' | 'options'>

type ExternalSelectElement = Omit<SelectBase, 'value'> &
  Pick<DialogElement, 'min_query_length' | 'selected_options'> & {
    data_source: 'external'
  }

type UsersSelectElement = SelectBase & { data_source: 'users' }
type ConversationsSelectElement = SelectBase & { data_source: 'conversations' }
type ChannelsSelectElement = SelectBase & { data_source: 'channels' }

const baseProps = (props: SelectPropsBase) => ({
  label: props.label,
  name: props.name,
  optional: !props.required,
  placeholder: props.placeholder,
  type: 'select' as const,
})

const createOption = ({ value, text }: OptionInternal): SelectOption => ({
  value,
  label: text,
})

const filter = <T extends {}>(children: JSXSlack.Children<T>) =>
  JSXSlack.normalizeChildren(children).filter(
    o => typeof o !== 'string'
  ) as JSXSlack.Node<T>[]

export const SelectFragment: JSXSlack.FC<SelectFragmentProps> = props => {
  const opts = filter(props.children)

  if (opts.length === 0)
    throw new Error(
      'Component for selection must include least of one <Option> or <Optgroup>.'
    )

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
          option_groups={(opts as JSXSlack.Node<OptgroupInternal>[]).map(n => ({
            label: n.props.label,
            options: filter(n.props.children).map(o => createOption(o.props)),
          }))}
        />
      )
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }
}

export const Select: JSXSlack.FC<SelectProps> = props => {
  const fragment: SelectFragmentObject<'options' | 'option_groups'> = JSXSlack(
    <SelectFragment children={props.children} />
  )

  return (
    <ObjectOutput<StaticSelectElement>
      {...baseProps(props)}
      value={props.value}
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
    <ObjectOutput<ExternalSelectElement>
      {...baseProps(props)}
      data_source="external"
      min_query_length={props.minQueryLength}
      selected_options={initial ? [initial] : undefined}
    />
  )
}

export const UsersSelect: JSXSlack.FC<UsersSelectProps> = props => (
  <ObjectOutput<UsersSelectElement>
    {...baseProps(props)}
    data_source="users"
    value={props.initialUser}
  />
)

export const ConversationsSelect: JSXSlack.FC<
  ConversationsSelectProps
> = props => (
  <ObjectOutput<ConversationsSelectElement>
    {...baseProps(props)}
    data_source="conversations"
    value={props.initialConversation}
  />
)

export const ChannelsSelect: JSXSlack.FC<ChannelsSelectProps> = props => (
  <ObjectOutput<ChannelsSelectElement>
    {...baseProps(props)}
    data_source="channels"
    value={props.initialChannel}
  />
)

export { Option, Optgroup }
