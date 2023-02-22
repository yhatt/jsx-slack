/* eslint-disable @typescript-eslint/ban-types */
import { JSXSlack } from './jsx'

export { JSXSlack }
export * from './components'
export { jsxslack } from './tag'
export default JSXSlack

// Useful type aliases that are similar to @types/react
export type Node = JSXSlack.ChildElements
export type FunctionComponent<P extends {} = {}> = JSXSlack.FunctionComponent<P>
export type FC<P extends {} = {}> = JSXSlack.FC<P>
export type PropsWithChildren<P extends {} = {}> = JSXSlack.PropsWithChildren<P>
