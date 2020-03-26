/* eslint-disable prefer-destructuring */
import { JSXSlack } from './jsx'

export * from './block-kit'

/** An alias into `JSXSlack.Fragment`, to group a list of JSX elements. */
export const Fragment = JSXSlack.Fragment

// v1
export const Escape: any = () => null
