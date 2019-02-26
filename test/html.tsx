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

    it('does not conflict element-like string with internals', () => {
      expect(html('<br />')).toBe('&lt;br /&gt;')
      expect(html('<<pre:0>>')).toBe('&lt;&lt;pre:0&gt;&gt;')
    })
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

    it('applies markup per each lines when text has multiline', () => {
      expect(
        html(
          <i>
            foo
            <br />
            bar
          </i>
        )
      ).toBe('_foo_\n_bar_')

      expect(
        html(
          <i>
            <p>foo</p>
            <p>bar</p>
          </i>
        )
      ).toBe('_foo_\n\n_bar_')
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

    it('applies markup per each lines when text has multiline', () => {
      expect(
        html(
          <b>
            foo
            <br />
            bar
          </b>
        )
      ).toBe('*foo*\n*bar*')

      expect(
        html(
          <b>
            <p>foo</p>
            <p>bar</p>
          </b>
        )
      ).toBe('*foo*\n\n*bar*')
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

    it('applies markup per each lines when text has multiline', () => {
      expect(
        html(
          <s>
            foo
            <br />
            bar
          </s>
        )
      ).toBe('~foo~\n~bar~')

      expect(
        html(
          <s>
            <p>foo</p>
            <p>bar</p>
          </s>
        )
      ).toBe('~foo~\n\n~bar~')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<s>Hello</s>)).toBe('\u200b~\u200bHello\u200b~\u200b')
    })
  })

  describe('Inline code', () => {
    it('replaces <code> tag to inline code markup', () => {
      expect(html(<code>Inline code</code>)).toBe('`Inline code`')
      expect(html(<code>*allow* _using_ ~markup~</code>)).toBe(
        '`*allow* _using_ ~markup~`'
      )
    })

    it('ignores invalid double markup', () =>
      expect(
        html(
          <code>
            <code>Double</code>
          </code>
        )
      ).toBe('`Double`'))

    it('does never apply nested markup', () =>
      expect(
        html(
          <code>
            <b>bold</b> <i>italic</i> <s>strikethrough</s>
          </code>
        )
      ).toBe('`bold italic strikethrough`'))

    it('allows containing backtick by using escaped char', () => {
      expect(html(<code>`code`</code>)).toBe('`\u02cbcode\u02cb`')

      // Full-width backtick (Alternative for inline code markup)
      expect(html(<code>｀code｀</code>)).toBe('`\u02cbcode\u02cb`')
    })

    it('applies markup per each lines when code has multiline', () => {
      expect(
        html(
          <code>
            foo
            <br />
            bar
          </code>
        )
      ).toBe('`foo`\n`bar`')

      expect(
        html(
          <code>
            foo
            <br />
            <br />
            bar
          </code>
        )
      ).toBe('`foo`\n\n`bar`')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(html(<code>code</code>)).toBe('\u200b`\u200bcode\u200b`\u200b')
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
      ).toBe('Hello!\n\nWorld!')

      // Combination with plain text
      expect(
        html(
          <Fragment>
            A<p>B</p>C
          </Fragment>
        )
      ).toBe('A\n\nB\n\nC')
    })

    it('ignores invalid double markup', () =>
      expect(
        html(
          <p>
            <p>Double</p>
          </p>
        )
      ).toBe('Double'))
  })

  describe('Blockquote', () => {
    it('makes a blank like between blockquotes', () => {
      expect(
        html(
          <Fragment>
            <blockquote>Hello!</blockquote>
            <blockquote>World!</blockquote>
          </Fragment>
        )
      ).toBe('&gt; Hello!\n&gt; \n\n&gt; World!\n&gt;')

      // Combination with plain text and line breaks
      expect(
        html(
          <Fragment>
            A<blockquote>B</blockquote>C
          </Fragment>
        )
      ).toBe('A\n\n&gt; B\n&gt; \n\nC')

      // Combination with paragraph
      expect(
        html(
          <Fragment>
            <p>test</p>
            <blockquote>
              <p>foo</p>
              <p>bar</p>
            </blockquote>
            <p>test</p>
          </Fragment>
        )
      ).toBe('test\n\n&gt; foo\n&gt; \n&gt; bar\n&gt; \n\ntest')

      expect(
        html(
          <b>
            <blockquote>
              <p>A</p>
              <i>B</i>
              <p>C</p>
            </blockquote>
          </b>
        )
      ).toBe('&gt; *A*\n&gt; \n&gt; *_B_*\n&gt; \n&gt; *C*\n&gt;')
    })

    it('ignores invalid double markup', () =>
      expect(
        html(
          <blockquote>
            <blockquote>Double</blockquote>
          </blockquote>
        )
      ).toBe('&gt; Double\n&gt;'))

    it('escapes blockquote mrkdwn character by inserting soft hyphen', () => {
      expect(html(<blockquote>&gt; blockquote</blockquote>)).toBe(
        '&gt; \u00ad&gt; blockquote\n&gt;'
      )

      // Full-width character (Alternative for blockquote markup)
      expect(html(<blockquote>＞blockquote</blockquote>)).toBe(
        '&gt; \u00ad＞blockquote\n&gt;'
      )
    })
  })

  describe('Pre-formatted text', () => {
    it('makes line break and space between around contents', () => {
      expect(
        html(
          <Fragment>
            foo<pre>{'pre\nformatted\ntext'}</pre>bar
          </Fragment>
        )
      ).toBe('foo\n```\npre\nformatted\ntext\n```\nbar')

      expect(
        html(
          <Fragment>
            <p>foo</p>
            <pre>{'pre\nformatted\ntext'}</pre>
            <p>bar</p>
          </Fragment>
        )
      ).toBe('foo\n\n```\npre\nformatted\ntext\n```\n\nbar')
    })

    it('allows wrapping by text format character', () =>
      expect(
        html(
          <b>
            <i>
              <pre>{'bold\nand italic'}</pre>
            </i>
          </b>
        )
      ).toBe('*_```\nbold\nand italic\n```_*'))

    it('does not apply wrapped strikethrough by Slack restriction', () =>
      expect(
        html(
          <s>
            <blockquote>
              strikethrough and
              <pre>{'quoted\ntext'}</pre>
            </blockquote>
          </s>
        )
      ).toBe('&gt; ~strikethrough and~\n&gt; ```\nquoted\ntext\n```\n&gt;'))
  })

  describe('List', () => {
    it('converts unordered list to mimicked text', () => {
      expect(
        html(
          <ul>
            <li>a</li>
            <li>
              <b>b</b>
            </li>
            <li>c</li>
          </ul>
        )
      ).toBe('• a\n• *b*\n• c')
    })

    it('converts ordered list to plain text', () => {
      expect(
        html(
          <ol>
            <li>a</li>
            <li>b</li>
            <li>
              <code>c</code>
            </li>
          </ol>
        )
      ).toBe('1. a\n2. b\n3. `c`')
    })

    it('allows multiline content by aligned indent', () => {
      expect(
        html(
          <ul>
            <li>
              Hello, <br />
              world!
            </li>
            <li>
              <p>Paragraph</p>
              <p>supported</p>
            </li>
          </ul>
        )
      ).toBe('• Hello,\n\u2007 world!\n• Paragraph\n\u2007 \n\u2007 supported')

      expect(
        html(
          <ol>
            <li>
              Ordered
              <br />
              list
            </li>
            <li>
              <p>Well</p>
              <p>aligned</p>
            </li>
          </ol>
        )
      ).toBe('1. Ordered\n\u2007  list\n2. Well\n\u2007  \n\u2007  aligned')
    })

    it('allows setting start number via start attribute in ordered list', () => {
      expect(
        html(
          <ol start={9}>
            <li>Change</li>
            <li>
              Start
              <br />
              number
            </li>
          </ol>
        )
      ).toBe('9. Change\n10. Start\n\u2007\u2007  number')
    })

    // TODO: Support nested list
    it.skip('allows nested list', () => {
      expect(
        html(
          <ul>
            <li>test</li>
            <ul>
              <li>nesting</li>
            </ul>
          </ul>
        )
      ).toBe('• test\n\u2007 • nesting')
    })

    it('does not allow unsupported block components', () => {
      expect(
        html(
          <ul>
            <li>
              <pre>pre</pre>
            </li>
            <li>
              <blockquote>blockquote</blockquote>
            </li>
          </ul>
        )
      ).toBe('• pre\n• blockquote')
    })
  })

  describe('Link', () => {
    it('converts <a> tag to mrkdwn link format', () => {
      expect(html(<a href="https://example.com/">Example</a>)).toBe(
        '<https://example.com/|Example>'
      )
      expect(html(<a href="mailto:mail@example.com">E-mail</a>)).toBe(
        '<mailto:mail@example.com|E-mail>'
      )
    })

    it('allows using elements inside <a> tag', () => {
      expect(
        html(
          <a href="https://example.com/">
            <i>with</i> <b>text</b> <s>formatting</s>
          </a>
        )
      ).toBe('<https://example.com/|_with_ *text* ~formatting~>')

      expect(
        html(
          <a href="https://example.com/">
            <blockquote>
              Link blockquote
              <br />
              (Single line only)
            </blockquote>
          </a>
        )
      ).toBe('<https://example.com/|&gt; Link blockquote (Single line only)>')

      expect(
        html(
          <a href="https://example.com/">
            <pre>{'Link\npre-formatted\ntext'}</pre>
          </a>
        )
      ).toBe('<https://example.com/|```Link pre-formatted text```>')
    })

    it('does not allow multiline contents to prevent breaking link', () => {
      expect(
        html(
          <a href="https://example.com/">
            Ignores
            <br />
            multiline
          </a>
        )
      ).toBe('<https://example.com/|Ignores multiline>')

      expect(
        html(
          <a href="https://example.com/">
            <p>Ignores</p>
            <p>paragraph</p>
          </a>
        )
      ).toBe('<https://example.com/|Ignores paragraph>')
    })
  })
})
