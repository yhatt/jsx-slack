/** @jsx JSXSlack.h */
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import html from '../../html'
import { BlockComponentProps } from '../Blocks'
import { MrkdwnElement } from '@slack/types'

interface MrkdwnProps extends BlockComponentProps {
  children: JSXSlack.Children<BlockComponentProps>
  verbatim: boolean
}

interface MrkdwnComponentProps {
  type: 'mrkdwn_component'
  text: string
  verbatim: boolean
}

interface MrkdwnComponent
  extends JSXSlack.FC<
    MrkdwnProps & {
      children: JSXSlack.Children<BlockComponentProps>
    }
  > {}

export const Mrkdwn: MrkdwnComponent = ({ children, verbatim }) => {
  return (
    <ObjectOutput<MrkdwnComponentProps>
      type="mrkdwn_component"
      text={html(children)}
      verbatim={verbatim}
    />
  )
}

export const mrkdwnToTextObject = ({ children, verbatim }) => {
  return (
    <ObjectOutput<MrkdwnElement>
      type="mrkdwn"
      text={html(children)}
      verbatim={verbatim}
    />
  )
}
