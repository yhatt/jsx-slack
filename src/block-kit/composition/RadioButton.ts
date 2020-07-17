import { MrkdwnElement } from '@slack/types'
import { JSXSlack, createComponent } from '../../jsx'
import { mrkdwn, mrkdwnForOption } from './Mrkdwn'

export const radioButtonCheckedSymbol = Symbol('jsx-slack-radio-button-checked')

export interface RadioButtonOption {
  text: MrkdwnElement
  description?: MrkdwnElement
  value: string
  readonly [radioButtonCheckedSymbol]?: boolean
}

export interface RadioButtonProps {
  children: JSXSlack.ChildElements

  /**
   * A boolean value to indicate an initially checked state of radio button.
   *
   * `<RadioButtonGroup>` component may reflect this state.
   */
  checked?: boolean

  /**
   * A string or JSX element for the description label of the radio button.
   *
   * It accepts formatting through HTML-like elements as same as the content.
   * The description label can see with faded color just below the main label.
   */
  description?: JSXSlack.ChildElements

  /** A string value to send to Slack App when choose the radio button. */
  value: string
}

/**
 * Define the radio button for the group container provided by
 * `<RadioButtonGroup>`.
 *
 * You should set the label for the radio button in its children. Both of the
 * content and `description` accept formatting through HTML-like elements
 * (but except external links by `<a>` tag: Slack will ignore link format).
 *
 * ```jsx
 * <RadioButton
 *  value="radio"
 *  description={
 *    <Fragment>
 *      It's a <i>description</i>.
 *    </Fragment>
 *  }
 * >
 *  <b>Radio button</b>
 * </RadioButton>
 * ```
 *
 * ### Redirect <small> into description
 *
 * `<RadioButton>` accepts using `<small>` element for ergonomic templating, to
 * redirect the content of `<small>` into `description` when `description` prop
 * was not defined.
 *
 * ```jsx
 * <RadioButton value="radio">
 *  <b>Radio button</b>
 *  <small>
 *    It's a <i>description</i>
 *  </small>
 * </RadioButton>
 * ```
 *
 * @return The JSON of the composition object for option suited to radio button
 */
export const RadioButton = createComponent<RadioButtonProps, RadioButtonOption>(
  'RadioButton',
  ({ children, checked, description, value }) => {
    const opt = { ...mrkdwnForOption(children), value }

    if (description !== undefined)
      opt.description = mrkdwn(description, { verbatim: opt.text.verbatim })

    if (checked !== undefined)
      Object.defineProperty(opt, radioButtonCheckedSymbol, { value: checked })

    return opt
  }
)
