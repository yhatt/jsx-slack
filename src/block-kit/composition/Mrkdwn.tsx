/** @jsx JSXSlack.h */
import { MrkdwnElement } from '@slack/types'
import {
  JSXSlack,
  createComponent,
  isValidElementFromComponent,
} from '../../jsx'
import { mrkdwn as toMrkdwn } from '../../mrkdwn/index'

interface MrkdwnProps {
  children: JSXSlack.ChildElements
  verbatim?: boolean
}

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
  defaultOpts: Omit<MrkdwnProps, 'children'> = { verbatim: true }
): MrkdwnElement => {
  const [child] = JSXSlack.Children.toArray(text)
  if (isValidElementFromComponent(child, Mrkdwn)) return child as any

  // Re-assign object to remove metadata from an implicit <Mrkdwn> component
  return { ...(<Mrkdwn {...defaultOpts} children={text} />) } as any
}
