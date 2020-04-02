/** @jsx JSXSlack.h */
import { MrkdwnElement } from '@slack/types'
import {
  JSXSlack,
  cleanMeta,
  createComponent,
  isValidElementFromComponent,
} from '../../jsx'
import { mrkdwn as toMrkdwn } from '../../mrkdwn/index'

interface MrkdwnProps {
  children: JSXSlack.ChildElements
  verbatim?: boolean
}

const defaultProps = { verbatim: true }

export const Mrkdwn = createComponent<MrkdwnProps, MrkdwnElement>(
  'Mrkdwn',
  (props) => ({
    type: 'mrkdwn',
    text: toMrkdwn(props.children),
    verbatim: props.verbatim,
  })
)

export const mrkdwn = (
  text: JSXSlack.ChildElements,
  defaultOpts: Omit<MrkdwnProps, 'children'> = defaultProps
): MrkdwnElement => {
  const [child] = JSXSlack.Children.toArray(text)
  if (isValidElementFromComponent(child, Mrkdwn)) return child as any

  return cleanMeta(<Mrkdwn {...defaultOpts} children={text} />) as MrkdwnElement
}

export const mrkdwnForOption = (
  children: JSXSlack.ChildElements,
  defaultOpts: Omit<MrkdwnProps, 'children'> = defaultProps
): { text: MrkdwnElement; description?: MrkdwnElement } => {
  let text: MrkdwnElement
  let smallOriginalChildren: JSXSlack.ChildElement[] | undefined

  const contents = JSXSlack.Children.toArray(children)
  const smallElement = contents.find(
    (c): c is JSXSlack.Node =>
      JSXSlack.isValidElement(c) && c.$$jsxslack.type === 'small'
  )

  try {
    if (smallElement) {
      smallOriginalChildren = smallElement.$$jsxslack.children
      smallElement.$$jsxslack.children = []
    }

    text = mrkdwn(children, defaultOpts)
  } finally {
    if (smallElement && smallOriginalChildren)
      smallElement.$$jsxslack.children = smallOriginalChildren
  }

  const description = smallElement
    ? mrkdwn(smallElement.$$jsxslack.children, defaultOpts)
    : undefined

  return { text, description }
}
