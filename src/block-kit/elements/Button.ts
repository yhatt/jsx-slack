import { Button as ButtonElement, ConfirmationDialog } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { assignMetaFrom } from '../utils'
import { ActionProps } from './utils'

export interface ButtonProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildElements

  /**
   * A string label for setting an accessible name of the button. This label
   * will be read out by screen readers instead of the text content of the
   * button. It must up to 75 characters.
   */
  accessibilityLabel?: string

  /**
   * An alias to `accessibilityLabel` prop that is compatible with WAI-ARIA.
   */
  'aria-label'?: string

  /**
   * Select the color scheme of the button from `primary` (Green button) and
   * `danger` (Red button). If not defined, the button won't be colored.
   *
   * This style value may be inherited if assigned `confirm` composition object
   * does not define `style`.
   */
  style?: 'danger' | 'primary'

  /**
   * An external URL to load when clicked button.
   *
   * You still have to send an acknowledge response for Slack's event callback
   * even if setting URL to button.
   */
  url?: string

  /**
   * A string value up to 2000 characters, for sending to Slack App along with
   * the interaction payload when clicked button.
   */
  value?: string
}

/**
 * The interactive component for
 * [the `button` element](https://api.slack.com/reference/block-kit/block-elements#button).
 *
 * You should set the plain-text label for the button in its children.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <Button actionId="action" value="value" style="primary">
 *       Action button
 *     </Button>
 *     <Button actionId="url" url="https://example.com/">Open URL</Button>
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for button
 */
export const Button = createComponent<ButtonProps, ButtonElement>(
  'Button',
  (props) => {
    let confirm: ConfirmationDialog | undefined

    if (props.confirm) {
      confirm = props.confirm as ConfirmationDialog

      if (confirm.style === undefined && props.style !== undefined) {
        confirm = { ...confirm, style: props.style }

        if (JSXSlack.isValidElement(props.confirm))
          assignMetaFrom(props.confirm, confirm)
      }
    }

    return {
      type: 'button',
      action_id: props.actionId || props.name,
      accessibility_label: props.accessibilityLabel ?? props['aria-label'],
      text: plainText(props.children),
      value: props.value,
      url: props.url,
      style: props.style,
      confirm,
    }
  },
)
