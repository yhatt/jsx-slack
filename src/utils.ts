/* eslint-disable import/prefer-default-export */
export const wrap = <T>(children: T | T[]): T[] =>
  Array.isArray(children) ? children : [children]
