import { Datepicker, InputBlock } from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx-internals'
import { ConfirmableProps } from '../composition/Confirm'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { ActionProps, AutoFocusibleProps, focusOnLoadFromProps } from './utils'

interface DateTimePickerBaseProps
  extends ActionProps,
    AutoFocusibleProps,
    ConfirmableProps {
  children?: never

  /**
   * An initially selected date and time.
   *
   * It accepts a formatted string with ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`),
   * UNIX timestamp _in millisecond_, and JavaScript `Date` instance.
   */
  initialDateTime?: string | number | Date

  /** An alias into `initialDate` prop. */
  value?: string | number | Date
}

// TODO: Use official type when it was available in `@slack/types`
type DatetimepickerElement = Omit<
  Datepicker,
  'type' | 'initial_date' | 'placeholder'
> & {
  type: 'datetimepicker'
  initial_date_time?: number
}

export type DateTimePickerProps = InputComponentProps<DateTimePickerBaseProps>

/**
 * The interactive component or input component for
 * [the `datetimepicker` block element](https://api.slack.com/reference/block-kit/block-elements#datetimepicker).
 *
 * Users can pick a specific date and specific time at the same time.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <DateTimePicker actionId="date_time_picker" initialDate={new Date()} />
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for date time picker, or `input`
 *   layout block with it
 */
export const DateTimePicker: BuiltInComponent<DateTimePickerProps> =
  createComponent<DateTimePickerProps, DatetimepickerElement | InputBlock>(
    'DateTimePicker',
    (props) => {
      const initialDate = props.initialDateTime || props.value

      let datetime: number | undefined =
        typeof initialDate === 'number' ? initialDate : undefined

      if (initialDate !== undefined) {
        try {
          const unixtimeMs = (() => {
            if (typeof initialDate === 'string') {
              return Date.parse(initialDate)
            } else if (typeof initialDate === 'number') {
              return initialDate
            } else if (initialDate instanceof Date) {
              return initialDate.getTime()
            }
          })()

          if (unixtimeMs !== undefined) datetime = Math.floor(unixtimeMs / 1000)
        } catch (e) {
          // Ignore (use an original value if passed number)
        }
      }

      return wrapInInput<DatetimepickerElement>(
        {
          type: 'datetimepicker',
          action_id: props.actionId || props.name,
          initial_date_time: datetime,
          confirm: props.confirm as any,
          focus_on_load: focusOnLoadFromProps(props),
        },
        props,
        DateTimePicker
      )
    }
  )
