import { createElementInternal, FragmentInternal } from './jsx'

/** @experimental */
export const jsx = (type: any, props: object, key: any) =>
  createElementInternal(type ?? FragmentInternal, {
    ...props,
    ...(key !== undefined ? { key } : {}),
  })

/** @experimental */
export const jsxs = jsx
