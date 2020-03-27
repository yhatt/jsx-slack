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

export const Home = createComponent<HomeProps, View>('Home', (props) => ({
  type: 'home',
  callback_id: props.callbackId,
  external_id: props.externalId,
  private_metadata: props.privateMetadata,
  blocks: (<HomeBlocks children={props.children} />) as any,
}))
