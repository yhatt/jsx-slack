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
  (props) => ({
    type: 'image',
    block_id: props.blockId || props.id,
    alt_text: props.alt,
    image_url: props.src,
    title: props.title ? plainText(props.title) : undefined,
  })
)
