/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { generateBlocksContainer } from './utils'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'
import { Section } from '../layout/Section'
import { JSXSlack, createComponent } from '../../jsx'

interface HomeProps {
  children: JSXSlack.ChildElements
  callbackId?: string
  externalId?: string
  privateMetadata?: string
}

const HomeBlocks = generateBlocksContainer({
  name: 'Home',
  availableBlockTypes: ['actions', 'context', 'divider', 'image', 'section'],
  aliases: { hr: Divider, img: Image, section: Section },
})

/**
 * The container component for the view of
 * {@link https://api.slack.com/surfaces/tabs|home tabs}.
 *
 * `<Home>` can include following block elements:
 *
 * - `<Section>` (`<section>`)
 * - `<Image>` (`<img>`)
 * - `<Divider>` (`<hr>`)
 * - `<Context>`
 * - `<Actions>`
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
 *   {@link https://api.slack.com/methods/views.publish|views.publish} API.
 */
export const Home = createComponent<HomeProps, View>('Home', (props) => ({
  type: 'home',
  callback_id: props.callbackId,
  external_id: props.externalId,
  private_metadata: props.privateMetadata,
  blocks: (<HomeBlocks children={props.children} />) as any,
}))
