import { JSXSlack, createElementInternal, FragmentInternal } from './jsx'
import JSX = JSXSlack.JSX

export const jsx = (type: any, props: Record<string, unknown>, key: any) =>
  createElementInternal(type ?? FragmentInternal, {
    ...props,
    ...(key !== undefined ? { key } : {}),
  })

export const jsxs = jsx

export type { JSX }
