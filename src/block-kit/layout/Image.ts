import { ImageBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { plainText } from '../composition/utils'
import { createComponent } from '../../jsx'

export interface ImageProps extends LayoutBlockProps {
  children?: undefined

  /** A plain text summary of the image. */
  alt: string

  /** The URL of the image. */
  src: string

  /** An optional title for the image. */
  title?: string
}

export const Image = createComponent<ImageProps, ImageBlock>(
  'Image',
  ({ blockId, id, alt, src, title }) => ({
    type: 'image',
    block_id: blockId || id,
    alt_text: alt,
    image_url: src,
    title: title ? plainText(title) : undefined,
  })
)
