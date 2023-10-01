import { MrkdwnElement } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { mrkdwn, mrkdwnForOption } from './Mrkdwn'

export const checkboxCheckedSymbol = Symbol('jsx-slack-checkbox-checked')

export interface CheckboxOption {
  text: MrkdwnElement
  description?: MrkdwnElement
  value: string
  readonly [checkboxCheckedSymbol]?: boolean
}

export interface CheckboxProps {
  children: JSXSlack.ChildElements

  /**
   * A boolean value to indicate an initially checked state of checkbox.
   *
   * `<CheckboxGroup>` component may reflect this state.
   */
  checked?: boolean

  /**
   * A string or JSX element for the description label of the checkbox.
   *
   * It accepts formatting through HTML-like elements as same as the content.
   * The description label can see with faded color just below the main label.
   */
  description?: JSXSlack.ChildElements

  /** A string value to send to Slack App when choose the checkbox. */
  value: string
}

/**
 * Define the checkbox for the group container provided by `<CheckboxGroup>`.
 *
 * You should set the label for the checkbox in its children. Both of the
 * content and `description` accept formatting through HTML-like elements
 * (but except external links by `<a>` tag: Slack will ignore link format).
 *
 * ```jsx
 * <Checkbox
 *  value="check"
 *  description={
 *    <>
 *      It's a <i>description</i>.
 *    </>
 *  }
 * >
 *  <b>Checkbox</b>
 * </Checkbox>
 * ```
 *
 * ### Redirect <small> into description
 *
 * `<Checkbox>` accepts using `<small>` element for ergonomic templating, to
 * redirect the content of `<small>` into `description` when `description` prop
 * was not defined.
 *
 * ```jsx
 * <Checkbox value="check">
 *  <b>Checkbox</b>
 *  <small>
 *    It's a <i>description</i>
 *  </small>
 * </Checkbox>
 * ```
 *
 * @return The JSON of the composition object for option suited to checkbox
 */
export const Checkbox = createComponent<CheckboxProps, CheckboxOption>(
  'Checkbox',
  ({ children, checked, description, value }) => {
    const opt = { ...mrkdwnForOption(children), value }

    if (description !== undefined)
      opt.description = mrkdwn(description, { verbatim: opt.text.verbatim })

    if (checked !== undefined)
      Object.defineProperty(opt, checkboxCheckedSymbol, { value: checked })

    return opt
  },
)
