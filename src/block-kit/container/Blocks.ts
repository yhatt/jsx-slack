import { generateBlocksContainer } from './utils'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'
import { Section } from '../layout/Section'

/**
 * The basic container component for Slack Block Kit suited to
 * {@link https://api.slack.com/surfaces/messages|messages}.
 *
 * `<Blocks>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Context>`
 * - `<Actions>`
 * - `<File>`
 *
 * @example
 * ```jsx
 * api.chat.postMessage({
 *   channel: 'C1232456',
 *   blocks: (
 *     <Blocks>
 *       <Section>Hello, world!</Section>
 *     </Blocks>
 *   ),
 * })
 * ```
 *
 * **NOTE**: TypeScript requires to cast JSX into suited type / `any`, or wrap
 * with `JSXSlack(<Blocks>...</Blocks>)`.
 *
 * @return An array of block elements, for `blocks` field in
 *  {@link https://api.slack.com/methods/chat.postMessage|chat.postMessage} API.
 */
export const Blocks = generateBlocksContainer({
  name: 'Blocks',
  availableBlockTypes: [
    'actions',
    'context',
    'divider',
    'file',
    'image',
    'section',
  ],
  aliases: {
    hr: Divider,
    img: Image,
    section: Section,
  },
})
