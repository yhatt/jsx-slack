import { createElementInternal, FragmentInternal } from './jsx'

export const jsx = (type: any, props: object, key: any) =>
  createElementInternal(type ?? FragmentInternal, {
    ...props,
    ...(key !== undefined ? { key } : {}),
  })

export const jsxs = jsx
