/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-empty-interface, @typescript-eslint/no-namespace */
import { OptgroupProps } from './block-kit/composition/Optgroup'
import { OptionProps } from './block-kit/composition/Option'
import { ButtonProps } from './block-kit/elements/Button'
import { SelectProps } from './block-kit/elements/Select'
import { AutoFocusibleIntrinsicProps } from './block-kit/elements/utils'
import { TextareaProps } from './block-kit/input/Textarea'
import { DividerProps } from './block-kit/layout/Divider'
import { HeaderProps } from './block-kit/layout/Header'
import { ImageProps } from './block-kit/layout/Image'
import { InputProps } from './block-kit/layout/Input'
import { SectionProps } from './block-kit/layout/Section'
import { VideoProps } from './block-kit/layout/Video'
import {
  FragmentInternal,
  createElementInternal,
  isValidElementInternal,
  isValidElementFromComponent,
} from './jsx-internals'

/**
 * The helper function to cast the output type from JSX element to `any`. Just
 * returns the passed value with no operations.
 *
 * This function is provided for TypeScript user and migrated user from
 * jsx-slack v1.
 *
 * @param element - JSX element
 * @return The passed JSX element with no-ops
 */
export function JSXSlack(element: JSXSlack.JSX.Element): any {
  return element
}

export namespace JSXSlack {
  interface StringLike {
    toString: () => string
  }

  /** A element allowed as a child. */
  export type ChildElement =
    | Node
    | string
    | StringLike
    | ChildElement[] // as fragment elements (WARN: Recrusive type has required TypeScript >= 3.7)
    | boolean // will remove while normalization
    | null // will remove while normalization
    | undefined // will remove while normalization

  /** Elements allowed as children. */
  export type ChildElements = ChildElement | ChildElement[]

  /** Similar to `ChildElement`, but excluded string and string-like object. */
  export type ChildNode = Node | ChildNode[] | boolean | null | undefined

  /** Similar to `ChildElements`, but excluded string and string-like object. */
  export type ChildNodes = ChildNode | ChildNode[]

  type FilteredChild = Node | string | StringLike
  type MapCallbackFn<T> = (
    this: FilteredChild | null,
    child: FilteredChild | null,
    index: number
  ) => T

  export type PropsWithChildren<P extends {} = {}> = {
    children?: ChildElements
  } & P

  export type FunctionComponent<P extends {} = {}> = (
    props: P
  ) => Node<P> | null
  export type FC<P extends {} = {}> = FunctionComponent<P>

  export interface Node<P extends {} = {}> {
    /**
     * @internal
     * **⚠️ This is an internal member of jsx-slack. ⚠️** Not recommend to use.
     */
    readonly $$jsxslack: {
      type: FC<P> | string
      props: P
      children: ChildElement[]
    }
  }

  /**
   * Verify the passed object is a jsx-slack element.
   *
   * @param element - An object to verify
   * @return `true` if the passed object was a jsx-slack element, otherwise
   *   `false`
   */
  export const isValidElement = isValidElementInternal

  /**
   * Create and return a new jsx-slack element of the given type.
   *
   * The `type` argument can be either a component function, a tag name string
   * such as `'strong'` or `'em'`, and a fragment (`JSXSlack.Fragment`).
   *
   * **NOTE**: _You won't typically invoke this directly if you are using JSX._
   *
   * @param type - A component function, fragment, or intrinsic HTML tag name
   * @param props - Property values to pass into the element for creation
   * @param children - Children elements of a new jsx-slack element
   * @return A new jsx-slack element
   */
  export const createElement = createElementInternal

  /** An alias into `JSXSlack.createElement`. */
  export const h = createElementInternal

  /**
   * Group a list of JSX elements.
   *
   * Typically the component for jsx-slack should return a single JSX element.
   * Wrapping multiple elements in `JSXSlack.Fragment` lets you return a list of
   * children.
   */
  export const Fragment = FragmentInternal

