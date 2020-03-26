import { generateBlocksContainer } from './utils'
import { Divider } from '../layout/Divider'
import { Image } from '../layout/Image'

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
  },
})
