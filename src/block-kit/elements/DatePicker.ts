import { Datepicker, InputBlock } from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { ActionProps, AutoFocusibleProps, focusOnLoadFromProps } from './utils'

interface DatePickerBaseProps
  extends ActionProps,
    AutoFocusibleProps,
    ConfirmableProps {
  children?: never

  /** The placeholder text shown in empty date picker field. */
  placeholder?: string

  /**
   * An initially selected date.
   *
   * It accepts `YYYY-MM-DD` formatted string, UNIX timestamp _in millisecond_,
   * and JavaScript `Date` instance.
   */
  initialDate?: string | number | Date

  /** An alias into `initialDate` prop. */
  value?: string | number | Date
}

type DatepickerElement = Datepicker

export type DatePickerProps = InputComponentProps<DatePickerBaseProps>

/**
 * The interactive component or input component for
 * [the `datepicker` block element](https://api.slack.com/reference/block-kit/block-elements#datepicker).
 *
 * It makes easy to select a date through the calendar interface.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <DatePicker actionId="date_picker" initialDate={new Date()} />
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for date picker, or `input`
 *   layout block with it
 */
export const DatePicker: BuiltInComponent<DatePickerProps> = createComponent<
  DatePickerProps,
  DatepickerElement | InputBlock
>('DatePicker', (props) => {
  const initialDate = props.initialDate || props.value

  let date: string | undefined =
    typeof initialDate === 'string' ? initialDate : undefined

  if (initialDate !== undefined) {
    try {
      const dateInstance = new Date(initialDate)
      date = [
        `${dateInstance.getFullYear()}`.padStart(4, '0'),
        `${dateInstance.getMonth() + 1}`.padStart(2, '0'),
        `${dateInstance.getDate()}`.padStart(2, '0'),
      ].join('-')
    } catch (e) {
      // Ignore (use an original value if passed string)
    }
  }

  return wrapInInput<DatepickerElement>(
    {
      type: 'datepicker',
      action_id: props.actionId || props.name,
      placeholder:
        props.placeholder !== undefined
          ? plainText(props.placeholder)
          : undefined,
      initial_date: date,
      confirm: props.confirm as any,
      focus_on_load: focusOnLoadFromProps(props),
    },
    props,
    DatePicker
  )
})
