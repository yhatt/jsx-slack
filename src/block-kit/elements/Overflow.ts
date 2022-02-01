import { PlainTextOption, Overflow as OverflowElement } from '@slack/types'
import { JSXSlackError } from '../../error'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { resolveTagName } from '../utils'
import { ActionProps } from './utils'

export interface OverflowItemProps {
  children: JSXSlack.ChildElements

  /**
   * An external URL to load when clicked menu item.
   *
   * You still have to send an acknowledge response for Slack's event callback
   * even if setting URL to menu item.
   */
  url?: string

  /**
   * A string value up to 75 characters, for sending to Slack App along with the
   * interaction payload when clicked menu item.
   */
  value?: string
}

export interface OverflowProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes
}

/**
 * Define menu item for the overflow menu provided by `<Overflow>`.
 *
 * You should set the plain-text label for the menu item in its children.
 *
 * @return The JSON of the composition object for option suited to overflow menu
 */
export const OverflowItem = createComponent<OverflowItemProps, PlainTextOption>(
  'OverflowItem',
  ({ children, url, value }) => ({ text: plainText(children), url, value })
)

/**
 * The interactive component for
 * [the `overflow` block element](https://api.slack.com/reference/block-kit/block-elements#overflow).
 *
 * It provides an overflow menu button displayed as "...". User can access to
 * some menu items defined by `<OverflowItem>` in children by click the button.
 *
 * `<Overflow>` must contain 1 to 5 `<OverflowItem>` component(s).
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <Overflow actionId="overflow_menu">
 *       <OverflowItem value="share">Share</OverflowItem>
 *       <OverflowItem value="reply">Reply message</OverflowItem>
 *       <OverflowItem value="open" url="https://example.com/">Open in browser</OverflowItem>
 *     </Overflow>
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for overflow menu
 */
export const Overflow = createComponent<OverflowProps, OverflowElement>(
  'Overflow',
  (props) => {
    const options = JSXSlack.Children.toArray(props.children).filter(
      (option): option is PlainTextOption => {
        if (!JSXSlack.isValidElement(option)) return false

        if (option.$$jsxslack.type !== OverflowItem) {
          const tag = resolveTagName(option)
          throw new JSXSlackError(
            `<Overflow> must contain only <OverflowItem>${
              tag ? ` but it is included ${tag}` : ''
            }.`,
            option
          )
        }

        return true
      }
    )

    if (options.length < 1)
      throw new JSXSlackError(
        '<Overflow> must contain least of 1 <OverflowItem>.',
        props['__source']
      )

    if (options.length > 5)
      throw new JSXSlackError(
        `<Overflow> must contain up to 5 <OverflowItem> elements but there are ${options.length} elements.`,
        props['__source']
      )

    return {
      type: 'overflow',
      action_id: props.actionId || props.name,
      options,
      confirm: props.confirm as any,
    }
  }
)
