/** @jsx JSXSlack.h */
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import html from '../../html'
import { BlockComponentProps } from '../Blocks'

interface MrkdwnProps extends BlockComponentProps {
  children: JSXSlack.Children<BlockComponentProps>
  verbatim: boolean
}

interface MrkdwnComponentProps {
  type: 'mrkdwn_component'
  text: string
  verbatim: boolean
}

export const Mrkdwn: JSXSlack.FC<MrkdwnProps & {
  children: JSXSlack.Children<BlockComponentProps>
}> = ({ children, verbatim }) => {
  return (
    <ObjectOutput<MrkdwnComponentProps>
      type="mrkdwn_component"
      text={html(children)}
      verbatim={verbatim}
    />
  )
}
