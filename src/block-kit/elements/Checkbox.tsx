/** @jsx JSXSlack.h */
import { MrkdwnElement } from '@slack/types'
import { findNode, pickInternalNodes } from './utils'
import { ConfirmProps } from '../composition/Confirm'
import { mrkdwnFromNode } from '../composition/utils'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { WithInputProps, wrapInInput } from '../Input'

const checkboxInternal = Symbol('checkboxInternal')

interface CheckboxOption {
  text: MrkdwnElement // jsx-slack alaways uses mrkdwn element
  value?: string
  description?: MrkdwnElement
}

interface CheckboxGroupPropsBase {
  actionId?: string
  children?: JSXSlack.Children<CheckboxProps>
  confirm?: JSXSlack.Node<ConfirmProps>
  name?: string
  values?: string[]
}

export type CheckboxGroupProps = WithInputProps<CheckboxGroupPropsBase>

export interface CheckboxProps {
  checked?: boolean
  children: JSXSlack.Children<{}>
  description?: JSXSlack.Children<{}>
  value: string
}

interface CheckboxInternalProps extends CheckboxProps {
  type: typeof checkboxInternal
}

const toOptionObject = (props: CheckboxInternalProps): CheckboxOption => {
  let description: JSXSlack.Children<{}> | undefined
  const small = findNode(props.children, ({ type }) => type === 'small')

  if (small) {
    description = small.children
    small.children = []
  }

  const option: CheckboxOption = {
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

export const CheckboxGroup: JSXSlack.FC<CheckboxGroupProps> = (props) => {
  const states = new Map<string, boolean>()
  const values = props.values || []

  const options = pickInternalNodes<CheckboxInternalProps>(
    checkboxInternal,
    props.children as JSXSlack.Children<CheckboxInternalProps>
  ).map(({ props: cProps }) => {
    if (cProps.value) {
      if (cProps.checked !== undefined) {
        states.set(cProps.value, !!cProps.checked)
      } else if (values.includes(cProps.value)) {
        states.set(cProps.value, true)
      }
    }
    return toOptionObject(cProps)
  })

  if (options.length === 0)
    throw new Error('<CheckboxGroup> must include least of one <Checkbox>.')

  const initialOptions = options.reduce(
    (arr, opt) => (opt.value && states.get(opt.value) ? [...arr, opt] : arr),
    [] as CheckboxOption[]
  )

  const element = (
    <ObjectOutput
      type="checkboxes"
      action_id={props.actionId || props.name}
      options={options}
      initial_options={initialOptions.length > 0 ? initialOptions : undefined}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    />
  )

  return props.label ? wrapInInput(element, props) : element
}

export const Checkbox: JSXSlack.FC<CheckboxProps> = (props) => (
  <ObjectOutput<CheckboxInternalProps> {...props} type={checkboxInternal} />
)
