import { defaultHandlers, defaultNodeHandlers } from 'hast-util-to-mdast'

export { toMdast as hastUtilToMdast } from 'hast-util-to-mdast'

export const hastUtilToMdastListItem = defaultHandlers.li
export const hastUtilToMdastTextarea = defaultHandlers.textarea
export const hastUtilToMdastRoot = defaultNodeHandlers.root
