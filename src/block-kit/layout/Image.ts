import { ImageBlock } from '@slack/types'
import { createComponent } from '../../jsx'
import { plainText } from '../composition/utils'
import { LayoutBlockProps } from './utils'

export interface ImageProps extends LayoutBlockProps {
  children?: never

  /** A plain text summary of the image. */
  alt: string

  /** The URL of the image. */
  src: string

  /**
   * An optional title for the image.
   *
   * It is available only in the usage for the layout block.
   */
  title?: string
}

/**
 * {@link https://api.slack.com/reference/messaging/blocks#image|The `image` layout block}
 * to insert an image.
 *
 * It has well-known props like `<img>` HTML element.
 *
 * ```jsx
 * <Blocks>
 *   <Image src="https://placekitten.com/500/500" alt="So cute kitten" />
 * </Blocks>
 * ```
 *
 * ---
 *
 * `<Image>` component also can use as
 * {@link https://api.slack.com/reference/block-kit/block-elements#image|the `image` block element},
 * for `<Section>` and `<Context>` layout block.
 *
 * ```jsx
 * <Blocks>
 *   <Section>
 *     So cute kitten! :cat:
 *     <Image src="https://placekitten.com/256/256" alt="Kitten A" />
 *   </Section>
 *   <Context>
 *     2 kittens liked this :+1:
 *     <Image src="https://placekitten.com/64/64" alt="Kitten B" />
 *     <Image src="https://placekitten.com/64/64" alt="Kitten C" />
 *   </Context>
 * </Blocks>
 * ```
 *
 * @return The partial JSON for `image` layout block or `image` block element
 */
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
