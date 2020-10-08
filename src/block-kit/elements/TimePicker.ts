import { Action, Confirm, PlainTextElement, InputBlock } from '@slack/types'
import { BuiltInComponent, createComponent } from '../../jsx'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { InputComponentProps, wrapInInput } from '../layout/Input'
import { ActionProps } from './utils'

// TODO: Use Timepicker type from @slack/types
type Timepicker = Action & {
  type: 'timepicker'
  initial_time?: string
  placeholder?: PlainTextElement
  confirm?: Confirm
}

interface TimePickerBaseProps extends ActionProps, ConfirmableProps {
  children?: never

  /** The placeholder text shown in empty time picker field. */
  placeholder?: string

  /**
   * An initially selected time.
   *
   * It accepts `HH:mm` formatted string, and a value that points out designated
   * datetime: UNIX timestamp _in millisecond_ or JavaScript `Date` instance.
   */
  initialTime?: string | number | Date

  /** An alias into `initialTime` prop. */
  value?: string | number | Date
}

export type TimePickerProps = InputComponentProps<TimePickerBaseProps>

/**
 * The interactive component or input component for
 * {@link https://api.slack.com/reference/block-kit/block-elements#timepicker the `timepicker` block element}.
 *
 * It makes easy to select the specific time through a dropdown or a native
 * interface suited to the device.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <TimePicker actionId="time_picker" initialTime="12:34" />
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for time picker, or `input`
 *   layout block with it
 */
export const TimePicker: BuiltInComponent<TimePickerProps> = createComponent<
  TimePickerProps,
  Timepicker | InputBlock
>('TimePicker', (props) => {
  const time: string | undefined = ((initialTime) => {
    if (initialTime !== undefined) {
      if (typeof initialTime === 'string') return initialTime

      try {
        const dateInstance = new Date(initialTime)

        return [
          `${dateInstance.getHours()}`.padStart(2, '0'),
          `${dateInstance.getMinutes()}`.padStart(2, '0'),
        ].join(':')
      } catch (e) {
        // Ignore
      }
    }
    return undefined
  })(props.initialTime || props.value)

  return wrapInInput<Timepicker>(
    {
      type: 'timepicker',
      action_id: props.actionId || props.name,
      placeholder:
        props.placeholder !== undefined
          ? plainText(props.placeholder)
          : undefined,
      initial_time: time,
      confirm: props.confirm as any,
    },
    props,
    TimePicker
  )
})