  const flatChildren = (children: ChildElement[]) =>
    children.reduce((reduced: Array<FilteredChild | null>, child) => {
      if (Array.isArray(child) && !isValidElementFromComponent(child)) {
        reduced.push(...flatChildren(child))
      } else if (child == null || child === true || child === false) {
        reduced.push(null)
      } else {
        reduced.push(child)
      }
      return reduced
    }, [])

  /**
   * Make flatten JSX elements into an array consited by allowed children and
   * `null`.
   *
   * @remarks
   * This function does not traverse children of the built-in component,
   * included `JSXSlack.Fragment`.
   *
   * @internal
   * @param children - The target child or children
   */
  const flat = (children: ChildElements) => flatChildren([children])

  /**
   * Provide utilities for dealing with the `props.children` opaque data
   * structure.
   */
  export const Children = Object.freeze({
    /**
     * Return the total number of elements in `children`.
     *
     * It would be same as the number of times `JSXSlack.Children.map()` would
     * invoke the callback.
     *
     * @param children - The target element(s) to count
     * @return The total number of elements in the passed children
     */
    count: (children: ChildElements): number =>
      children == null ? 0 : flat(children).length,

    /**
     * Like `JSXSlack.Children.map()`, but no return value.
     *
     * @param children - The target element(s) to traverse
     * @param callbackFn - Callback function
     */
    forEach: (children: ChildElements, callbackFn: MapCallbackFn<void>) => {
      Children.map(children, callbackFn)
    },

    /**
     * Invoke callback function on every immediate child in `children`.
     *
     * The callback function allows up to 2 arguments compatible with
     * `Array.prototype.map()`, and `this` will be a traversed child. The
     * callback can return any value for transforming, or the nullish value for
     * to skip mapping.
     *
     * @remarks
     * When the passed `children` is `null` or `undefined`, this function
     * returns the passed value instead of an array as it is.
     *
     * If `JSXSlack.Fragment` was passed as `children`, it will be treated as _a
     * single child_. The callback won't invoke with every child of the
     * fragment.
     *
     * @param children - The target element(s) to traverse
     * @param callbackFn - Callback function
     * @return An array of the value returned by callback function, or nullish
     *   value when passed `null` or `undefined`.
     */
    map: <T>(children: ChildElements, callbackFn: MapCallbackFn<T>) => {
      if (children == null) return children

      return flat(children).reduce(
        (reduced: Exclude<T, null | undefined>[], child, idx) => {
          const ret: any = callbackFn.call(child, child, idx)
          if (ret != null) reduced.push(ret)

          return reduced
        },
        []
      )
    },

    /**
     * Verify whether `children` has an only one child of jsx-slack element and
     * return it. Otherwise, throw an error.
     *
     * @remarks
     * Even if passed a single jsx-slack element, this method may throw an error
     * when the component returned `null` or any primitive value such as string,
     * number, etc.
     *
     * @param children - The target element(s)
     * @return A single jsx-slack element if verified
     * @throws Will throw an error if `children` is not a single JSX element
     */
    only: (children: ChildElements): JSX.Element => {
      if (isValidElement(children)) return children

      throw new Error(
        'JSXSlack.Children.only expected to receive a single JSXSlack element child.'
      )
    },

    /**
     * Return an array made flatten the `children` opaque data structure.
     *
     * Useful for manipulating or re-ordering collection of children passed to
     * the component.
     *
     * @remarks
     * If an array in the children could be a subset of JSON payload, such as a
     * returned array from the built-in component, it would not be flatten.
     *
     * @param children - The target element(s)
     * @return A flatten array consisted of JSX elements
     */
    toArray: (children: ChildElements): FilteredChild[] =>
      flat(children).reduce((reduced: FilteredChild[], child) => {
        if (child == null) return reduced

        // Make flatten fragment's children
        if (isValidElementFromComponent(child, Fragment))
          return reduced.concat(Children.toArray([...(child as any)]))

        return [...reduced, child]
      }, []),
  })

  let currentExactMode = false

