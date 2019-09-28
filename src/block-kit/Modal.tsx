/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { Blocks, BlockComponentProps } from './Blocks'
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

export const Modal: JSXSlack.FC<ModalProps> = props => (
  <ObjectOutput<ViewForAPI>
    blocks={JSXSlack(<Blocks children={props.children} />)}
    callback_id={props.callbackId}
    clear_on_close={
      props.clearOnClose !== undefined ? props.clearOnClose : undefined
    }
    close={props.close ? plainText(props.close) : undefined}
    external_id={props.externalId}
    notify_on_close={
      props.notifyOnClose !== undefined ? props.notifyOnClose : undefined
    }
    private_metadata={props.privateMetadata}
    submit={props.submit ? plainText(props.submit) : undefined}
    title={plainText(props.title)}
    type="modal"
  />
)
