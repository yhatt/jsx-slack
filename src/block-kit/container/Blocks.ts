/* eslint-disable @typescript-eslint/no-empty-function */
import {
  generateActionsValidator,
  generateBlocksContainer,
  generateSectionValidator,
} from './utils'
import { availableActionTypes } from '../layout/Actions'
import { availableSectionAccessoryTypes, Section } from '../layout/Section'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'

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
  availableBlockTypes: {
    actions: generateActionsValidator(
      availableActionTypes.filter(blockTypeFilter)
    ),
    context: true,
    divider: true,
    file: true,
    image: true,
    section: generateSectionValidator(
      availableSectionAccessoryTypes.filter(blockTypeFilter)
    ),
  },
  aliases: {
    hr: Divider,
    img: Image,
    section: Section,
  },
})
