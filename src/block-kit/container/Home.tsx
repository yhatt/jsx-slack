/** @jsx createElementInternal */
import { View } from '@slack/types'
import { JSXSlack } from '../../jsx'
import {
  cleanMeta,
  createComponent,
  createElementInternal,
} from '../../jsx-internals'
import { Select } from '../elements/Select'
import { Textarea } from '../input/Textarea'
import { availableActionTypes } from '../layout/Actions'
import { Divider } from '../layout/Divider'
import { Header } from '../layout/Header'
import { Image } from '../layout/Image'
import { Input, knownInputs } from '../layout/Input'
import { Section, availableSectionAccessoryTypes } from '../layout/Section'
import { Video } from '../layout/Video'
import {
  PrivateMetadataTransformer,
  generateActionsValidator,
  generateBlocksContainer,
  generateSectionValidator,
} from './utils'

interface HomeProps {
  children: JSXSlack.ChildNodes

  /**
   * An identifier for this view to recognize it in various events from Slack.
   */
  callbackId?: string

  /** A unique ID for all views on a per-team basis. */
  externalId?: string

  /**
   * An optional metadata string for handling stored data in callback events
   * from Slack API. (3000 characters maximum)
   *
   * If not defined, the home tab container will use values defined in
   * `<Input type="hidden">` as metadata stringified to JSON.
   *
   * ### Custom transformer
   *
   * You can also customize how to transform hidden values into string by
   * passing the custom transformer function.
   *
   * @example
   * ```jsx
   * <Home
   *   privateMetadata={(hidden) => hidden && new URLSearchParams(hidden).toString()}
   * >
   *   <Input type="hidden" name="A" value="foobar" />
   *   <Input type="hidden" name="B" value={123} />
   *   <Input type="hidden" name="C" value={true} />
   * </Home>
   * ```
   *
   * In this example, the private metadata would be `A=foobar&B=123&C=true` by
   * transformation using `URLSearchParams`.
   *
   * The transformer takes an argument: JSON object of hidden values, or
   * `undefined` when there was no hidden values. It must return the transformed
   * string, or `undefined` if won't assign private metadata.
   */
  privateMetadata?: string | PrivateMetadataTransformer
}

const HomeBlocks = generateBlocksContainer({
  name: 'Home',
  availableBlockTypes: {
    actions: generateActionsValidator(
      [...availableActionTypes].filter((v) => v !== 'workflow_button'),
    ),
    context: true,
    divider: true,
    header: true,
    image: true,
    input: true,
    section: generateSectionValidator(
      [...availableSectionAccessoryTypes].filter(
        (v) => v !== 'workflow_button',
      ),
    ),
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

/**
 * The container component for the view of
 * [home tabs](https://api.slack.com/surfaces/tabs).
 *
 * `<Home>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Header>` (`<header>`)
 * - `<Context>`
 * - `<Actions>`
 * - `<Input>` (`<input>`)
 * - `<Video>` (`<video>`)
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
 * api.views.publish({
 *   user_id: 'UXXXXXXXX',
 *   view: (
 *     <Home>
 *       <Section>Welcome to my home!</Section>
 *     </Home>
 *   ),
 * })
 * ```
 *
 * **NOTE**: TypeScript requires to cast JSX into suited type / `any`, or wrap
 * with `JSXSlack(<Home>...</Home>)`.
 *
 * @return The object of `view` payload, for `view` field in
 *   [`views.publish`](https://api.slack.com/methods/views.publish) API.
 */
export const Home = createComponent<HomeProps, View>('Home', (props) => {
  let pmObject: Record<string, any> | undefined

  const children = JSXSlack.Children.toArray(props.children).reduce(
    (reducer: any[], child) => {
      if (JSXSlack.isValidElement(child)) {
        const { type, props: childProps } = child.$$jsxslack

        if (type === Input || type === 'input') {
          if (childProps.type === 'hidden') {
            pmObject = pmObject || {}
            pmObject[childProps.name] = childProps.value
            return reducer
          }

          // Just ignore submit type within the home tab
          if (childProps.type === 'submit') return reducer
        }
      }

      if (typeof child === 'object') return [...reducer, child]
      return reducer
    },
    [],
  )

  const private_metadata = (() => {
    if (typeof props.privateMetadata === 'string') return props.privateMetadata
    if (typeof props.privateMetadata === 'function')
      return props.privateMetadata(pmObject)

    return pmObject && JSON.stringify(pmObject)
  })()

  return {
    type: 'home',
    callback_id: props.callbackId,
    external_id: props.externalId,
    private_metadata,
    blocks: cleanMeta(<HomeBlocks children={children} />) as any[],
  }
})
