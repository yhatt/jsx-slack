import { Datepicker } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { createComponent } from '../../jsx'

export interface DatePickerProps extends ActionProps, ConfirmableProps {
  children?: undefined
  placeholder?: string
  initialDate?: string | number | Date
}

export const DatePicker = createComponent<DatePickerProps, Datepicker>(
  'DatePicker',
  (props) => {
    let date: string | undefined =
      typeof props.initialDate === 'string' ? props.initialDate : undefined

    if (props.initialDate !== undefined) {
      try {
        const dateInstance = new Date(props.initialDate)
        date = [
          `${dateInstance.getFullYear()}`.padStart(4, '0'),
          `${dateInstance.getMonth() + 1}`.padStart(2, '0'),
          `${dateInstance.getDate()}`.padStart(2, '0'),
        ].join('-')
      } catch (e) {
        // ignore
      }
    }

    return {
      type: 'datepicker',
      action_id: props.actionId || props.name,
      placeholder:
        props.placeholder !== undefined
          ? plainText(props.placeholder)
          : undefined,
      initial_date: date,
      confirm: props.confirm as any,
    }
  }
)
