import { FileBlock } from '@slack/types'
import { createComponent } from '../../jsx-internals'
import { LayoutBlockProps } from './utils'

export interface FileProps extends LayoutBlockProps {
  children?: never

  /** A string of external unique ID for the remote file to show. */
  externalId: string

  /**
   * Override `source` field.
   *
   * At the moment, you should not take care of this because only the default
   * value `remote` is available in Slack.
   */
  source?: string
}

/**
 * [The `file` layout block](https://api.slack.com/reference/messaging/blocks#file)
 * to display a remote file.
 *
 * _This component is available only in `<Blocks>` container for messaging._
 *
 * Learn about [adding remote files](https://api.slack.com/messaging/files/remote)
 * in the document of Slack API.
 *
 * @return The partial JSON for `file` layout block
 */
export const File = createComponent<FileProps, FileBlock>('File', (props) => ({
  type: 'file',
  block_id: props.blockId || props.id,
  external_id: props.externalId,
  source: props.source || 'remote',
}))