  /**
   * Set the state of the exact mode, to enable or disable forcible styling in
   * rendered Slack mrkdwn.
   *
   * Some special characters to style text will work only in the break of words.
   * By turning the exact mode on, jsx-slack will insert zero-width space around
   * special chars generated by HTML-like elements (`<b>`, `<i>`, `<s>`, etc),
   * to enable styling forcibly.
   *
   * @remarks
   * __Exact mode is the last resort__, because zero-width space included text
   * may confuse a reader when editing the copied message. _You should consider
   * to deal with inserting whitespaces around the styled text manually instead
   * of turning on exact mode._
   *
   * @param mode - A boolean value to indicate whether turning on exact mode
   * @return The current state of exact mode
   */
  export const exactMode = (mode?: boolean) => {
    if (mode !== undefined) currentExactMode = mode
    return currentExactMode
  }

  export namespace JSX {
    export interface Element extends Node<any> {}
    export interface IntrinsicElements {
      /** An HTML-compatible alias into `<Header>` layout block. */
      header: HeaderProps

      /** An HTML-compatible alias into `<Divider>` layout block. */
      hr: DividerProps

      /**
       * A HTML-compatible alias into `<Image>` layout block and block element.
       */
      img: ImageProps

      /** A HTML-compatible alias into `<Section>` layout block. */
      section: SectionProps

      /** A HTML-compatible alias into `<Button>` block element. */
      button: ButtonProps

      /** A HTML-compatible alias into `<Textarea>` input component. */
      textarea: TextareaProps & AutoFocusibleIntrinsicProps

      /**
       * A HTML-compatible alias into `<Input>` layout block, input component,
       * and helpers for some surfaces.
       */
      input: InputProps & AutoFocusibleIntrinsicProps

      /**
       * A HTML-compatible alias into `<Optgroup>` component for composition
       * object.
       */
      optgroup: OptgroupProps

      /**
       * A HTML-compatible alias into `<Option>` component for composition
       * object.
       */
      option: OptionProps

      /**
       * A HTML-compatible alias into `<Select>` block element and input
       * component.
       */
      select: SelectProps & AutoFocusibleIntrinsicProps

      /** A HTML-compatible alias into `<Video>` layout block. */
      video: VideoProps

      // ----------- HTML-like elements -----------

      /**
       * Creates a hyperlink to the external web pages, email addresses, public
       * Slack channels, and Slack users with mention.
       *
       * ### Slack-specifics
       *
       * Keep in mind that the custom contents in children of `<a>` tag cannot
       * render when using Slack-specific features. Slack will fill the content
       * by own.
       *
       * In following cases, `<a>` tag would accept the void element `<a />`
       * unlike HTML specification.
       *
       * #### Link to public Slack channel
       *
       * jsx-slack can create [a link to the Slack channel](https://api.slack.com/reference/surfaces/formatting#linking-channels)
       * by specifying hash-prefixed ID for the public channel:
       * `<a href="#C0123456789" />` _(Notice that it is not the channel name)_
       *
       * Slack's link syntax _only accepts the public channel_. Channels in
       * private won't make a link.
       *
       * #### Mention to user and user group
       *
       * You can send a mention the specified user by ID through similar syntax
       * `<a href="@U0123456789" />`.
       *
       * jsx-slack can detect atmark-prefixed user ID `@U`, the user ID for
       * Enterprise Grid `@W`, and the user-group ID `@S`.
       *
       * #### Special mentions
       *
       * You can also use these [special mentions](https://api.slack.com/reference/surfaces/formatting#special-mentions)
       * to send widely (but typically they should be used carefully):
       *
       * - `<a href="@here" />`
       * - `<a href="@channel" />`
       * - `<a href="@everyone" />`
       */
      a: {
        children?: ChildElements

        /**
         * Either one of the URL for the created hyperlink, hash-prefixed public
         * channel ID, or atmark-prefixed ID of the target to mention.
         */
        href: string
      }

