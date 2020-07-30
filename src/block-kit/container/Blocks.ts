import { availableActionTypes } from '../layout/Actions'
import { Divider } from '../layout/Divider'
import { Header } from '../layout/Header'
import { Image } from '../layout/Image'
import { availableSectionAccessoryTypes, Section } from '../layout/Section'
import {
  generateActionsValidator,
  generateBlocksContainer,
  generateSectionValidator,
} from './utils'

// Message block cannot use "radio_buttons" and "checkboxes"
const blockTypeFilter = (t) => t !== 'radio_buttons' && t !== 'checkboxes'

/**
 * The basic container component for Slack Block Kit suited to
 * {@link https://api.slack.com/surfaces/messages|messages}.
 *
 * `<Blocks>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Header>` (`<header>`)
 * - `<Context>`
 * - `<Actions>`
 * - `<File>`
 * - `<Call>`
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
  availableBlockTypes: {
    actions: generateActionsValidator(
      availableActionTypes.filter(blockTypeFilter)
    ),
    call: true,
    context: true,
    divider: true,
    file: true,
    header: true,
    image: true,
    section: generateSectionValidator(
      availableSectionAccessoryTypes.filter(blockTypeFilter)
    ),
  },
  aliases: {
    header: Header,
    hr: Divider,
    img: Image,
    section: Section,
  },
})
