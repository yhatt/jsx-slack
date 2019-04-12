/** @jsx JSXSlack.h */
import { Datepicker } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import { ConfirmProps } from '../composition/Confirm'

export interface DatePickerProps {
  actionId?: string
  children?: undefined
  confirm?: JSXSlack.Node<ConfirmProps>
  initialDate?: string | Date
  placeholder?: string
}

const formatYMD = (date: Date) =>
  [
    `${date.getFullYear()}`.padStart(4, '0'),
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('-')

export const DatePicker: JSXSlack.FC<DatePickerProps> = props => (
  <ObjectOutput<Datepicker>
    type="datepicker"
    action_id={props.actionId}
    confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
    placeholder={
      props.placeholder
        ? {
            type: 'plain_text',
            text: props.placeholder,
            emoji: true, // TODO: Controlable emoji
          }
        : undefined
    }
    initial_date={
      props.initialDate instanceof Date
        ? formatYMD(props.initialDate)
        : props.initialDate
    }
  />
)
