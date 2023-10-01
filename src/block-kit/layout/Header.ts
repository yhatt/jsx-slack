import { HeaderBlock } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'
import { LayoutBlockProps } from './utils'

export interface HeaderProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

/**
 * [The `header` layout block](https://api.slack.com/reference/messaging/blocks#header)
 * to display plain text with bold font in a larger.
 *
 * ```jsx
 * <Blocks>
 *   <Header>
 *     Heads up!
 *   </Header>
 * </Blocks>
 * ```
 *
 * `<Header>` allows only a plain text. You cannot apply text styling through
 * HTML-like tags.
 *
 * @return The partial JSON for `header` layout block
 */
export const Header = createComponent<HeaderProps, HeaderBlock>(
  'Header',
  ({ blockId, children, id }) => ({
    type: 'header',
    block_id: blockId || id,
    text: plainText(children, { layoutTags: true }),
  }),
)
