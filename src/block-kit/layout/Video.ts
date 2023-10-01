// import { VideoBlock } from '@slack/types'
import { Block, PlainTextElement } from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'
import { LayoutBlockProps } from './utils'

// TODO: https://github.com/slackapi/node-slack-sdk/pull/1514 has been merged into @slack/types but it hasn't been released yet.
interface VideoBlock extends Block {
  type: 'video'
  video_url: string
  thumbnail_url: string
  alt_text: string
  title: PlainTextElement
  title_url?: string
  author_name?: string
  provider_name?: string
  provider_icon_url?: string
  description?: PlainTextElement
}

interface VideoPropsInternal extends LayoutBlockProps {
  children?: never

  /**
   * The URL to be embedded video.
   *
   * _URL must be compatible with an embeddable iframe._
   *
   * In addition, it has a lot of requirements by Slack for putting video
   * correctly. [See also requirements for `video_url` field in Slack API documentation.](https://api.slack.com/reference/block-kit/blocks#video_requirements)
   */
  videoUrl?: string

  /** An alias to `videoUrl` prop. */
  src?: string

  /** A tooltip text for the video. It is required for accessibility. */
  alt: string

  /** URL for the thumbnail image of the video. */
  thumbnailUrl?: string

  /** An alias to `thumbnailUrl` prop. */
  poster?: string

  /** A video title, in 200 or less characters. */
  title: string

  /**
   * HTTPS URL for the hyperlink of the title text.
   *
   * It must correspond to the non-embeddable URL for the video.
   */
  titleUrl?: string

  /** The author name of the video to be displayed, in 50 or less characters. */
  authorName?: string

  /** The originating application name or domain of the video. (ex. YouTube) */
  providerName?: string

  /** An image URL for the video provider icon. */
  providerIconUrl?: string

  /** Description for the video. */
  description?: string
}

type SelectiveRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
type RequiredOneOf<T, K extends keyof T> = K extends never
  ? never
  : SelectiveRequired<T, K>

export type VideoProps = RequiredOneOf<
  RequiredOneOf<VideoPropsInternal, 'src' | 'videoUrl'>,
  'poster' | 'thumbnailUrl'
>

/**
 * [The `video` layout block](https://api.slack.com/reference/messaging/blocks#video)
 * to embed a video.
 *
 * Recommend to learn about [requirements and constraints](https://api.slack.com/reference/block-kit/blocks#video_requirements)
 * of the video layout block in Slack API documentation.
 *
 * @return The partial JSON for `video` layout block
 */
export const Video = createComponent<VideoProps, VideoBlock>(
  'Video',
  (props) => ({
    type: 'video',
    block_id: props.blockId || props.id,
    video_url: (props.videoUrl || props.src) as string,
    alt_text: props.alt,
    thumbnail_url: (props.thumbnailUrl || props.poster) as string,
    title: plainText(props.title),
    title_url: props.titleUrl,
    author_name: props.authorName,
    provider_name: props.providerName,
    provider_icon_url: props.providerIconUrl,
    description:
      props.description != null ? plainText(props.description) : undefined,
  }),
)
