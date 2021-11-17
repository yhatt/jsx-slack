/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import { JSXSlack, createElementInternal, FragmentInternal } from './jsx'

export const jsx = (type: any, props: Record<string, unknown>, key: any) =>
  createElementInternal(type ?? FragmentInternal, {
    ...props,
    ...(key !== undefined ? { key } : {}),
  })

export const jsxs = jsx

export namespace JSX {
  export interface Element extends JSXSlack.JSX.Element {}
  export interface IntrinsicElements extends JSXSlack.JSX.IntrinsicElements {}
  export interface ElementChildrenAttribute
    extends JSXSlack.JSX.ElementChildrenAttribute {}
}
