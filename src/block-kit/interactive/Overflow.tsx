/** @jsx JSXSlack.h */
import { Option, Overflow as SlackOverflow } from '@slack/client'
import { ConfirmProps } from '../composition/Confirm'
import { JSXSlack } from '../../jsx'
import { wrap } from '../../utils'

export interface OverflowProps {
  actionId?: string
  confirm?: JSXSlack.Node<ConfirmProps>
  children:
    | JSXSlack.Node<OverflowItemInternal>
    | JSXSlack.Node<OverflowItemInternal>[]
}

interface OverflowItemProps {
  children: JSXSlack.Children
  url?: string
  value?: string
  // description?: string
}

interface OverflowItemInternal extends OverflowItemProps {
  type: 'overflow-item'
  text: string
}

export const Overflow: JSXSlack.FC<OverflowProps> = (
  props
): JSXSlack.Node<SlackOverflow> => {
  const opts = wrap(props.children)
  if (opts.length < 2)
    throw new Error('<Overflow> must include least of 2 <OverflowItem>s.')

  if (opts.some(o => o.props.type !== 'overflow-item'))
    throw new Error('<Overflow> must contain only <OverflowItem>.')

  return (
    <JSXSlack.Obj<SlackOverflow>
      type="overflow"
      action_id={props.actionId}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
      options={opts.map(
        (o): Option => ({
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
    type="overflow-item"
    text={JSXSlack(<JSXSlack.Plain>{props.children}</JSXSlack.Plain>)}
  />
)
