/** @jsx JSXSlack.h */
import { ImageBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { BlockComponentProps } from './Block'

interface ImageProps extends BlockComponentProps {
  alt: string
  src: string
  title?: string
  children?: string // => title
}

export const Image: JSXSlack.FC<ImageProps> = (
  props
): JSXSlack.Node<ImageBlock> => {
  const title = props.title || props.children

  return (
    <JSXSlack.Obj
      type="image"
      alt_text={props.alt}
      block_id={props.blockId}
      image_url={props.src}
      title={
        title && title
          ? {
              type: 'plain_text',
              text: title,
              emoji: true, // TODO: Controlable emoji
            }
          : undefined
      }
    />
  )
}
