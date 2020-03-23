/** @jsx JSXSlack.h */
import { ImageBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { plainText } from './composition/utils'
import { BlockComponentProps } from './Blocks'

interface ImageProps extends BlockComponentProps {
  alt: string
  children?: undefined
  src: string
  title?: string
}

export const Image: JSXSlack.FC<ImageProps> = (props) => (
  <ObjectOutput<ImageBlock>
    type="image"
    alt_text={props.alt}
    block_id={props.id || props.blockId}
    image_url={props.src}
    title={props.title ? plainText(props.title) : undefined}
  />
)
