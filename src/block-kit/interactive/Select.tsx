/** @jsx JSXSlack.h */
import { StaticSelect, Option as SlackOption } from '@slack/client'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { wrap } from '../../utils'

interface SelectProps {
  actionId: string
  placeholder: string
  value?: string
  confirm?: JSXSlack.Node<ConfirmProps>
  children:
    | JSXSlack.Node<InternalOptionProps>
    | JSXSlack.Node<InternalOptgroupProps>
    | JSXSlack.Node<InternalOptionProps>[]
    | JSXSlack.Node<InternalOptgroupProps>[]
}

interface OptionProps {
  value: string
  children: JSXSlack.Children
}

interface OptgroupProps {
  label: string
  children:
    | JSXSlack.Node<InternalOptionProps>
    | JSXSlack.Node<InternalOptionProps>[]
}

interface InternalOptionProps extends OptionProps {
  type: 'option'
  text: string
}

interface InternalOptgroupProps extends OptgroupProps {
  type: 'optgroup'
  internalChildren: OptgroupProps['children'] // JSXSlack.Obj will remove children prop
}

export const Select: JSXSlack.FC<SelectProps> = (
  props
): JSXSlack.Node<StaticSelect> => {
  const opts = wrap(props.children as JSXSlack.Node)
  if (opts.length === 0)
    throw new Error(
      '<Select> must includes least of one <Option> or <Optgroup>.'
    )

  const { type } = opts[0].props
  if (!opts.every(o => o.props.type === type))
    throw new Error(
      '<Select> must only includes either of <Option> and <Optgroup>.'
    )

  let initialOption: SlackOption | undefined

  const createOption = ({ value, text }: InternalOptionProps): SlackOption => {
    const opt: SlackOption = {
      value,
      text: { text, type: 'plain_text', emoji: true }, // TODO: Controlable emoji
    }

    if (typeof props.value === 'string' && opt.value === props.value) {
      initialOption = opt
    }

    return opt
  }

  const rest: any = {}

  switch (type) {
    case 'option':
      rest.options = opts.map((n: JSXSlack.Node<InternalOptionProps>) =>
        createOption(n.props)
      )
      break
    case 'optgroup':
      rest.option_groups = opts.map(
        (n: JSXSlack.Node<InternalOptgroupProps>) => ({
          label: {
            type: 'plain_text',
            text: n.props.label,
            emoji: true, // TODO: Controlable emoji
          },
          options: wrap(n.props.internalChildren).map(o =>
            createOption(o.props)
          ),
        })
      )
      break
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }

  return (
    <JSXSlack.Obj
      type="static_select"
      placeholder={{
        type: 'plain_text',
        text: props.placeholder,
        emoji: true, // TODO: Controlable emoji
      }}
      action_id={props.actionId}
      initial_option={initialOption}
      confirm={props.confirm}
      {...rest}
    />
  )
}

export const Option: JSXSlack.FC<OptionProps> = (
  props
): JSXSlack.Node<InternalOptionProps> => (
  <JSXSlack.Obj
    {...props}
    type="option"
    text={JSXSlack(<JSXSlack.Str>{props.children}</JSXSlack.Str>)}
  />
)

export const Optgroup: JSXSlack.FC<OptgroupProps> = (
  props
): JSXSlack.Node<InternalOptgroupProps> => (
  <JSXSlack.Obj {...props} type="optgroup" internalChildren={props.children} />
)
