import { JSXSlack } from '../../jsx'
import { isNode } from '../../utils'

export const findNode = (
  nodes: JSXSlack.Children<{}>,
  callback: (node: JSXSlack.Node) => boolean
): JSXSlack.Node | undefined => {
  for (const node of JSXSlack.normalizeChildren(nodes)) {
    if (isNode(node)) {
      if (callback(node)) return node

      let ret = findNode(node.props.children, callback)
      if (ret) return ret

      ret = findNode(node.children, callback)
      if (ret) return ret
    }
  }
  return undefined
}

export const pickInternalNodes = <P extends { type: symbol }>(
  symbol: P['type'],
  children: JSXSlack.Children<P>
): JSXSlack.Node<P>[] =>
  JSXSlack.normalizeChildren(children).filter(
    (c): c is JSXSlack.Node<P> =>
      isNode(c) &&
      c.type === JSXSlack.NodeType.object &&
      c.props.type === symbol
  )
