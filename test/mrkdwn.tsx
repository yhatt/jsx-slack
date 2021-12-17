/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { JSXSlack } from '../src/index'
import { mrkdwn } from '../src/mrkdwn/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('HTML parser for mrkdwn', () => {
  it('throws error when using not supported tag', () => {
    // @ts-expect-error
    expect(() => mrkdwn(<div>test</div>)).toThrow(/unknown/i)
  })

  // https://api.slack.com/messaging/composing/formatting#escaping
  describe('Escape entity', () => {
    it('replaces "&" with "&amp;"', () => {
      expect(mrkdwn('&&&')).toBe('&amp;&amp;&amp;')
      expect(mrkdwn('&heart;')).toBe('&amp;heart;')
    })

    it('allows double escaping', () => {
      expect(mrkdwn('true &amp;& false')).toBe('true &amp;amp;&amp; false')
      expect(mrkdwn('A&lt;=&gt;B')).toBe('A&amp;lt;=&amp;gt;B')
    })

    it('replaces "<" with "&lt;"', () => expect(mrkdwn('a<2')).toBe('a&lt;2'))
    it('replaces ">" with "&gt;"', () => expect(mrkdwn('b>0')).toBe('b&gt;0'))

    it('does not conflict element-like string with internals', () => {
      expect(mrkdwn('<br />')).toBe('&lt;br /&gt;')
      expect(mrkdwn('<<pre:0>>')).toBe('&lt;&lt;pre:0&gt;&gt;')
    })
  })

  describe('HTML entities', () => {
    it('decodes HTML entities passed as JSX', () =>
      expect(mrkdwn(<i>&hearts;</i>)).toBe('_\u2665_'))

    it('re-encodes special characters in Slack', () =>
      expect(mrkdwn(<i>&lt;&amp;&gt;</i>)).toBe('_&lt;&amp;&gt;_'))

    it('does not decode HTML entities passed as string literal', () => {
      expect(mrkdwn(<i>{'&hearts;'}</i>)).toBe('_&amp;hearts;_')
      expect(mrkdwn(<i>{'&lt;&amp;&gt;'}</i>)).toBe(
        '_&amp;lt;&amp;amp;&amp;gt;_'
      )
      expect(mrkdwn(<i>&lt;{'<mixed>'}&gt;</i>)).toBe('_&lt;&lt;mixed&gt;&gt;_')
    })

    it('keeps special spaces around the content', () => {
      expect(
        mrkdwn(
          <i>
            {'  '}test{'  '}
          </i>
        )
      ).toBe('_test_')
      expect(mrkdwn(<i>&#9;&#9;tab&#9;&#9;</i>)).toBe('_tab_')
      expect(
        mrkdwn(<i>&thinsp;&nbsp;&ensp;&emsp;sp&emsp;&ensp;&nbsp;&thinsp;</i>)
      ).toBe('_\u2009\u00a0\u2002\u2003sp\u2003\u2002\u00a0\u2009_')
    })
  })

  describe('Italic', () => {
    it('replaces <i> tag to italic markup', () =>
      expect(mrkdwn(<i>Hello</i>)).toBe('_Hello_'))

    it('replaces <em> tag to italic markup', () =>
      expect(mrkdwn(<em>Hello</em>)).toBe('_Hello_'))

    it('allows containing the other markup', () =>
      expect(
        mrkdwn(
          <i>
            Hello, <b>World</b>!
          </i>
        )
      ).toBe('_Hello, *World*!_'))

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <i>
            <i>Double</i>
          </i>
        )
      ).toBe('_Double_'))

    it('allows containing underscore by using fallback of date formatting', () => {
      expect(mrkdwn(<i>italic_text</i>)).toBe(
        '_italic<!date^00000000^{_}|_>text_'
      )

      // Full-width underscore (Alternative for italic markup)
      expect(mrkdwn(<i>Hello, ＿World＿!</i>)).toBe(
        '_Hello, <!date^00000000^{_}|＿>World<!date^00000000^{_}|＿>!_'
      )
    })

    it('replaces underscore with similar character within hyperlink', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <i>_test_</i>
          </a>
        )
      ).toBe('<https://example.com/|_\u02cdtest\u02cd_>')

      expect(
        mrkdwn(
          <i>
            <a href="https://example.com/">_test_</a>
          </i>
        )
      ).toBe('_<https://example.com/|\u02cdtest\u02cd>_')

      expect(
        mrkdwn(
          <a href="https://example.com/">
            <i>＿test＿</i>
          </a>
        )
      ).toBe('<https://example.com/|_\u2e0ftest\u2e0f_>')

      expect(
        mrkdwn(
          <i>
            <a href="https://example.com/">＿test＿</a>
          </i>
        )
      ).toBe('_<https://example.com/|\u2e0ftest\u2e0f>_')
    })

    it('does not escape underscore contained in valid emoji shorthand', () => {
      expect(mrkdwn(<i>:arrow_down:</i>)).toBe('_:arrow_down:_')
      expect(mrkdwn(<i>:絵＿文字:</i>)).toBe('_:絵＿文字:_')
    })

    it('does not escape underscore contained in valid link', () => {
      expect(
        mrkdwn(
          <i>
            <a href="https://example.com/a_b_c">_link_</a>
          </i>
        )
      ).toBe('_<https://example.com/a_b_c|\u02cdlink\u02cd>_')
    })

    it('does not escape underscore contained in valid time formatting', () => {
      // NOTE: Fallback text will render as plain text even if containing character for formatting
      expect(
        mrkdwn(
          <i>
            <time dateTime={1234567890} fallback="fall_back">
              {'{date_num} {time_secs}'}
            </time>
          </i>
        )
      ).toBe('_<!date^1234567890^{date_num} {time_secs}|fall_back>_')
    })

    it('applies markup per each lines when text has multiline', () => {
      expect(
        mrkdwn(
          <i>
            foo
            <br />
            bar
          </i>
        )
      ).toBe('_foo_\n_bar_')

      expect(
        mrkdwn(
          <i>
            <p>foo</p>
            <p>bar</p>
          </i>
        )
      ).toBe('_foo_\n\n_bar_')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(mrkdwn(<i>Hello</i>)).toBe('\u200b_\u200bHello\u200b_\u200b')
    })
  })

  describe('Bold', () => {
    it('replaces <b> tag to bold markup', () =>
      expect(mrkdwn(<b>Hello</b>)).toBe('*Hello*'))

    it('replaces <strong> tag to bold markup', () =>
      expect(mrkdwn(<strong>Hello</strong>)).toBe('*Hello*'))

    it('allows containing the other markup', () =>
      expect(
        mrkdwn(
          <b>
            Hello, <i>World</i>!
          </b>
        )
      ).toBe('*Hello, _World_!*'))

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <b>
            <b>Double</b>
          </b>
        )
      ).toBe('*Double*'))

    it('allows containing asterisk by using fallback of date formatting', () => {
      expect(mrkdwn(<b>bold*text</b>)).toBe('*bold<!date^00000000^{_}|*>text*')

      // Full-width asterisk (Alternative for bold markup)
      expect(mrkdwn(<b>Hello, ＊World＊!</b>)).toBe(
        '*Hello, <!date^00000000^{_}|＊>World<!date^00000000^{_}|＊>!*'
      )
    })

    it('replaces asterisk with similar character within hyperlink', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <b>*test*</b>
          </a>
        )
      ).toBe('<https://example.com/|*\u2217test\u2217*>')

      expect(
        mrkdwn(
          <b>
            <a href="https://example.com/">*test*</a>
          </b>
        )
      ).toBe('*<https://example.com/|\u2217test\u2217>*')

      expect(
        mrkdwn(
          <a href="https://example.com/">
            <b>＊test＊</b>
          </a>
        )
      ).toBe('<https://example.com/|*\ufe61test\ufe61*>')

      expect(
        mrkdwn(
          <b>
            <a href="https://example.com/">＊test＊</a>
          </b>
        )
      ).toBe('*<https://example.com/|\ufe61test\ufe61>*')
    })

    it('applies markup per each lines when text has multiline', () => {
      expect(
        mrkdwn(
          <b>
            foo
            <br />
            bar
          </b>
        )
      ).toBe('*foo*\n*bar*')

      expect(
        mrkdwn(
          <b>
            <p>foo</p>
            <p>bar</p>
          </b>
        )
      ).toBe('*foo*\n\n*bar*')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(mrkdwn(<b>Hello</b>)).toBe('\u200b*\u200bHello\u200b*\u200b')
    })
  })

  describe('Strikethrough', () => {
    it('replaces <s> tag to strikethrough markup', () =>
      expect(mrkdwn(<s>Hello</s>)).toBe('~Hello~'))

    it('replaces <strike> tag to strikethrough markup', () =>
      expect(mrkdwn(<strike>Hello</strike>)).toBe('~Hello~'))

    it('replaces <del> tag to strikethrough markup', () =>
      expect(mrkdwn(<del>Hello</del>)).toBe('~Hello~'))

    it('allows containing the other markup', () =>
      expect(
        mrkdwn(
          <s>
            Hello, <b>World</b>!
          </s>
        )
      ).toBe('~Hello, *World*!~'))

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <s>
            <s>Double</s>
          </s>
        )
      ).toBe('~Double~'))

    it('allows containing tilde by using fallback of date formatting', () =>
      expect(mrkdwn(<s>strike~through</s>)).toBe(
        '~strike<!date^00000000^{_}|~>through~'
      ))

    it('replaces tilde with tilde operatpr within hyperlink', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <s>~strikethrough~</s>
          </a>
        )
      ).toBe('<https://example.com/|~\u223cstrikethrough\u223c~>')

      expect(
        mrkdwn(
          <s>
            <a href="https://example.com/">~strikethrough~</a>
          </s>
        )
      ).toBe('~<https://example.com/|\u223cstrikethrough\u223c>~')
    })

    it('applies markup per each lines when text has multiline', () => {
      expect(
        mrkdwn(
          <s>
            foo
            <br />
            bar
          </s>
        )
      ).toBe('~foo~\n~bar~')

      expect(
        mrkdwn(
          <s>
            <p>foo</p>
            <p>bar</p>
          </s>
        )
      ).toBe('~foo~\n\n~bar~')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(mrkdwn(<s>Hello</s>)).toBe('\u200b~\u200bHello\u200b~\u200b')
    })
  })

  describe('Inline code', () => {
    it('replaces <code> tag to inline code markup', () => {
      expect(mrkdwn(<code>Inline code</code>)).toBe('`Inline code`')
      expect(mrkdwn(<code>*allow* _using_ ~markup~</code>)).toBe(
        '`*allow* _using_ ~markup~`'
      )
    })

    it('renders HTML special characters correctly', () =>
      expect(mrkdwn(<code>{'<abbr title="and">&</abbr>'}</code>)).toBe(
        '`&lt;abbr title="and"&gt;&amp;&lt;/abbr&gt;`'
      ))

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <code>
            <code>Double</code>
          </code>
        )
      ).toBe('`Double`'))

    it('does never apply nested markup', () =>
      expect(
        mrkdwn(
          <code>
            <b>bold</b> <i>italic</i> <s>strikethrough</s>
          </code>
        )
      ).toBe('`bold italic strikethrough`'))

    it('allows containing backtick by using fallback of date formatting', () => {
      expect(mrkdwn(<code>`code`</code>)).toBe(
        '`<!date^00000000^{_}|`>code<!date^00000000^{_}|`>`'
      )

      // Full-width backtick (Alternative for inline code markup)
      expect(mrkdwn(<code>｀code｀</code>)).toBe(
        '`<!date^00000000^{_}|｀>code<!date^00000000^{_}|｀>`'
      )
    })

    it('replaces backtick with similar character within hyperlink', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <code>`code`</code>
          </a>
        )
      ).toBe('<https://example.com/|`\u02cbcode\u02cb`>')

      expect(
        mrkdwn(
          <code>
            <a href="https://example.com/">`code`</a>
          </code>
        )
      ).toBe('`<https://example.com/|\u02cbcode\u02cb>`')

      expect(
        mrkdwn(
          <a href="https://example.com/">
            <code>｀code｀</code>
          </a>
        )
      ).toBe('<https://example.com/|`\u02cbcode\u02cb`>')

      expect(
        mrkdwn(
          <code>
            <a href="https://example.com/">｀code｀</a>
          </code>
        )
      ).toBe('`<https://example.com/|\u02cbcode\u02cb>`')
    })

    it('applies markup per each lines when code has multiline', () => {
      expect(
        mrkdwn(
          <code>
            foo
            <br />
            bar
          </code>
        )
      ).toBe('`foo`\n`bar`')

      expect(
        mrkdwn(
          <code>
            foo
            <br />
            <br />
            bar
          </code>
        )
      ).toBe('`foo`\n\n`bar`')
    })

    it('allows containing link', () => {
      expect(
        mrkdwn(
          <>
            <code>
              <a href="https://example.com/">{'<example>'}</a>
            </code>
            <br />
            <code>
              <a href="@channel" />
            </code>
          </>
        )
      ).toBe('`<https://example.com/|&lt;example&gt;>`\n`<!channel|channel>`')
    })

    it('allows containing time tag for localization', () => {
      expect(
        mrkdwn(
          <code>
            <time dateTime="1552212000">{'{date_num}'}</time>
          </code>
        )
      ).toBe('`<!date^1552212000^{date_num}|2019-03-10>`')
    })

    it('inserts invisible spaces around markup chars when rendered in exact mode', () => {
      JSXSlack.exactMode(true)
      expect(mrkdwn(<code>code</code>)).toBe('\u200b`\u200bcode\u200b`\u200b')
    })
  })

  describe('Line break', () => {
    it('replaces <br> tag to line break', () =>
      expect(
        mrkdwn(
          <>
            Hello,
            <br />
            <br />
            <br />
            World!
          </>
        )
      ).toBe('Hello,\n\n\nWorld!'))
  })

  describe('Paragraph', () => {
    it('has no differences between 1 paragraph and plain rendering', () =>
      expect(mrkdwn(<p>Hello!</p>)).toBe(mrkdwn('Hello!')))

    it('makes a blank like between paragraphs', () => {
      expect(
        mrkdwn(
          <>
            <p>Hello!</p>
            <p>World!</p>
          </>
        )
      ).toBe('Hello!\n\nWorld!')

      // Combination with plain text
      expect(
        mrkdwn(
          <>
            A<p>B</p>C
          </>
        )
      ).toBe('A\n\nB\n\nC')
    })

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <p>
            <p>Double</p>
          </p>
        )
      ).toBe('Double'))
  })

  describe('Blockquote', () => {
    it('makes a blank like between blockquotes', () => {
      expect(
        mrkdwn(
          <>
            <blockquote>Hello!</blockquote>
            <blockquote>World!</blockquote>
          </>
        )
      ).toBe('&gt; Hello!\n&gt; \n\n&gt; World!\n&gt; ')

      // Combination with plain text and line breaks
      expect(
        mrkdwn(
          <>
            A<blockquote>B</blockquote>C
          </>
        )
      ).toBe('A\n\n&gt; B\n&gt; \n\nC')

      // Combination with paragraph
      expect(
        mrkdwn(
          <>
            <p>test</p>
            <blockquote>
              <p>foo</p>
              <p>bar</p>
            </blockquote>
            <p>test</p>
          </>
        )
      ).toBe('test\n\n&gt; foo\n&gt; \n&gt; bar\n&gt; \n\ntest')

      expect(
        mrkdwn(
          <b>
            <blockquote>
              <p>A</p>
              <i>B</i>
              <p>C</p>
            </blockquote>
          </b>
        )
      ).toBe('&gt; *A*\n&gt; \n&gt; *_B_*\n&gt; \n&gt; *C*\n&gt; ')
    })

    it('renders many tags in the blockquote tag immediately', () => {
      const startTime = Date.now()

      mrkdwn(
        <blockquote>
          {[...Array(30)].map((_, i) => (
            <b>{i}</b>
          ))}
        </blockquote>
      )

      const processTime = Date.now() - startTime
      expect(processTime).toBeLessThan(1000)
    })

    it('ignores invalid double markup', () =>
      expect(
        mrkdwn(
          <blockquote>
            <blockquote>Double</blockquote>
          </blockquote>
        )
      ).toBe('&gt; Double\n&gt; '))

    it('escapes blockquote mrkdwn character by inserting soft hyphen', () =>
      expect(mrkdwn(<blockquote>&gt; blockquote</blockquote>)).toBe(
        '&gt; \u00ad&gt; blockquote\n&gt; '
      ))

    it('escapes full-width quote character by using fallback of date formatting', () =>
      expect(mrkdwn(<blockquote>＞blockquote</blockquote>)).toBe(
        '&gt; <!date^00000000^{_}|＞>blockquote\n&gt; '
      ))

    it('always inserts soft hyphen when included quote character within hyperlink', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <blockquote>&gt; blockquote</blockquote>
          </a>
        )
      ).toBe('&gt; <https://example.com/|\u00ad&gt; blockquote>\n&gt; ')

      expect(
        mrkdwn(
          <blockquote>
            <a href="https://example.com/">&gt; blockquote</a>
          </blockquote>
        )
      ).toBe('&gt; <https://example.com/|\u00ad&gt; blockquote>\n&gt; ')

      expect(
        mrkdwn(
          <a href="https://example.com/">
            <blockquote>＞blockquote</blockquote>
          </a>
        )
      ).toBe('&gt; <https://example.com/|\u00ad＞blockquote>\n&gt; ')

      expect(
        mrkdwn(
          <blockquote>
            <a href="https://example.com/">＞blockquote</a>
          </blockquote>
        )
      ).toBe('&gt; <https://example.com/|\u00ad＞blockquote>\n&gt; ')
    })
  })

  describe('Pre-formatted text', () => {
    it('makes line break and space between around contents', () => {
      expect(
        mrkdwn(
          <>
            foo<pre>{'pre\nformatted\ntext'}</pre>bar
          </>
        )
      ).toBe('foo\n```\npre\nformatted\ntext\n```\nbar')

      expect(
        mrkdwn(
          <>
            <p>foo</p>
            <pre>{'pre\nformatted\ntext'}</pre>
            <p>bar</p>
          </>
        )
      ).toBe('foo\n\n```\npre\nformatted\ntext\n```\n\nbar')
    })

    it('preserves whitespaces for indent', () => {
      const preformatted = '{\n  hello\n}'
      expect(mrkdwn(<pre>{preformatted}</pre>)).toBe('```\n{\n  hello\n}\n```')

      // with <a> link
      expect(
        mrkdwn(
          <pre>
            {'{\n  '}
            <a href="https://example.com/">hello</a>
            {'\n}'}
          </pre>
        )
      ).toBe('```\n{\n  <https://example.com/|hello>\n}\n```')
    })

    it('allows wrapping by text format character', () =>
      expect(
        mrkdwn(
          <b>
            <i>
              <pre>{'bold\nand italic'}</pre>
            </i>
          </b>
        )
      ).toBe('*_```\nbold\nand italic\n```_*'))

    it('does not apply wrapped strikethrough by Slack restriction', () =>
      expect(
        mrkdwn(
          <s>
            <blockquote>
              strikethrough and
              <pre>{'quoted\ntext'}</pre>
            </blockquote>
          </s>
        )
      ).toBe('&gt; ~strikethrough and~\n&gt; ```\nquoted\ntext\n```\n&gt; '))

    it('renders HTML special characters correctly', () =>
      expect(mrkdwn(<pre>{'<abbr title="and">&</abbr>'}</pre>)).toBe(
        '```\n&lt;abbr title="and"&gt;&amp;&lt;/abbr&gt;\n```'
      ))

    it('allows containing link', () => {
      expect(
        mrkdwn(
          <pre>
            <a href="https://example.com/">example</a>
          </pre>
        )
      ).toBe('```\n<https://example.com/|example>\n```')

      // with format
      expect(
        mrkdwn(
          <pre>
            <a href="https://example.com/">
              <b>Bold</b> link
            </a>
            <br />
            {'and plain\ntext'}
          </pre>
        )
      ).toBe('```\n<https://example.com/|*Bold* link>\nand plain\ntext\n```')
    })
  })

  describe('List', () => {
    it('converts unordered list to mimicked text', () => {
      expect(
        mrkdwn(
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
        mrkdwn(
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
        mrkdwn(
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
        mrkdwn(
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
      ).toBe('1. Ordered\n   list\n2. Well\n   \n   aligned')
    })

    it('allows setting start number via start attribute in ordered list', () => {
      expect(
        mrkdwn(
          <ol start={9}>
            <li>Change</li>
            <li>
              Start
              <br />
              number
            </li>
          </ol>
        )
      ).toBe('\u20079. Change\n10. Start\n    number')

      // Coerce to integer
      expect(
        mrkdwn(
          <ol start={3.5}>
            <li>test</li>
          </ol>
        )
      ).toBe(
        mrkdwn(
          <ol start={3}>
            <li>test</li>
          </ol>
        )
      )
    })

    it('renders ordered number with lowercase latin alphabet when type attribute is "a"', () =>
      expect(
        mrkdwn(
          <ol type={'a'} start={-1}>
            <li>-1</li>
            <li>0</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ol>
        )
      ).toBe('-1. -1\n 0. 0\n  a. 1\n b. 2\n  c. 3'))

    it('renders ordered number with uppercase latin alphabet when type attribute is "A"', () => {
      expect(
        mrkdwn(
          <ol type={'A'} start={25}>
            <li>25</li>
            <li>26</li>
            <li>27</li>
          </ol>
        )
      ).toBe('  Y. 25\n Z. 26\nAA. 27')

      expect(
        mrkdwn(
          <ol type={'A'} start={700}>
            <li>700</li>
            <li>701</li>
            <li>702</li>
            <li>703</li>
            <li>704</li>
          </ol>
        )
      ).toBe(' ZX. 700\n ZY. 701\n  ZZ. 702\nAAA. 703\nAAB. 704')
    })

    it('renders ordered number with lowercase roman numeric when type attribute is "i"', () =>
      expect(
        mrkdwn(
          <ol type={'i'} start={-1}>
            {[...Array(12)].map((_, i) => (
              <li>{i - 1}</li>
            ))}
          </ol>
        )
      ).toBe(
        ' -1. -1\n  0. 0\n  i. 1\n ii. 2\n iii. 3\n  iv. 4\n  v. 5\n  vi. 6\n vii. 7\nviii. 8\n  ix. 9\n  x. 10'
      ))

    it('renders ordered number with uppercase roman numeric when type attribute is "I"', () => {
      expect(
        mrkdwn(
          <ol type={'I'} start={45}>
            {[...Array(10)].map((_, i) => (
              <li>{i + 45}</li>
            ))}
          </ol>
        )
      ).toBe(
        '  XLV. 45\n XLVI. 46\n XLVII. 47\nXLVIII. 48\n XLIX. 49\n    L. 50\n   LI. 51\n   LII. 52\n   LIII. 53\n   LIV. 54'
      )

      expect(
        mrkdwn(
          <ol type={'I'} start={3991}>
            {[...Array(10)].map((_, i) => (
              <li>{i + 3991}</li>
            ))}
          </ol>
        )
      ).toBe(
        '   MMMCMXCI. 3991\n  MMMCMXCII. 3992\n  MMMCMXCIII. 3993\n MMMCMXCIV. 3994\n  MMMCMXCV. 3995\n MMMCMXCVI. 3996\n MMMCMXCVII. 3997\nMMMCMXCVIII. 3998\n MMMCMXCIX. 3999\n        4000. 4000'
      )
    })

    it('changes ordered number in the middle of list through value prop', () =>
      expect(
        mrkdwn(
          <ol>
            <li>1</li>
            <li>2</li>
            <li value={100}>100</li>
            <li>101</li>
            <li>102</li>
          </ol>
        )
      ).toBe('   1. 1\n   2. 2\n100. 100\n101. 101\n102. 102'))

    it('allows sub list', () => {
      expect(
        mrkdwn(
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
        '• test\n  ◦ sub-list with direct nesting\n• ◦ sub-list\n  ◦ and\n     ▪︎ sub-sub-list'
      )
    })

    it('allows sub ordered list', () => {
      expect(
        mrkdwn(
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
        '2. test\n   1. sub-list with direct nesting\n3. 1. sub-list\n   2. and\n      ▪︎ sub-sub-list'
      )
    })

    it('does not allow unsupported block components', () => {
      expect(
        mrkdwn(
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
      expect(mrkdwn(<a href="https://example.com/">Example</a>)).toBe(
        '<https://example.com/|Example>'
      )
      expect(mrkdwn(<a href="mailto:mail@example.com">E-mail</a>)).toBe(
        '<mailto:mail@example.com|E-mail>'
      )
    })

    it('allows using elements inside <a> tag', () => {
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <i>with</i> <b>text</b> <s>formatting</s>
          </a>
        )
      ).toBe('<https://example.com/|_with_ *text* ~formatting~>')

      expect(
        mrkdwn(
          <a href="https://example.com/">
            <pre>{'Link\npre-formatted\ntext'}</pre>
          </a>
        )
      ).toBe('<https://example.com/|```Link pre-formatted text```>')

      // Apply link to the content if wrapped in block element
      expect(
        mrkdwn(
          <a href="https://example.com/">
            <blockquote>
              Link blockquote
              <br />
              (Single line only)
            </blockquote>
          </a>
        )
      ).toBe(
        '&gt; <https://example.com/|Link blockquote (Single line only)>\n&gt; '
      )
    })

    it('does not allow multiline contents to prevent breaking link', () =>
      expect(
        mrkdwn(
          <a href="https://example.com/">
            Ignore
            <br />
            multiline
          </a>
        )
      ).toBe('<https://example.com/|Ignore multiline>'))

    it('is distributed to each content if wrapped in block elements', () =>
      expect(
        mrkdwn(
          <a href="https://example.com/">
            text
            <p>paragraph</p>
            <blockquote>blockquote</blockquote>
          </a>
        )
      ).toBe(
        '<https://example.com/|text>\n\n<https://example.com/|paragraph>\n\n&gt; <https://example.com/|blockquote>\n&gt; '
      ))

    it('escapes chars in URL by percent encoding', () =>
      expect(
        mrkdwn(<a href='https://example.com/?regex="<(i|em)>"'>escape test</a>)
      ).toBe('<https://example.com/?regex=%22%3C(i%7Cem)%3E%22|escape test>'))

    it('uses short syntax if the content and URL are exactly same', () => {
      expect(
        mrkdwn(<a href="https://example.com/">https://example.com/</a>)
      ).toBe('<https://example.com/>')

      const complexURL = `https://example.com/?regex='<b>'&fwc="＊"`

      expect(mrkdwn(<a href={complexURL}>{complexURL}</a>)).toBe(
        `<https://example.com/?regex='&lt;b&gt;'&amp;fwc="＊">`
      )
    })

    it('does not use short syntax even though having the same content if URL has included pipe', () =>
      expect(
        mrkdwn(
          <a href="https://example.com/?q=a|b|c">
            https://example.com/?q=a|b|c
          </a>
        )
      ).toBe('<https://example.com/?q=a%7Cb%7Cc|https://example.com/?q=a|b|c>'))

    it('renders as plain text if href is empty', () =>
      expect(mrkdwn(<a href="">empty</a>)).toBe('empty'))

    it('converts to channel link when referenced public channel ID', () => {
      expect(mrkdwn(<a href="#C0123ABCD" />)).toBe('<#C0123ABCD>')
      expect(mrkdwn(<a href="#CLONGERCHANNELID" />)).toBe('<#CLONGERCHANNELID>')
      expect(mrkdwn(<a href="#CWXYZ9876">Ignore contents</a>)).toBe(
        '<#CWXYZ9876>'
      )
      expect(
        mrkdwn(
          <b>
            <a href="#C0123ABCD" />
          </b>
        )
      ).toBe('*<#C0123ABCD>*')
    })

    it('converts to user mention when referenced user ID', () => {
      expect(mrkdwn(<a href="@U0123ABCD" />)).toBe('<@U0123ABCD>')
      expect(mrkdwn(<a href="@ULONGERUSERID" />)).toBe('<@ULONGERUSERID>')
      expect(mrkdwn(<a href="@WGLOBALID" />)).toBe('<@WGLOBALID>')
      expect(mrkdwn(<a href="@UWXYZ9876">Ignore contents</a>)).toBe(
        '<@UWXYZ9876>'
      )
      expect(
        mrkdwn(
          <i>
            <a href="@U0123ABCD" />
          </i>
        )
      ).toBe('_<@U0123ABCD>_')
    })

    it('converts to user group mention when referenced subteam ID', () => {
      expect(mrkdwn(<a href="@S0123ABCD" />)).toBe('<!subteam^S0123ABCD>')
      expect(mrkdwn(<a href="@SLONGERSUBTEAMID" />)).toBe(
        '<!subteam^SLONGERSUBTEAMID>'
      )
      expect(mrkdwn(<a href="@SWXYZ9876">Ignore contents</a>)).toBe(
        '<!subteam^SWXYZ9876>'
      )
      expect(
        mrkdwn(
          <s>
            <a href="@S0123ABCD" />
          </s>
        )
      ).toBe('~<!subteam^S0123ABCD>~')
    })

    it('converts special mentions', () => {
      expect(mrkdwn(<a href="@here" />)).toBe('<!here|here>')
      expect(mrkdwn(<a href="@channel" />)).toBe('<!channel|channel>')
      expect(mrkdwn(<a href="@everyone" />)).toBe('<!everyone|everyone>')
      expect(mrkdwn(<a href="@here">Ignore contents</a>)).toBe('<!here|here>')
      expect(
        mrkdwn(
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
        mrkdwn(
          <time dateTime="1552212000" fallback="fallback">
            {'{date_num}'}
          </time>
        )
      ).toBe('<!date^1552212000^{date_num}|fallback>')
    })

    it('has aliased datetime prop into camelCase prop', () => {
      expect(
        mrkdwn(
          // eslint-disable-next-line react/no-unknown-property
          <time datetime={1552212000} fallback="fallback">
            {'{date_num}'}
          </time>
        )
      ).toBe('<!date^1552212000^{date_num}|fallback>')

      // Prefers to camelCase
      expect(
        mrkdwn(
          <time
            dateTime={'1234567890'}
            datetime={1552212000} // eslint-disable-line react/no-unknown-property
            fallback="fallback"
          >
            {'{date_num}'}
          </time>
        )
      ).toBe('<!date^1234567890^{date_num}|fallback>')
    })

    it('generates UTC fallback text from content if fallback attr is not defined', () => {
      // 1552212000 => 2019-03-10 10:00:00 UTC (= 02:00 PST = 03:00 PDT)
      expect(mrkdwn(<time dateTime={1552212000}>{'{date_num}'}</time>)).toBe(
        '<!date^1552212000^{date_num}|2019-03-10>'
      )

      expect(mrkdwn(<time dateTime={1552212000}>{'{date}'}</time>)).toBe(
        '<!date^1552212000^{date}|March 10th, 2019>'
      )

      expect(mrkdwn(<time dateTime={1552212000}>{'{date_short}'}</time>)).toBe(
        '<!date^1552212000^{date_short}|Mar 10, 2019>'
      )

      expect(mrkdwn(<time dateTime={1552212000}>{'{date_long}'}</time>)).toBe(
        '<!date^1552212000^{date_long}|Sunday, March 10th, 2019>'
      )

      expect(mrkdwn(<time dateTime={1552212000}>{'{time}'}</time>)).toBe(
        '<!date^1552212000^{time}|10:00 AM>'
      )

      expect(mrkdwn(<time dateTime={1552212000}>{'{time_secs}'}</time>)).toBe(
        '<!date^1552212000^{time_secs}|10:00:00 AM>'
      )

      // HTML entities
      expect(
        mrkdwn(<time dateTime={1552212000}>&lt;{'{date_num}'}&gt;</time>)
      ).toBe('<!date^1552212000^&lt;{date_num}&gt;|&lt;2019-03-10&gt;>')

      expect(
        mrkdwn(<time dateTime={1552212000}>&#123;date_num&#125; &hearts;</time>)
      ).toBe('<!date^1552212000^{date_num} \u2665|2019-03-10 \u2665>')
    })

    test.each`
      dateTime     | format                      | contain
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
      ({ dateTime, format, contain }) => {
        expect(mrkdwn(<time dateTime={dateTime}>{format}</time>)).toContain(
          `|${contain}>`
        )
      }
    )

    it('ignores any elements in children', () => {
      const date = new Date(Date.UTC(2019, 2, 10, 10, 0, 0))

      expect(
        mrkdwn(
          <time dateTime={date} fallback="fallback">
            <i>with</i> <b>text</b> <s>formatting</s>
          </time>
        )
      ).toBe('<!date^1552212000^with text formatting|fallback>')

      expect(
        mrkdwn(
          <time dateTime={date} fallback="fallback">
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
        mrkdwn(
          <time dateTime={date} fallback="fallback">
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
        mrkdwn(
          <a href="https://example.com/">
            <time dateTime={1552212000} fallback="2019-03-10">
              {'{date_num}'}
            </time>
          </a>
        )
      ).toBe('<!date^1552212000^{date_num}^https://example.com/|2019-03-10>')
    })

    it('escapes brackets in contents and fallback', () => {
      // NOTE: We have to escape brackets but Slack won't decode entities in fallback.
      expect(
        mrkdwn(
          <time dateTime={1552212000} fallback="<2019-03-10>">
            {'<{date_num}>'}
          </time>
        )
      ).toBe('<!date^1552212000^&lt;{date_num}&gt;|&lt;2019-03-10&gt;>')
    })

    it('escapes divider in contents and fallback', () => {
      expect(
        mrkdwn(
          <time dateTime={1552212000} fallback="by XXX | 2019-03-10">
            by XXX | {'{date_num}'}
          </time>
        )
      ).toBe(
        '<!date^1552212000^by XXX \u01c0 {date_num}|by XXX \u01c0 2019-03-10>'
      )
    })
  })
})
