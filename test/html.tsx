/** @jsx JSXSlack.h */
import html from '../src/html'
import JSXSlack from '../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('HTML parser for mrkdwn', () => {
  // https://api.slack.com/messaging/composing/formatting#escaping
  describe('Escape', () => {
    it('replaces "&" with "&amp;"', () => {
      expect(html('&&&')).toBe('&amp;&amp;&amp;')

      // Unknown entity
      expect(html('&heart;')).toBe('&amp;heart;')
    })

    it('does not replace already used ampersand for escaping', () => {
      expect(html('true &amp;& false')).toBe('true &amp;&amp; false')
      expect(html('A&lt;=&gt;B')).toBe('A&lt;=&gt;B')
    })
  })

  describe('Italic', () => {
    it('converts <i> tag to italic markup', () =>
      expect(html(<i>Hello</i>)).toBe('＿Hello＿'))

    it('converts <em> tag to italic markup', () =>
      expect(html(<em>Hello</em>)).toBe('＿Hello＿'))

    it('allows containing the other markup', () =>
      expect(
        html(
          <i>
            Hello, <b>World</b>!
          </i>
        )
      ).toBe('＿Hello, ＊World＊!＿'))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <i>
            <i>Double</i>
          </i>
        )
      ).toBe('＿Double＿'))

    it('uses regular markup when content has full-width underscore', () =>
      expect(html(<i>italic＿text</i>)).toBe('_italic＿text_'))

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<i>Hello</i>)).toBe('\u200b＿\u200bHello\u200b＿\u200b')
    })
  })

  describe('Bold', () => {
    it('converts <b> tag to bold markup', () =>
      expect(html(<b>Hello</b>)).toBe('＊Hello＊'))

    it('converts <strong> tag to bold markup', () =>
      expect(html(<strong>Hello</strong>)).toBe('＊Hello＊'))

    it('allows containing the other markup', () =>
      expect(
        html(
          <b>
            Hello, <i>World</i>!
          </b>
        )
      ).toBe('＊Hello, ＿World＿!＊'))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <b>
            <b>Double</b>
          </b>
        )
      ).toBe('＊Double＊'))

    it('uses regular markup when content has full-width asterisk', () =>
      expect(html(<b>bold＊text</b>)).toBe('*bold＊text*'))

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<b>Hello</b>)).toBe('\u200b＊\u200bHello\u200b＊\u200b')
    })
  })
})
