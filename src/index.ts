import { JSXSlack } from './jsx'

export { JSXSlack }
export * from './components'
export { jsxslack } from './tag'
export default JSXSlack

// Useful types similar to @types/react
export type Node = JSXSlack.ChildElements
export type FunctionComponent = JSXSlack.FunctionComponent
export type FC = JSXSlack.FC
export type VoidFunctionComponent = JSXSlack.VoidFunctionComponent
export type VFC = JSXSlack.VFC
