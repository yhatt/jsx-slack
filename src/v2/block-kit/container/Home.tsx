/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { generateBlocksContainer } from './util'
import { JSXSlack, createComponent } from '../../jsx'

const HomeBlocks = generateBlocksContainer({
  name: 'Home',
  availableBlockTypes: ['actions', 'context', 'divider', 'image', 'section'],
})

export const Home = createComponent<{ children: JSXSlack.ChildElements }, View>(
  'Home',
  ({ children }) => ({
    type: 'home',
    blocks: JSXSlack(<HomeBlocks children={children} />),
  })
)
