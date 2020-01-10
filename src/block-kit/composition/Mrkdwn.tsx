/** @jsx JSXSlack.h */
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import html from '../../html'

interface MrkdwnProps {
  children: JSXSlack.Children<{}>
  verbatim?: boolean
}

interface MrkdwnComponentProps {
  type: 'mrkdwn_component'
  text: string
  verbatim?: boolean
}

export const Mrkdwn: JSXSlack.FC<MrkdwnProps> = ({ children, verbatim }) => {
  return (
    <ObjectOutput<MrkdwnComponentProps>
      type="mrkdwn_component"
      text={html(children)}
      verbatim={verbatim}
    />
  )
}
