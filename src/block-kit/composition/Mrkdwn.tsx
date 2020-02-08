/** @jsx JSXSlack.h */
import { JSXSlack } from '../../jsx'
import { ObjectOutput } from '../../utils'

export const mrkdwnSymbol = Symbol('jsx-slack-mrkdwn-composition')

interface MrkdwnProps {
  children: JSXSlack.Children<{}>
  verbatim?: boolean
}

interface MrkdwnInternalProps extends MrkdwnProps {
  type: typeof mrkdwnSymbol
}

export const Mrkdwn: JSXSlack.FC<MrkdwnProps> = props => (
  <ObjectOutput<MrkdwnInternalProps> {...props} type={mrkdwnSymbol} />
)
