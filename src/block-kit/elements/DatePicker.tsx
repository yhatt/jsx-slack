/** @jsx JSXSlack.h */
import { Datepicker } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { ConfirmProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { WithInputProps, wrapInInput } from '../Input'

export interface DatePickerBaseProps {
  actionId?: string
  children?: undefined
  confirm?: JSXSlack.Node<ConfirmProps>
  initialDate?: string | Date
  name?: string
  placeholder?: string
}

type DatePickerProps = WithInputProps<DatePickerBaseProps>

const formatYMD = (date: Date) =>
  [
    `${date.getFullYear()}`.padStart(4, '0'),
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('-')

export const DatePicker: JSXSlack.FC<DatePickerProps> = props => {
  const element = (
    <ObjectOutput<Datepicker>
      type="datepicker"
      action_id={props.actionId || props.name}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
      placeholder={props.placeholder ? plainText(props.placeholder) : undefined}
      initial_date={
        props.initialDate instanceof Date
          ? formatYMD(props.initialDate)
          : props.initialDate
      }
    />
  )

  return props.label ? wrapInInput(element, props) : element
}
