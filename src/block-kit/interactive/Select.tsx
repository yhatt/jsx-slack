/** @jsx JSXSlack.h */
import { StaticSelect } from '@slack/client'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { wrap } from '../../utils'

enum SelectType {
  option = 'option',
  optgroup = 'optgroup',
}

interface SelectProps<
  T extends InternalOptionProps | InternalOptgroupProps = InternalOptionProps
> {
  actionId: string
  placeholder: string
  value?: string
  confirm?: JSXSlack.Node<ConfirmProps>
  children: JSXSlack.Node<T> | JSXSlack.Node<T>[]
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
}

interface InternalOptgroupProps extends OptgroupProps {
  type: 'optgroup'
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

  switch (type) {
    case 'option':
      break
    case 'optgroup':
      break
    default:
      throw new Error(`Unexpected option type: ${type}`)
  }

  return (
    <JSXSlack.Obj
      type="static_select"
      placeholder={props.placeholder}
      action_id={props.actionId}
      // options
      initial_option={typeof props.value === 'string' ? props.value : undefined}
      confirm={props.confirm}
    />
  )
}

export const Option: JSXSlack.FC<OptionProps> = (
  props
): JSXSlack.Node<InternalOptionProps> => (
  <JSXSlack.Obj {...props} type="option" />
)

export const Optgroup: JSXSlack.FC<OptgroupProps> = (
  props
): JSXSlack.Node<InternalOptgroupProps> => (
  <JSXSlack.Obj {...props} type="optgroup" />
)
