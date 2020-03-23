/** @jsx JSXSlack.h */
import { MrkdwnElement } from '@slack/types'
import { findNode, pickInternalNodes } from './utils'
import { ConfirmProps } from '../composition/Confirm'
import { mrkdwnFromNode } from '../composition/utils'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { WithInputProps, wrapInInput } from '../Input'

const radioButtonInternal = Symbol('radioButtonInternal')

interface RadioButtonOption {
  text: MrkdwnElement // jsx-slack alaways uses mrkdwn element
  value?: string
  description?: MrkdwnElement
}

interface RadioButtonGroupPropsBase {
  actionId?: string
  children?: JSXSlack.Children<RadioButtonProps>
  confirm?: JSXSlack.Node<ConfirmProps>
  name?: string
  value?: string
}

export type RadioButtonGroupProps = WithInputProps<RadioButtonGroupPropsBase>

export interface RadioButtonProps {
  children: JSXSlack.Children<{}>
  description?: JSXSlack.Children<{}>
  value: string
}

interface RadioButtonInternalProps extends RadioButtonProps {
  type: typeof radioButtonInternal
}

const toOptionObject = (props: RadioButtonInternalProps): RadioButtonOption => {
  let description: JSXSlack.Children<{}> | undefined
  const small = findNode(props.children, ({ type }) => type === 'small')

  if (small) {
    description = small.children
    small.children = []
  }

  const option: RadioButtonOption = {
    text: mrkdwnFromNode(props.children),
    value: props.value,
  }

  description = props.description || description

  if (description)
    option.description = mrkdwnFromNode(description, {
      verbatim: option.text.verbatim,
    })

  return option
}

export const RadioButtonGroup: JSXSlack.FC<RadioButtonGroupProps> = (props) => {
  const options = pickInternalNodes<RadioButtonInternalProps>(
    radioButtonInternal,
    props.children as JSXSlack.Children<RadioButtonInternalProps>
  ).map((radio) => toOptionObject(radio.props))

  if (options.length === 0)
    throw new Error(
      '<RadioButtonGroup> must include least of one <RadioButton>.'
    )

  const initialOption = props.value
    ? options.find((o) => o.value === props.value)
    : undefined

  const element = (
    <ObjectOutput
      type="radio_buttons"
      action_id={props.actionId || props.name}
      options={options}
      initial_option={initialOption}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    />
  )

  return props.label ? wrapInInput(element, props) : element
}

export const RadioButton: JSXSlack.FC<RadioButtonProps> = (props) => (
  <ObjectOutput<RadioButtonInternalProps>
    {...props}
    type={radioButtonInternal}
  />
)
