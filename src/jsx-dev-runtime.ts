import { jsx, jsxs } from './jsx-runtime'

export { jsx, jsxs }

export const jsxDEV = (
  type: any,
  props: object,
  key: any,
  _: boolean, // isStaticChildren: not used in jsx-slack
  __source: object
) => jsx(type, { ...props, __source }, key)