      /**
       * Style the content with bold through generating the text surrounded by
       * `*`.
       *
       * @remarks
       * Depending on contents around the element, styling may not apply
       * correctly due to the restriction of mrkdwn that _special character will
       * only work in a word boundary_. Make sure that the element is surrounded
       * by word boundaries (e.g. Whitespaces).
       *
       * Not recommended but you can also deal it with turning on exact mode via
       * `JSXSlack.exactMode(true)`.
       */
      b: {}

      /**
       * Create the block for the quotation. Slack renders the content with the
       * gray line on the left.
       */
      blockquote: {}

      /**
       * Add a line-break.
       *
       * Any break characters in JSX are ignored and collapsed to single
       * whitespace so you should always use `<br />` for line-break.
       */
      br: { children?: never }

      /**
       * Make the inline code element through generating the text surrounded by
       * `` ` ``, to indicate that is a short fragment of computer code.
       *
       * In the content of `<code>`, all basic text stylings by both raw mrkdwn
       * and JSX are ignored.
       *
       * @remarks
       * Depending on contents around the element, styling may not apply
       * correctly due to the restriction of mrkdwn that _special character will
       * only work in a word boundary_. Make sure that the element is surrounded
       * by word boundaries (e.g. Whitespaces).
       *
       * Not recommended but you can also deal it with turning on exact mode via
       * `JSXSlack.exactMode(true)`.
       */
      code: {}

      /** An alias into `<s>`. */
      del: {}

      /** An alias into `<i>`. */
      em: {}

      /**
       * Style the content with italic through generating the text surrounded by
       * `_`.
       *
       * @remarks
       * Depending on contents around the element, styling may not apply
       * correctly due to the restriction of mrkdwn that _special character will
       * only work in a word boundary_. Make sure that the element is surrounded
       * by word boundaries (e.g. Whitespaces).
       *
       * Not recommended but you can also deal it with turning on exact mode via
       * `JSXSlack.exactMode(true)`.
       */
      i: {}

      /**
       * Define an item of the list.
       *
       * This element has to be contained in children of `<ul>` and `<ol>`.
       */
      li: {
        children: ChildElements

        /**
         * Set the ordinal value of the current list item for the ordered list.
         */
        value?: number
      }

      /**
       * Create the ordered list.
       *
       * Slack mrkdwn does not support list but jsx-slack can imitate HTML-style
       * list by generating list-like plain text. It should contain list items
       * provided by `<li>` element.
       */
      ol: {
        children: ChildElements

        /** A number of the beginning count for the first list item. */
        start?: number

        /**
         * Set the type of the number for list item markers.
         *
         * - `1`: Arabic numerals (default: 1, 2, 3...)
         * - `a`: Alphabetical numerals with lowercase letters (a, b, c...)
         * - `A`: Alphabetical numerals with uppercase letters (A, B, C...)
         * - `i`: Roman numerals with lowercase letters (i, ii, iii...)
         * - `I`: Roman numerals with uppercase letters (I, II, III...)
         */
        type?: '1' | 'a' | 'A' | 'i' | 'I'
      }

      /** Make a paragraph. */
      p: {}

      /**
       * Create the block for multiline pre-formatted text.
       *
       * Whitespaces and line-breaks in the content of `<pre>` element will
       * render as are written.
       *
       * @example
       * ```jsx
       * const preformatted = '1\n2\n3'
       *
       * console.log(
       *   <Mrkdwn>
       *     <pre>{preformatted}</pre>
       *   </Mrkdwn>
       * )
       * ```
       *
       * `<pre>` in JSX has well-known pitfall: Whitespaces in the contents
       * written as same as other elements will be collapsed by JSX transpiler.
       * You should pass string value through JSX interpolation by expression to
       * keep pre-formatted text.
       */
      pre: {}

