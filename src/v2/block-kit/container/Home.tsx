/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { generateBlocksContainer } from './utils'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'
import { JSXSlack, createComponent } from '../../jsx'

const HomeBlocks = generateBlocksContainer({
  name: 'Home',
  availableBlockTypes: ['actions', 'context', 'divider', 'image', 'section'],
  aliases: { hr: Divider, img: Image },
})

export const Home = createComponent<{ children: JSXSlack.ChildElements }, View>(
  'Home',
  ({ children }) => ({
    type: 'home',
    blocks: JSXSlack(<HomeBlocks children={children} />),
  })
)
