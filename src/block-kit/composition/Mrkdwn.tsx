/** @jsx JSXSlack.h */
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'
import html from '../../html'

export const mrkdwnSymbol = Symbol('jsx-slack-mrkdwn-composition')

interface MrkdwnProps {
  children: JSXSlack.Children<{}>
  verbatim?: boolean
}

interface MrkdwnComponentProps {
  type: typeof mrkdwnSymbol
  text: string
  verbatim?: boolean
}

export const Mrkdwn: JSXSlack.FC<MrkdwnProps> = ({ children, verbatim }) => (
  <ObjectOutput<MrkdwnComponentProps>
    type={mrkdwnSymbol}
    text={html(children)}
    verbatim={verbatim}
  />
)