      /**
       * Style the content with strikethrough through generating the text
       * surrounded by `~`.
       *
       * @remarks
       * Depending on contents around the element, styling may not apply
       * correctly due to the restriction of mrkdwn that _special character will
       * only work in a word boundary_. Make sure that the element is surrounded
       * by word boundaries (e.g. Whitespaces).
       *
       * Not recommended but you can also deal it with turning on exact mode via
       * `JSXSlack.exactMode(true)`.
       */
      s: {}

      /**
       * Redirect contents in its children to the description of `<Checkbox>`
       * and `<RadioButton>`.
       *
       * It provides ergonomic templating instead of using JSX interpolation to
       * `description` prop.
       *
       * ```jsx
       * <Checkbox value="check">
       *  <b>Checkbox</b>
       *  <small>
       *    It's a <i>description</i>
       *  </small>
       * </Checkbox>
       * ```
       *
       * _This element is only available in `<Checkbox>` and `<RadioButton>`._
       * It would be ignored in other components because Slack cannot change
       * font size in a part of the text.
       */
      small: {}

      /**
       * Divide mrkdwn text explicitly in `<Context>`.
       *
       * Usually text contents in `<Context>` will merge in pertinent mrkdwn
       * elements automatically, but you can also apply manual dividation via
       * `<span>` (or `<Mrkdwn>`) to get effective rendering in Slack client.
       *
       * _This element is only available in `<Context>`._ It has no effect even
       * if used in other components.
       */
      span: {}

      /** An alias into `<s>`. */
      strike: {}

      /** An alias into `<b>`. */
      strong: {}

      /**
       * Render a specific date and time, with defined format for Slack.
       *
       * It makes easy to render the formatted date and time with localized
       * timezone for each Slack user.
       * [Learn about date formatting in Slack documentation.](https://api.slack.com/reference/surfaces/formatting#date-formatting)
       *
       * ```jsx
       * <time dateTime="1392734382">{'Posted {date_num} {time_secs}'}</time>
       * // <!date^1392734382^Posted {date_num} {time_secs}|Posted 2014-02-18 14:39:42 PM>
       *
       * <time dateTime={1392734382}>{'{date} at {time}'}</time>
       * // <!date^1392734382^{date} at {time}|February 18th, 2014 at 14:39 PM>
       *
       * <a href="https://example.com/">
       *  <time dateTime={new Date(Date.UTC(2014, 1, 18, 14, 39, 42))} fallback="Feb 18, 2014 PST">
       *    {'{date_short}'}
       *  </time>
       * </a>
       * // <!date^1392734382^{date_short}^https://example.com/|Feb 18, 2014 PST>
       * ```
       *
       * We have very similar definition to HTML5 `<time>` tag, but _there is
       * not-compatible attribute with HTML_: `fallback` to define the fallback
       * text for not-supported Slack client.
       */
      time:
        | (TimeIntrinsicElementProps &
            Required<Pick<TimeIntrinsicElementProps, 'dateTime'>>)
        | (TimeIntrinsicElementProps &
            Required<Pick<TimeIntrinsicElementProps, 'datetime'>>)

      /**
       * Create the unordered list.
       *
       * Slack mrkdwn does not support list but jsx-slack can imitate HTML-style
       * list by generating list-like plain text. It should contain list items
       * provided by `<li>` element.
       */
      ul: {}
    }
    export interface ElementChildrenAttribute {
      children: {}
    }

    type TimeIntrinsicElementProps = {
      children?: ChildElements

      /**
       * Set the value of date and time to render.
       *
       * jsx-slack accepts either of a parsable string as date, UNIX timestamp
       * _in second_, or JavaScript `Date` instance.
       */
      dateTime?: string | number | Date

      /**
       * An alias into `dateTime` attribute.
       */
      datetime?: string | number | Date

      /**
       * Define the fallback text, may render when the client cannot parse
       * specified date and format.
       *
       * If not defined, jsx-slack tries to generate the fallback text
       * automatically from the specified date and format. _Please note that a
       * timezone for the generated text is always UTC._
       *
       * __NOTE__: This prop is not-compatible with HTML.
       */
      fallback?: string
    }
  }
}

Object.freeze(JSXSlack)
