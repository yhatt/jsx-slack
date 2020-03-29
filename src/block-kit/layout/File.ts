import { FileBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { createComponent } from '../../jsx'

export interface FileProps extends LayoutBlockProps {
  children?: undefined

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
 * {@link https://api.slack.com/reference/messaging/blocks#file|The `file` layout block}
 * to display a remote file.
 *
 * _This component is available only in `<Blocks>` container for messaging._
 *
 * Learn about {@link https://api.slack.com/messaging/files/remote|adding remote files}
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
