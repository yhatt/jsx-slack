/* eslint-disable @typescript-eslint/no-namespace */
import { JSXSlack } from './jsx'
import { createElementInternal, FragmentInternal } from './jsx-internals'

export const jsx = (type: any, props: Record<string, unknown>, key: any) =>
  createElementInternal(type ?? FragmentInternal, {
    ...props,
    ...(key !== undefined ? { key } : {}),
  })

export const jsxs = jsx
export const Fragment = FragmentInternal

export namespace JSX {
  export interface Element extends JSXSlack.JSX.Element {}
  export interface IntrinsicElements extends JSXSlack.JSX.IntrinsicElements {}
  export interface ElementChildrenAttribute
    extends JSXSlack.JSX.ElementChildrenAttribute {}
}
