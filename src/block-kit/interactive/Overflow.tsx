/** @jsx JSXSlack.h */
import { Option, Overflow as SlackOverflow } from '@slack/client'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { wrap } from '../../utils'

export interface OverflowProps {
  actionId?: string
  confirm?: JSXSlack.Node<ConfirmProps>
  children:
    | JSXSlack.Node<OverflowItemInternal | OverflowURLInternal>
    | JSXSlack.Node<OverflowItemInternal | OverflowURLInternal>[]
}

interface OverflowItemProps {
  children: JSXSlack.Children
  value: string
  // description?: string
}

interface OverflowURLProps {
  children: JSXSlack.Children
  url: string
  value?: string
  // description?: string
}

interface OverflowItemInternal extends OverflowItemProps {
  type: 'option'
  text: string
}

interface OverflowURLInternal extends OverflowURLProps {
  type: 'option'
  text: string
}

export const Overflow: JSXSlack.FC<OverflowProps> = (
  props
): JSXSlack.Node<SlackOverflow> => {
  const opts = wrap(props.children)
  if (opts.length < 2)
    throw new Error(
      '<Overflow> must include least of 2 <OverflowItem> or <OverflowURL>.'
    )

  if (opts.some(o => o.props.type !== 'option'))
    throw new Error(
      '<Overflow> must contain only <OverflowItem> or <OverflowURL>.'
    )

  return (
    <JSXSlack.Obj<SlackOverflow>
      type="overflow"
      action_id={props.actionId}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
      options={opts.map(
        (o: JSXSlack.Node): Option => ({
          text: {
            type: 'plain_text',
            text: o.props.text,
            emoji: true, // TODO: Controlable emoji
          },
          url: o.props.url,
          value: o.props.value,
        })
      )}
    />
  )
}

export const OverflowItem: JSXSlack.FC<OverflowItemProps> = (
  props
): JSXSlack.Node<OverflowItemInternal> => (
  <JSXSlack.Obj<OverflowItemInternal>
    {...props}
    type="option"
    text={JSXSlack(<JSXSlack.Str>{props.children}</JSXSlack.Str>)}
  />
)

export const OverflowURL: JSXSlack.FC<OverflowURLProps> = (
  props
): JSXSlack.Node<OverflowURLInternal> => (
  <JSXSlack.Obj<OverflowURLInternal>
    {...props}
    type="option"
    text={JSXSlack(<JSXSlack.Str>{props.children}</JSXSlack.Str>)}
  />
)
