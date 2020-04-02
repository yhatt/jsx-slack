import { Datepicker, InputBlock } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { BuiltInComponent, createComponent } from '../../jsx'

interface DatePickerBaseProps extends ActionProps, ConfirmableProps {
  children?: never
  placeholder?: string
  initialDate?: string | number | Date
}

export type DatePickerProps = InputComponentProps<DatePickerBaseProps>

export const DatePicker: BuiltInComponent<DatePickerProps> = createComponent<
  DatePickerProps,
  Datepicker | InputBlock
>('DatePicker', (props) => {
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
      // Ignore (use an original value if passed string)
    }
  }

  return wrapInInput<Datepicker>(
    {
      type: 'datepicker',
      action_id: props.actionId || props.name,
      placeholder:
        props.placeholder !== undefined
          ? plainText(props.placeholder)
          : undefined,
      initial_date: date,
      confirm: props.confirm as any,
    },
    props,
    DatePicker
  )
})
