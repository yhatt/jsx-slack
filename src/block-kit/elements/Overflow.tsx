/** @jsx JSXSlack.h */
import { Option, Overflow as SlackOverflow } from '@slack/types'
import { ConfirmProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { JSXSlack } from '../../jsx'
import { ObjectOutput, PlainText } from '../../utils'

export interface OverflowProps {
  actionId?: string
  confirm?: JSXSlack.Node<ConfirmProps>
  children: JSXSlack.Children<OverflowItemInternal>
  name?: string
}

interface OverflowItemProps {
  children: JSXSlack.Children<{}>
  url?: string
  value?: string
}

interface OverflowItemInternal extends OverflowItemProps {
  type: 'overflow-item'
  text: string
}

export const Overflow: JSXSlack.FC<OverflowProps> = (props) => {
  const opts = JSXSlack.normalizeChildren(props.children).filter(
    (o) => typeof o !== 'string'
  ) as JSXSlack.Node<OverflowItemInternal>[]

  if (opts.length < 1)
    throw new Error('<Overflow> must include least of 1 <OverflowItem>.')

  if (opts.some((o) => o.props.type !== 'overflow-item'))
    throw new Error('<Overflow> must contain only <OverflowItem>.')

  return (
    <ObjectOutput<SlackOverflow>
      type="overflow"
      action_id={props.actionId || props.name}
      confirm={props.confirm ? JSXSlack(props.confirm) : undefined}
      options={opts.map(
        (o): Option => ({
          text: plainText(o.props.text),
          ...(o.props.url ? { url: o.props.url } : {}),
          ...(o.props.value ? { value: o.props.value } : {}),
        })
      )}
    />
  )
}

export const OverflowItem: JSXSlack.FC<OverflowItemProps> = (props) => (
  <ObjectOutput<OverflowItemInternal>
    {...props}
    type="overflow-item"
    text={JSXSlack(<PlainText>{props.children}</PlainText>)}
  />
)
