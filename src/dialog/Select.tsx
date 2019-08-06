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
import { validateElement } from './Dialog'
import { DialogValidationError } from './error'

interface SelectFragmentProps {
  children?: JSXSlack.Children<OptionInternal | OptgroupInternal>
}

interface SelectPropsBase {
  hint?: string
  label: string
  name: string
  placeholder?: string
  required?: boolean
  title?: string
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
  | 'hint'
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

const baseProps = (props: SelectPropsBase) => {
  const validated = validateElement(props)

  if (props.placeholder && props.placeholder.length > 150)
    throw new DialogValidationError(
      `A placeholder string of select field must be up to 150 characters but a string with ${props.placeholder.length} characters was passed.`
    )

  return {
    hint: validated.hint,
    label: props.label,
    name: props.name,
    optional: !props.required,
    placeholder: props.placeholder,
    type: 'select' as const,
  }
}

const createOption = ({ value, text }: OptionInternal): SelectOption => {
  if (value.length > 75)
    throw new DialogValidationError(
      `A value string of the option for select field must be up to 75 characters but a string with ${value.length} characters was passed.`
    )

  if (text.length > 75)
    throw new DialogValidationError(
      `A label of the option for select field must be up to 75 characters but a string with ${text.length} characters was passed.`
    )

  return { value, label: text }
}

const filter = <T extends {}>(children: JSXSlack.Children<T>) =>
  JSXSlack.normalizeChildren(children).filter(
    o => typeof o !== 'string'
  ) as JSXSlack.Node<T>[]

const generateFragment = (
  children: JSXSlack.Children<OptionInternal | OptgroupInternal>
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
    case 'option': {
      const options = (opts as JSXSlack.Node<OptionInternal>[]).map(n =>
        createOption(n.props)
      )

      if (options.length > 100)
        throw new DialogValidationError(
          `Up to 100 options can provide in select field but ${options.length} options were passed.`
        )

      return <ObjectOutput<SelectFragmentObject<'options'>> options={options} />
    }
    case 'optgroup': {
      let optsCount = 0

      const optGroups = (opts as JSXSlack.Node<OptgroupInternal>[]).map(n => {
        const { children, label } = n.props
        const options = filter(children).map(o => createOption(o.props))

        if (label.length > 75)
          throw new DialogValidationError(
            `A label of the option group for select field must be up to 75 characters but a string with ${label.length} characters was passed.`
          )

        optsCount += options.length
        return { label, options }
      })

      if (optsCount > 100)
        throw new DialogValidationError(
          `Up to 100 options can provide in select field but ${optsCount} options were passed.`
        )

      return (
        <ObjectOutput<SelectFragmentObject<'option_groups'>>
          option_groups={optGroups}
        />
      )
    }
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }
}

export const Select: JSXSlack.FC<SelectProps> = props => (
  <ObjectOutput<StaticSelectElement>
    {...baseProps(props)}
    value={props.value}
    {...generateFragment(props.children)}
  />
)

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
