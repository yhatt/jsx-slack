import { FileBlock } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { createComponent } from '../../jsx'

export interface FileProps extends LayoutBlockProps {
  children?: undefined

  /** A string of unique ID for the remote file to show. */
  externalId: string

  /**
   * Override `source` field.
   *
   * At the moment, you should not take care this because only the default value
   * `remote` is available in Slack.
   */
  source?: string
}

export const File = createComponent<FileProps, FileBlock>('File', (props) => ({
  type: 'file',
  block_id: props.blockId || props.id,
  external_id: props.externalId,
  source: props.source || 'remote',
}))
