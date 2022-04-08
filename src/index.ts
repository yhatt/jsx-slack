/* eslint-disable @typescript-eslint/ban-types */
import { JSXSlack } from './jsx'

export { JSXSlack }
export * from './components'
export { jsxslack } from './tag'
export default JSXSlack

// Useful type aliases that are similar to @types/react
export type Node = JSXSlack.ChildElements
export type FunctionComponent<P extends {} = Record<any, never>> =
  JSXSlack.FunctionComponent<P>
export type FC<P extends {} = Record<any, never>> = JSXSlack.FC<P>
export type PropsWithChildren<P extends {} = {}> = JSXSlack.PropsWithChildren<P>

/** @deprecated Use FunctionComponent instead. */
export type VoidFunctionComponent<P extends {} = Record<any, never>> =
  JSXSlack.VoidFunctionComponent<P>

/** @deprecated Use FunctionComponent instead. */
export type VFC<P extends {} = Record<any, never>> = JSXSlack.VFC<P>
