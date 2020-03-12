/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput, makeSerializableToJSON } from '../utils'
import {
  BlockComponentProps,
  BlocksInternal,
  blockTypeSymbol,
  InternalBlockType,
} from './Blocks'

export interface HomeProps {
  callbackId?: string
  children: JSXSlack.Children<BlockComponentProps>
  externalId?: string
  privateMetadata?: string
}

export const Home: JSXSlack.FC<HomeProps> = props =>
  makeSerializableToJSON(
    <ObjectOutput<View & { external_id?: string }>
      type="home"
      callback_id={props.callbackId}
      external_id={props.externalId}
      private_metadata={props.privateMetadata}
      blocks={JSXSlack(
        <BlocksInternal
          {...{ [blockTypeSymbol]: InternalBlockType.Home }}
          children={props.children}
        />
      )}
    />
  )
