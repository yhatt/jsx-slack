/** @jsx JSXSlack.h */
import html from '../src/html'
import JSXSlack from '../src/index'

const Fragment = ({ children }) => children

beforeEach(() => JSXSlack.exactMode(false))

describe('HTML parser for mrkdwn', () => {
  // https://api.slack.com/messaging/composing/formatting#escaping
  describe('Escape entity', () => {
    it('replaces "&" with "&amp;"', () => {
      expect(html('&&&')).toBe('&amp;&amp;&amp;')

      // Unknown entity
      expect(html('&heart;')).toBe('&amp;heart;')
    })

    it('does not replace already used ampersand for escaping', () => {
      expect(html('true &amp;& false')).toBe('true &amp;&amp; false')
      expect(html('A&lt;=&gt;B')).toBe('A&lt;=&gt;B')
    })

    it('replaces "<" with "&lt;"', () => expect(html('a<2')).toBe('a&lt;2'))
    it('replaces ">" with "&gt;"', () => expect(html('b>0')).toBe('b&gt;0'))
  })

  describe('Italic', () => {
    it('replaces <i> tag to italic markup', () =>
      expect(html(<i>Hello</i>)).toBe('_Hello_'))

    it('replaces <em> tag to italic markup', () =>
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

    it('allows containing underscore by using escaped char', () => {
      expect(html(<i>italic_text</i>)).toBe('_italic\u02cdtext_')

      // Full-width underscore (Alternative for italic markup)
      expect(html(<i>Hello, ＿World＿!</i>)).toBe('_Hello, \u2e0fWorld\u2e0f!_')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<i>Hello</i>)).toBe('\u200b_\u200bHello\u200b_\u200b')
    })
  })

  describe('Bold', () => {
    it('replaces <b> tag to bold markup', () =>
      expect(html(<b>Hello</b>)).toBe('*Hello*'))

    it('replaces <strong> tag to bold markup', () =>
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

    it('allows containing asterisk by using escaped char', () => {
      expect(html(<b>bold*text</b>)).toBe('*bold\u2217text*')

      // Full-width asterisk (Alternative for bold markup)
      expect(html(<b>Hello, ＊World＊!</b>)).toBe('*Hello, \ufe61World\ufe61!*')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<b>Hello</b>)).toBe('\u200b*\u200bHello\u200b*\u200b')
    })
  })

  describe('Strikethrough', () => {
    it('replaces <s> tag to strikethrough markup', () =>
      expect(html(<s>Hello</s>)).toBe('~Hello~'))

    it('replaces <del> tag to strikethrough markup', () =>
      expect(html(<del>Hello</del>)).toBe('~Hello~'))

    it('allows containing the other markup', () =>
      expect(
        html(
          <s>
            Hello, <b>World</b>!
          </s>
        )
      ).toBe('~Hello, *World*!~'))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <s>
            <s>Double</s>
          </s>
        )
      ).toBe('~Double~'))

    it('replaces tilde in contents to another character (Tilde operator)', () =>
      expect(html(<s>strike~through</s>)).toBe(
        '\u007estrike\u223cthrough\u007e'
      ))

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<s>Hello</s>)).toBe('\u200b~\u200bHello\u200b~\u200b')
    })
  })

  describe('Line break', () => {
    it('replaces <br> tag to line break', () =>
      expect(
        html(
          <Fragment>
            Hello,
            <br />
            <br />
            <br />
            World!
          </Fragment>
        )
      ).toBe('Hello,\n\n\nWorld!'))
  })

  describe('Paragraph', () => {
    it('has no differences between 1 paragraph and plain rendering', () =>
      expect(html(<p>Hello!</p>)).toBe(html('Hello!')))

    it('makes a blank like between paragraphs', () => {
      expect(
        html(
          <Fragment>
            <p>Hello!</p>
            <p>World!</p>
          </Fragment>
        )
      ).toBe(html('Hello!\n\nWorld!'))

      // Combination with plain text
      expect(
        html(
          <Fragment>
            A<p>B</p>C
          </Fragment>
        )
      ).toBe(html('A\n\nB\n\nC'))
    })

    it('keeps 2 and more blank lines made by <br> tag for layouting', () =>
      expect(
        html(
          <Fragment>
            <br />
            <br />
            <p>A</p>
            <br />
            <p>B</p>
            <br />
            <br />
            <br />
            <p>C</p>
            <br />
            <br />
            <br />
            <br />
          </Fragment>
        )
      ).toBe(html('\n\nA\n\nB\n\n\nC\n\n\n\n')))

    it('ignores invalid double markup', () =>
      expect(
        html(
          <p>
            <p>Double</p>
          </p>
        )
      ).toBe('Double'))
  })
})
