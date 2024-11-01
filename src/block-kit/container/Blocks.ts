import type { BuiltInComponent } from '../../jsx-internals'
import { Select } from '../elements/Select'
import { Textarea } from '../input/Textarea'
import { availableActionTypes } from '../layout/Actions'
import { Divider } from '../layout/Divider'
import { Header } from '../layout/Header'
import { Image } from '../layout/Image'
import { Input, knownInputs } from '../layout/Input'
import { availableSectionAccessoryTypes, Section } from '../layout/Section'
import { Video } from '../layout/Video'
import {
  BlocksProps,
  generateActionsValidator,
  generateBlocksContainer,
  generateInputValidator,
  generateSectionValidator,
} from './utils'

/**
 * The basic container component for Slack Block Kit suited to
 * [messages](https://api.slack.com/surfaces/messages).
 *
 * `<Blocks>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Header>` (`<header>`)
 * - `<Context>`
 * - `<Actions>`
 * - `<Input>` (`<input>`)
 * - `<Video>` (`<video>`)
 * - `<File>`
 * - `<Call>`
 *
 * And these input components (Require defining `label` prop):
 *
 * - `<Input label="...">` (`<input label="...">`)
 * - `<Textarea label="...">` (`<textarea label="...">`)
 * - `<Select label="...">` (`<select label="...">`)
 * - `<ExternalSelect label="...">`
 * - `<UsersSelect label="...">`
 * - `<ConversationsSelect label="...">`
 * - `<ChannelsSelect label="...">`
 * - `<DatePicker label="...">`
 * - `<TimePicker label="...">`
 * - `<DateTimePicker label="...">`
 * - `<CheckboxGroup label="...">`
 * - `<RadioButtonGroup label="...">`
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
 *   [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage) API.
 */
export const Blocks: BuiltInComponent<BlocksProps> = generateBlocksContainer({
  name: 'Blocks',
  availableBlockTypes: {
    actions: generateActionsValidator([...availableActionTypes]),
    call: true,
    context: true,
    divider: true,
    file: true,
    header: true,
    image: true,
    input: generateInputValidator({ unavailableInputTypes: ['file_input'] }),
    section: generateSectionValidator(availableSectionAccessoryTypes),
    video: true,
  },
  aliases: {
    header: Header,
    hr: Divider,
    img: Image,
    input: Input,
    section: Section,
    select: Select,
    textarea: Textarea,
    video: Video,
  },
  typesToCheckMissingLabel: knownInputs,
})
