/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import html from '../html'

interface MrkdwnProps extends BlockComponentProps {
  children: JSXSlack.Children<BlockComponentProps>
  verbatim: boolean
}

interface MrkdwnComponentProps {
  type: 'mrkdwn_component'
  text: string
  verbatim: boolean
}

export const MrkDwn: JSXSlack.FC<MrkdwnProps & {
  children: JSXSlack.Children<BlockComponentProps>
}> = ({ children, verbatim }) => {
  for (const child of JSXSlack.normalizeChildren(children)) {
    if (typeof child === 'object') {
      if (child.type === 'img') {
        throw new Error('<Verbatim> does not support <img> children')
      } else if (
        child.type === JSXSlack.NodeType.object &&
        child.props.type === 'image'
      ) {
        throw new Error('<Verbatim> does not support <Image> children')
      }
    }
  }

  return (
    <ObjectOutput<MrkdwnComponentProps>
      type="mrkdwn_component"
      text={html(children)}
      verbatim={verbatim}
    />
  )
}
