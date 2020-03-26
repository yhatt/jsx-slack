import { generateBlocksContainer } from './utils'
import { Divider } from '../layout/Divider'

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
  },
})
