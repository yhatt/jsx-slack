import { generateBlocksContainer } from './util'

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
})
