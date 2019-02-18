/** @jsx JSXSlack.h */
import { ContextBlock, ImageElement, MrkdwnElement } from '@slack/client'
import { JSXSlack } from '../jsx'
import html from '../html'
import { BlockComponentProps } from './Block'

const endSymbol = Symbol('EndOfContext')

interface ContextProps extends BlockComponentProps {
  children: JSXSlack.Children
}

export const Context: JSXSlack.FC<ContextProps> = ({
  blockId,
  children,
}): JSXSlack.Node<ContextBlock> => {
  const wrapped = Array.isArray(children) ? children : [children]
  const elements: (ImageElement | MrkdwnElement)[] = []

  let current: JSXSlack.Child[] = []

  for (const child of [...wrapped, endSymbol]) {
    const img =
      child && typeof child === 'object' && child.node === 'img'
        ? child
        : undefined

    if (current.length > 0 && (img || child === endSymbol)) {
      // Text content
      elements.push({ type: 'mrkdwn', text: html(current) })
      current = []
    }

    if (img) {
      // Image content
      elements.push({
        type: 'image',
        image_url: img.props.src,
        alt_text: img.props.alt,
      })
    } else if (typeof child !== 'symbol') {
      current.push(child)
    }
  }

  return <JSXSlack.Obj type="context" block_id={blockId} elements={elements} />
}
