/** @jsx createElementInternal */
import { MrkdwnElement } from '@slack/types'
import {
  JSXSlack,
  cleanMeta,
  createComponent,
  createElementInternal,
  isValidElementFromComponent,
} from '../../jsx'
import { mrkdwn as toMrkdwn } from '../../mrkdwn/index'
import { plainText } from './utils'

interface MrkdwnProps {
  children: JSXSlack.ChildElements

  /**
   * A boolean value whether to bypass HTML-like formatting by jsx-slack.
   *
   * If enabled, you can bypass HTML-like formatting, and disable auto escape
   * for mrkdwn special chracters. The defined string in the content will be set
   * as the `text` field of text composition object as is. Any JSX tags cannot
   * use in contents.
   *
   * It's useful for rendering a raw string that is including
   * {@link https://api.slack.com/reference/surfaces/formatting#advanced advanced mrkdwn format for Slack}.
   *
   * ```jsx
   * <Blocks>
   *  <Section>
   *    <Mrkdwn raw verbatim>
   *      {'Hey <@U0123ABCD>, thanks for submitting your report.'}
   *    </Mrkdwn>
   *  </Section>
   * </Blocks>
   * ```
   */
  raw?: boolean

  /**
   * A boolean value whether to disable automatic parsing for links, channel
   * names, and mentions by Slack. Will parse if not defined.
   *
   * @remarks
   * **We recommend always use `<Mrkdwn verbatim>` in your app.**
   *
   * Slack is pointing out it has some possibilities for breaking messages.
   * _Read "{@link https://api.slack.com/reference/surfaces/formatting#why_you_should_consider_disabling_automatic_parsing Why you should consider disabling automatic parsing}"
   * in the documentation by Slack._
   */
  verbatim?: boolean
}

const defaultProps = { verbatim: true }

/**
 * Generate {@link https://api.slack.com/reference/block-kit/composition-objects#textthe the text composition object}
 * for `mrkdwn` type.
 *
 * You should contain the content of the message formatted by HTML-like elements
 * in its children (except for `<Mrkdwn raw>`).
 *
 * jsx-slack built-in components that allowed HTML-like elements in children
 * generate an implicit text composition object using `mrkdwn` type with
 * recommended usage by Slack. You can override it by defining `<Mrkdwn>` as an
 * only element of supported components.
 *
 * ---
 *
 * ### Bypass HTML-like formatting
 *
 * HTML-like formatting by jsx-slack is a comfortable way to define Slack Block
 * Kit surfaces with familiar syntaxes, but auto-escape for mrkdwn special
 * characters may interfere with the completed mrkdwn text.
 *
 * You can use `<Mrkdwn raw>` if you want to use the raw mrkdwn string as is. It
 * bypasses HTML-like formatting so you cannot use any JSX tags in contents.
 *
 * ```jsx
 * <Blocks>
 *  <Section>
 *    <Mrkdwn raw verbatim>
 *      {'Hey <@U0123ABCD>, thanks for submitting your report.'}
 *    </Mrkdwn>
 *  </Section>
 * </Blocks>
 * ```
 *
 * ---
 *
 * ### Automatic parsing _({@link https://api.slack.com/reference/surfaces/formatting#why_you_should_consider_disabling_automatic_parsing not recommended})_
 *
 * jsx-slack has disabled automatic parsing of URL, mention, and channel link by
 * Slack to prevent breaking explicitly specified formatting. By using
 * `<Mrkdwn verbatim={false}>`, you can instruct to enable parsing them.
 *
 * ```jsx
 * <Blocks>
 *  {
 *  // Section block
 *  }
 *  <Section>
 *    <Mrkdwn verbatim={false}>https://example.com/</Mrkdwn>
 *  </Section>
 *  {
 *  // Section block with fields
 *  }
 *  <Section>
 *    <Field>
 *      <Mrkdwn verbatim={false}>#general</Mrkdwn>
 *    </Field>
 *  </Section>
 *  {
 *  // Context block
 *  }
 *  <Context>
 *    <Mrkdwn verbatim={false}>@here</Mrkdwn>
 *    Hello!
 *  </Context>
 *  {
 *  // Confirm composition object
 *  }
 *  <Actions>
 *    <Button
 *      confirm={
 *        <Confirm title="Commit your action" confirm="Yes, please" deny="Cancel">
 *          <Mrkdwn verbatim={false}>
 *            <b>@foobar</b> Are you sure?
 *          </Mrkdwn>
 *        </Confirm>
 *      }
 *    >
 *      Button
 *    </Button>
 *  </Actions>
 * </Blocks>
 * ```
 *
 * @remarks
 * **We recommend never to turn on automatic parsing via
 * `<Mrkdwn verbatim={false}>` in your app.** It's just an escape hatch, and
 * probably you always must use `<Mrkdwn verbatim>`.
 *
 * Slack is pointing out it has some possibilities for breaking messages. _Read
 * "{@link https://api.slack.com/reference/surfaces/formatting#why_you_should_consider_disabling_automatic_parsing Why you should consider disabling automatic parsing}"
 * in the documentation by Slack._
 *
 * @returns The JSON of the composition object for mrkdwn text
 */
export const Mrkdwn = createComponent<MrkdwnProps, MrkdwnElement>(
  'Mrkdwn',
  (props) => ({
    type: 'mrkdwn',
    text: props.raw ? plainText(props.children).text : toMrkdwn(props.children),
    verbatim: props.verbatim,
  })
)

export const mrkdwn = (
  text: JSXSlack.ChildElements,
  defaultOpts: Omit<MrkdwnProps, 'children'> = defaultProps,
  force = false
): MrkdwnElement => {
  const [child] = JSXSlack.Children.toArray(text)

  if (isValidElementFromComponent(child, Mrkdwn)) {
    if (force)
      return (
        <Mrkdwn
          {...(child.$$jsxslack.props || {})}
          children={child.$$jsxslack.children}
        />
      ) as any

    return child as any
  }

  return cleanMeta(<Mrkdwn {...defaultOpts} children={text} />) as MrkdwnElement
}

export const mrkdwnForOption = (
  children: JSXSlack.ChildElements,
  defaultOpts: Omit<MrkdwnProps, 'children'> = defaultProps
): { text: MrkdwnElement; description?: MrkdwnElement } => {
  let text: MrkdwnElement
  let smallOriginalChildren: JSXSlack.ChildElement[] | undefined

  const contents = JSXSlack.Children.toArray(children)
  const smallFindTarget: JSXSlack.ChildElement[] = contents

  if (isValidElementFromComponent(contents[0], Mrkdwn))
    smallFindTarget.unshift(...contents[0].$$jsxslack.children)

  const smallElement = smallFindTarget.find(
    (c): c is JSXSlack.Node =>
      JSXSlack.isValidElement(c) && c.$$jsxslack.type === 'small'
  )

  try {
    if (smallElement) {
      smallOriginalChildren = smallElement.$$jsxslack.children
      smallElement.$$jsxslack.children = []
    }

    text = mrkdwn(children, defaultOpts, true)
  } finally {
    if (smallElement && smallOriginalChildren)
      smallElement.$$jsxslack.children = smallOriginalChildren
  }

  const description = smallElement
    ? mrkdwn(smallElement.$$jsxslack.children, defaultOpts)
    : undefined

  return { text, description }
}
