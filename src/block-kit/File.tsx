/** @jsx JSXSlack.h */
import { FileBlock } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'

interface FileProps extends BlockComponentProps {
  children?: undefined
  externalId: string
  source?: string
}

export const File: JSXSlack.FC<FileProps> = (props) => (
  <ObjectOutput<FileBlock>
    type="file"
    block_id={props.id || props.blockId}
    external_id={props.externalId}
    source={props.source || 'remote'}
  />
)
