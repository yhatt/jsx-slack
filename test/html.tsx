/** @jsx JSXSlack.h */
import html from '../src/html'
import JSXSlack, { Fragment } from '../src/index'

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

    it('replaces <strike> tag to strikethrough markup', () =>
      expect(html(<strike>Hello</strike>)).toBe('~Hello~'))

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
      ).toBe('\u20079. Change\n10. Start\n\u2007\u2007  number') // aligned number

      // Coerce to integer
      expect(
        html(
          <ol start={3.5}>
            <li>test</li>
          </ol>
        )
      ).toBe(
        html(
          <ol start={3}>
            <li>test</li>
          </ol>
        )
      )
    })

    it('allows sub list', () => {
      expect(
        html(
          <ul>
            <li>test</li>
            <ul>
              <li>sub-list with direct nesting</li>
            </ul>
            <li>
              <ul>
                <li>sub-list</li>
                <li>
                  and
                  <ul>
                    <li>sub-sub-list</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        )
      ).toBe(
        '• test\n\u2007 ◦ sub-list with direct nesting\n• ◦ sub-list\n\u2007 ◦ and\n\u2007 \u2007 ▪\ufe0e sub-sub-list'
      )
    })

    it('allows sub ordered list', () => {
      expect(
        html(
          <ol start={2}>
            <li>test</li>
            <ol>
              <li>sub-list with direct nesting</li>
            </ol>
            <li>
              <ol>
                <li>sub-list</li>
                <li>
                  and
                  <ul>
                    <li>sub-sub-list</li>
                  </ul>
                </li>
              </ol>
            </li>
          </ol>
        )
      ).toBe(
        '2. test\n\u2007  1. sub-list with direct nesting\n3. 1. sub-list\n\u2007  2. and\n\u2007  \u2007  ▪\ufe0e sub-sub-list'
      )
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

  describe('Link and mention', () => {
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
            Ignore
            <br />
            multiline
          </a>
        )
      ).toBe('<https://example.com/|Ignore multiline>')

      expect(
        html(
          <a href="https://example.com/">
            <p>Ignore</p>
            <p>paragraph</p>
          </a>
        )
      ).toBe('<https://example.com/|Ignore paragraph>')
    })

    it('escapes chars in URL by percent encoding', () =>
      expect(
        html(<a href='https://example.com/?regex="<(i|em)>"'>escape test</a>)
      ).toBe('<https://example.com/?regex=%22%3C(i%7Cem)%3E%22|escape test>'))

    it('converts to channel link when referenced public channel ID', () => {
      expect(html(<a href="#C0123ABCD" />)).toBe('<#C0123ABCD>')
      expect(html(<a href="#CWXYZ9876">Ignore contents</a>)).toBe(
        '<#CWXYZ9876>'
      )
      expect(
        html(
          <b>
            <a href="#C0123ABCD" />
          </b>
        )
      ).toBe('*<#C0123ABCD>*')
    })

    it('converts to user mention when referenced user ID', () => {
      expect(html(<a href="@U0123ABCD" />)).toBe('<@U0123ABCD>')
      expect(html(<a href="@WGLOBALID" />)).toBe('<@WGLOBALID>')
      expect(html(<a href="@UWXYZ9876">Ignore contents</a>)).toBe(
        '<@UWXYZ9876>'
      )
      expect(
        html(
          <i>
            <a href="@U0123ABCD" />
          </i>
        )
      ).toBe('_<@U0123ABCD>_')
    })

    it('converts to user group mention when referenced subteam ID', () => {
      expect(html(<a href="@S0123ABCD" />)).toBe('<!subteam^S0123ABCD>')
      expect(html(<a href="@SWXYZ9876">Ignore contents</a>)).toBe(
        '<!subteam^SWXYZ9876>'
      )
      expect(
        html(
          <s>
            <a href="@S0123ABCD" />
          </s>
        )
      ).toBe('~<!subteam^S0123ABCD>~')
    })

    it('converts special mentions', () => {
      expect(html(<a href="@here" />)).toBe('<!here|here>')
      expect(html(<a href="@channel" />)).toBe('<!channel|channel>')
      expect(html(<a href="@everyone" />)).toBe('<!everyone|everyone>')
      expect(html(<a href="@here">Ignore contents</a>)).toBe('<!here|here>')
      expect(
        html(
          <b>
            <i>
              <a href="@here" />
            </i>
          </b>
        )
      ).toBe('*_<!here|here>_*')
    })
  })

  describe('Time localization', () => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const tomorrow = new Date(today.getTime() + 86400000)

    it('converts <time> tag to mrkdwn format', () => {
      expect(
        html(
          <time datetime="1552212000" fallback="fallback">
            {'{date_num}'}
          </time>
        )
      ).toBe('<!date^1552212000^{date_num}|fallback>')
    })

    it('generates UTC fallback text from content if fallback attr is not defined', () => {
      // 1552212000 => 2019-03-10 10:00:00 UTC (= 02:00 PST = 03:00 PDT)
      expect(html(<time datetime={1552212000}>{'{date_num}'}</time>)).toBe(
        '<!date^1552212000^{date_num}|2019-03-10>'
      )

      expect(html(<time datetime={1552212000}>{'{date}'}</time>)).toBe(
        '<!date^1552212000^{date}|March 10th, 2019>'
      )

      expect(html(<time datetime={1552212000}>{'{date_short}'}</time>)).toBe(
        '<!date^1552212000^{date_short}|Mar 10, 2019>'
      )

      expect(html(<time datetime={1552212000}>{'{date_long}'}</time>)).toBe(
        '<!date^1552212000^{date_long}|Sunday, March 10th, 2019>'
      )

      expect(html(<time datetime={1552212000}>{'{time}'}</time>)).toBe(
        '<!date^1552212000^{time}|10:00 AM>'
      )

      expect(html(<time datetime={1552212000}>{'{time_secs}'}</time>)).toBe(
        '<!date^1552212000^{time_secs}|10:00:00 AM>'
      )
    })

    test.each`
      datetime     | format                      | contain
      ${today}     | ${'{date_pretty}'}          | ${'Today'}
      ${today}     | ${'{date_short_pretty}'}    | ${'Today'}
      ${today}     | ${'{date_long_pretty}'}     | ${'Today'}
      ${today}     | ${'At {date_pretty}'}       | ${'At today'}
      ${today}     | ${'At {date_short_pretty}'} | ${'At today'}
      ${today}     | ${'At {date_long_pretty}'}  | ${'At today'}
      ${yesterday} | ${'{date_pretty}'}          | ${'Yesterday'}
      ${yesterday} | ${'{date_short_pretty}'}    | ${'Yesterday'}
      ${yesterday} | ${'{date_long_pretty}'}     | ${'Yesterday'}
      ${yesterday} | ${'At {date_pretty}'}       | ${'At yesterday'}
      ${yesterday} | ${'At {date_short_pretty}'} | ${'At yesterday'}
      ${yesterday} | ${'At {date_long_pretty}'}  | ${'At yesterday'}
      ${tomorrow}  | ${'{date_pretty}'}          | ${'Tomorrow'}
      ${tomorrow}  | ${'{date_short_pretty}'}    | ${'Tomorrow'}
      ${tomorrow}  | ${'{date_long_pretty}'}     | ${'Tomorrow'}
      ${tomorrow}  | ${'At {date_pretty}'}       | ${'At tomorrow'}
      ${tomorrow}  | ${'At {date_short_pretty}'} | ${'At tomorrow'}
      ${tomorrow}  | ${'At {date_long_pretty}'}  | ${'At tomorrow'}
    `(
      'generates prettified fallback date "$contain" with format "$format"',
      ({ datetime, format, contain }) => {
        expect(html(<time datetime={datetime}>{format}</time>)).toContain(
          `|${contain}>`
        )
      }
    )

    it('ignores any elements in children', () => {
      const date = new Date(Date.UTC(2019, 2, 10, 10, 0, 0))

      expect(
        html(
          <time datetime={date} fallback="fallback">
            <i>with</i> <b>text</b> <s>formatting</s>
          </time>
        )
      ).toBe('<!date^1552212000^with text formatting|fallback>')

      expect(
        html(
          <time datetime={date} fallback="fallback">
            Convert
            <br />
            line breaks
            <br />
            <br />
            to a space
          </time>
        )
      ).toBe('<!date^1552212000^Convert line breaks to a space|fallback>')

      expect(
        html(
          <time datetime={date} fallback="fallback">
            <blockquote>test</blockquote>
            <pre>test</pre>
            <code>test</code>
            <a href="https://example.com/">test</a>
          </time>
        )
      ).toBe('<!date^1552212000^testtesttesttest|fallback>')
    })

    it('integrates mrkdwn when <time> tag is linked', () => {
      expect(
        html(
          <a href="https://example.com/">
            <time datetime={1552212000} fallback="2019-03-10">
              {'{date_num}'}
            </time>
          </a>
        )
      ).toBe('<!date^1552212000^{date_num}^https://example.com/|2019-03-10>')
    })

    it('escapes divider in contents and fallback', () => {
      expect(
        html(
          <time datetime={1552212000} fallback="by XXX | 2019-03-10">
            by XXX | {'{date_num}'}
          </time>
        )
      ).toBe(
        '<!date^1552212000^by XXX \u01c0 {date_num}|by XXX \u01c0 2019-03-10>'
      )
    })
  })
})
