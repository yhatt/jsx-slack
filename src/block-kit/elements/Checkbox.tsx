/** @jsx JSXSlack.h */
import { PlainTextElement, MrkdwnElement } from '@slack/types'
import { ConfirmProps } from '../composition/Confirm'
import { mrkdwnFromNode } from '../composition/utils'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, isNode } from '../../utils'
import { WithInputProps, wrapInInput } from '../Input'

const checkboxInternal = Symbol('checkboxInternal')

interface CheckboxOption {
  text: PlainTextElement | MrkdwnElement
  value?: string
  description?: PlainTextElement | MrkdwnElement
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

interface CheckboxInternal extends CheckboxProps {
  type: typeof checkboxInternal
}

const filterCheckbox = children =>
  JSXSlack.normalizeChildren(children).filter(
    c =>
      isNode(c) &&
      c.type === JSXSlack.NodeType.object &&
      c.props.type === checkboxInternal
  ) as JSXSlack.Node<CheckboxInternal>[]

const toOptionObject = (props: CheckboxInternal): CheckboxOption => {
  const option: CheckboxOption = {
    text: mrkdwnFromNode(props.children),
    value: props.value,
  }

  if (props.description) option.description = mrkdwnFromNode(props.description)

  return option
}

export const CheckboxGroup: JSXSlack.FC<CheckboxGroupProps> = props => {
  const states = new Map<string, boolean>()
  const values = props.values || []

  const options = filterCheckbox(props.children).map(({ props: cProps }) => {
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

export const Checkbox: JSXSlack.FC<CheckboxProps> = props => (
  <ObjectOutput<CheckboxInternal> {...props} type={checkboxInternal} />
)
