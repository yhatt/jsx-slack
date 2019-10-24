/** @jsx JSXSlack.h */
import { Option } from '@slack/types'
import { ConfirmProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText, isNode } from '../../utils'

const radioButtonInternal = Symbol('radioButtonInternal')

export interface RadioButtonGroupProps {
  actionId?: string
  children?: JSXSlack.Children<any>
  confirm?: JSXSlack.Node<ConfirmProps>
  name?: string
  value?: string
}

export interface RadioButtonProps {
  children: JSXSlack.Children<{}>
  description?: string
  value: string
}

interface RadioButtonInternal extends RadioButtonProps {
  label: string
  type: typeof radioButtonInternal
}

const filterRadioButtons = children =>
  JSXSlack.normalizeChildren(children).filter(
    c =>
      isNode(c) &&
      c.type === JSXSlack.NodeType.object &&
      c.props.type === radioButtonInternal
  ) as JSXSlack.Node<RadioButtonInternal>[]

const toOptionObject = (props: RadioButtonInternal): Option => {
  const option: Option = {
    text: plainText(props.label),
    value: props.value,
  }

  if (props.description) option.description = plainText(props.description)

  return option
}

export const RadioButtonGroup: JSXSlack.FC<RadioButtonGroupProps> = props => {
  const options = filterRadioButtons(props.children).map(radio =>
    toOptionObject(radio.props)
  )

  if (options.length === 0)
    throw new Error(
      '<RadioButtonGroup> must include least of one <RadioButton>.'
    )

  const initialOption = props.value
    ? options.find(o => o.value === props.value)
    : undefined

  return (
    <ObjectOutput
      type="radio_buttons"
      action_id={props.actionId || props.name}
      options={options}
      initial_option={initialOption}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    />
  )
}

export const RadioButton: JSXSlack.FC<RadioButtonProps> = props => (
  <ObjectOutput<RadioButtonInternal>
    {...props}
    type={radioButtonInternal}
    label={JSXSlack(<PlainText>{props.children}</PlainText>)}
  />
)
