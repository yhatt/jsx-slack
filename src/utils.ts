/* eslint-disable import/prefer-default-export */
export const wrap = <T>(children: T | T[]): T[] => {
  if (Array.isArray(children)) return children
  if (children) return [children]
  return []
}
