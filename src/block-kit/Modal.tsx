/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import {
  BlocksInternal,
  BlockComponentProps,
  blockTypeSymbol,
  InternalBlockType,
} from './Blocks'
import { plainText } from './composition/utils'

// TODO: Use original View type when supported fields for API on @slack/types
type ViewForAPI = View & {
  callback_id?: string
  external_id?: string
}

export interface ModalProps {
  callbackId?: string
  children: JSXSlack.Children<BlockComponentProps>
  clearOnClose?: boolean
  close?: string
  externalId?: string
  notifyOnClose?: boolean
  privateMetadata?: string
  submit?: string
  title: string
}

export const Modal: JSXSlack.FC<ModalProps> = props => {
  const blocks = JSXSlack(
    <BlocksInternal
      {...{ [blockTypeSymbol]: InternalBlockType.modal }}
      children={props.children}
    />
  )

  // "submit" field is required when using input block
  const defaultSubmit = blocks.some(b => b.type === 'input')
    ? plainText('Submit')
    : undefined

  return (
    <ObjectOutput<ViewForAPI>
      type="modal"
      title={plainText(props.title)}
      callback_id={props.callbackId}
      external_id={props.externalId}
      submit={props.submit ? plainText(props.submit) : defaultSubmit}
      close={props.close ? plainText(props.close) : undefined}
      private_metadata={props.privateMetadata}
      clear_on_close={
        props.clearOnClose !== undefined ? props.clearOnClose : undefined
      }
      notify_on_close={
        props.notifyOnClose !== undefined ? props.notifyOnClose : undefined
      }
      blocks={blocks}
    />
  )
}
