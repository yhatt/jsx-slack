/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import { BlockComponentProps } from './Blocks'
import html from '../html'

interface VerbatimProps extends BlockComponentProps {
  children: JSXSlack.Children<BlockComponentProps>
  disabled: boolean
}

interface VerbatimElement {
  type: "verbatim"
  text: string
  verbatim: boolean
}

export const Verbatim: JSXSlack.FC<
VerbatimProps & { children: JSXSlack.Children<BlockComponentProps>}
> = ({ children, disabled }) => {
  for (const child of JSXSlack.normalizeChildren(children)) {
    if(typeof child === 'object'){
      if(child.type === "img"){
        throw new Error('<Verbatim> does not support <img> children')
      }else if(child.type === JSXSlack.NodeType.object && child.props.type === 'image'){
        throw new Error('<Verbatim> does not support <Image> children')
      }
    }

  }

  return <ObjectOutput<VerbatimElement>
    type="verbatim"
    text={html(children)}
    verbatim={disabled}/>
}