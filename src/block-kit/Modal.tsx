/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ObjectOutput, makeSerializableToJSON } from '../utils'
import {
  BlocksInternal,
  BlockComponentProps,
  blockTypeSymbol,
  InternalBlockType,
} from './Blocks'
import { internalHiddenType, internalSubmitType } from './Input'
import { plainText } from './composition/utils'

type PrivateMetadataTransformer = (
  hiddenValues: object | undefined
) => string | undefined

export interface ModalProps {
  callbackId?: string
  children: JSXSlack.Children<BlockComponentProps>
  clearOnClose?: boolean
  close?: string
  externalId?: string
  notifyOnClose?: boolean
  privateMetadata?: string | PrivateMetadataTransformer
  submit?: string
  title: string
}

const submitText = plainText('Submit')

export const Modal: JSXSlack.FC<ModalProps> = props => {
  let hasInputBlock = false
  let hidden: object | undefined
  let inputSubmit: string | undefined

  const blocks = JSXSlack(
    <BlocksInternal
      {...{ [blockTypeSymbol]: InternalBlockType.Modal }}
      children={props.children}
    />
  ).reduce((arr, block) => {
    switch (block.type) {
      case internalSubmitType:
        inputSubmit = block.value
        break
      case internalHiddenType:
        hidden = hidden || {}
        hidden[block.name] = block.value
        break
      default:
        if (block.type === 'input') hasInputBlock = true
        return [...arr, block]
    }
    return arr
  }, [])

  const submit = (() => {
    if (props.submit) return plainText(props.submit)
    if (inputSubmit) return plainText(inputSubmit)

    // "submit" field is required when using input block
    if (hasInputBlock) return submitText

    return undefined
  })()

  return makeSerializableToJSON(
    <ObjectOutput<View & { external_id?: string }>
      type="modal"
      title={plainText(props.title)}
      callback_id={props.callbackId}
      external_id={props.externalId}
      submit={submit}
      close={props.close ? plainText(props.close) : undefined}
      private_metadata={
        typeof props.privateMetadata === 'string'
          ? props.privateMetadata.toString()
          : (props.privateMetadata || (h => h && JSON.stringify(h)))(hidden)
      }
      clear_on_close={
        props.clearOnClose !== undefined ? !!props.clearOnClose : undefined
      }
      notify_on_close={
        props.notifyOnClose !== undefined ? !!props.notifyOnClose : undefined
      }
      blocks={blocks}
    />
  )
}
