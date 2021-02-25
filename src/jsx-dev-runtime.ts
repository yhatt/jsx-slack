import { jsx, JSX } from './jsx-runtime'

export const jsxDEV = (
  type: any,
  props: Record<string, unknown>,
  key: any,
  _: boolean, // isStaticChildren: not used in jsx-slack
  __source: Record<string, unknown>
) => jsx(type, { ...props, __source }, key)

export type { JSX }
