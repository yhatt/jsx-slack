/** @jsx JSXSlack.h */
import { ImageBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Block'

interface ImageProps extends BlockComponentProps {
  alt: string
  children?: undefined
  src: string
  title?: string
}

export const Image: JSXSlack.FC<ImageProps> = props => (
  <ObjectOutput<ImageBlock>
    type="image"
    alt_text={props.alt}
    block_id={props.id || props.blockId}
    image_url={props.src}
    title={
      props.title
        ? {
            type: 'plain_text',
            text: props.title,
            emoji: true, // TODO: Controlable emoji
          }
        : undefined
    }
  />
)
