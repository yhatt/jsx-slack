/** @jsx JSXSlack.h */
import html from '../src/html'
import JSXSlack from '../src/index'

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
      expect(html(<i>Hello</i>)).toBe('_Hello_'))

    it('converts <em> tag to italic markup', () =>
      expect(html(<em>Hello</em>)).toBe('_Hello_'))

    it('allows containing the other markup', () =>
      expect(
        html(
          <i>
            Hello, <b>World</b>!
          </i>
        )
      ).toBe('_Hello, *World*!_'))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <i>
            <i>Double</i>
          </i>
        )
      ).toBe('_Double_'))

    it('uses compatible full-width markup when content has underscore', () =>
      expect(html(<i>italic_text</i>)).toBe('＿italic_text＿'))
  })

  describe('Bold', () => {
    it('converts <b> tag to bold markup', () =>
      expect(html(<b>Hello</b>)).toBe('*Hello*'))

    it('converts <strong> tag to bold markup', () =>
      expect(html(<strong>Hello</strong>)).toBe('*Hello*'))

    it('allows containing the other markup', () =>
      expect(
        html(
          <b>
            Hello, <i>World</i>!
          </b>
        )
      ).toBe('*Hello, _World_!*'))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <b>
            <b>Double</b>
          </b>
        )
      ).toBe('*Double*'))

    it('uses compatible full-width markup when content has asterisk', () =>
      expect(html(<b>bold*text</b>)).toBe('＊bold*text＊'))
  })
})
