/** @jsx JSXSlack.h */
import { ImageBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { BlockComponentProps } from './Block'

interface ImageProps extends BlockComponentProps {
  alt: string
  src: string
  title?: string
}

export const Image: JSXSlack.FC<ImageProps> = ({
  alt,
  id,
  blockId,
  src,
  title,
}): JSXSlack.Node<ImageBlock> => (
  <JSXSlack.Obj
    type="image"
    alt_text={alt}
    block_id={id || blockId}
    image_url={src}
    title={
      title
        ? {
            type: 'plain_text',
            text: title,
            emoji: true, // TODO: Controlable emoji
          }
        : undefined
    }
  />
)
