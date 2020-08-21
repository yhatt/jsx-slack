import { Confirm as SlackConfirm } from '@slack/types'
import { JSXSlack, createComponent } from '../../jsx'
import { mrkdwn } from './Mrkdwn'
import { plainText } from './utils'

export interface ConfirmProps {
  children: JSXSlack.ChildElements

  /**
   * A text content of the button to confirm.
   *
   * Slack would use the default localized label if not defined.
   */
  confirm?: string

  /**
   * A text content of the button to cancel.
   *
   * Slack would use the default localized label if not defined.
   */
  deny?: string

  /**
   * Select the color scheme of the confirm button from `primary` and `danger`.
   *
   * - `primary`: Green button on desktop, and blue text on mobile.
   * - `danger`: Red button on desktop, and red text on mobile.
   *
   * If not defined, Slack will render the button in `primary` color scheme.
   *
   * @remark
   * It may inherit the style from assigned component when not defined specific
   * value in the composition object. e.g. `<Button style="...">`.
   */
  style?: 'danger' | 'primary'

  /** The title of confirmation dialog. */
  title?: string
}

export interface ConfirmableProps {
  /**
   * `<Confirm>` element or the raw
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirmation dialog composition object},
   * for providing a confirmation step to interactive components.
   *
   * @example
   * ```jsx
   * <Button
   *   actionId="commit"
   *   confirm={
   *     <Confirm title="Commit your action" confirm="Yes, please" deny="Cancel">
   *       <b>Are you sure?</b> Please confirm your action again.
   *     </Confirm>
   *   }
   * >
   *   Commit
   * </Button>
   * ```
   */
  confirm?: SlackConfirm | JSXSlack.Node<ConfirmProps>
}

/**
 * Generate the composition object for confirmation dialog.
 *
 * Many interactive elements can provide a confirmation step by passing
 * generated object in `<Confirm>` to `confirm` prop.
 *
 * You can use HTML-like formatting to the content of confirmation dialog.
 * However, you have to be careful Slack ignores any line breaks. The content
 * would render just in a line.
 *
 * @example
 * ```jsx
 * <Button
 *   actionId="commit"
 *   confirm={
 *     <Confirm title="Commit your action" confirm="Yes, please" deny="Cancel">
 *       <b>Are you sure?</b> Please confirm your action again.
 *     </Confirm>
 *   }
 * >
 *   Commit
 * </Button>
 * ```
 *
 * @return The JSON of the composition object for confirmation dialog
 */
export const Confirm = createComponent<ConfirmProps, SlackConfirm>(
  'Confirm',
  ({ children, confirm, deny, style, title }) => ({
    title: title !== undefined ? plainText(title) : undefined,
    text: mrkdwn(children),
    confirm: confirm !== undefined ? plainText(confirm) : undefined,
    deny: deny !== undefined ? plainText(deny) : undefined,
    style,
  })
)
