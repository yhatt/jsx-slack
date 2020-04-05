###### [Top](../README.md) &raquo; HTML-like formatting

# HTML-like formatting

Slack can format message by very rational short syntaxes called [mrkdwn]. On the other hand, someone might yearn for a template engine with clear tag definition like HTML, especially when building a complex message.

jsx-slack has HTML-compatible JSX elements to format messages. It might be verbose as a text, but would give readablity by well-known HTML elements.

## Basic text formatting

_Using these HTML elements is not mandatory. You may also use [the regular mrkdwn syntax][mrkdwn] to format if necessary_: `_italic_`, `*bold*`, `~strike~`, `` `code` ``, `> quote`, and ` ```code block``` `.

If you want to prevent parsing special characters for regular mrkdwn, we recommend to consider using [`<Escape>` component](about-escape-and-exact-mode.md#special-characters).

[mrkdwn]: https://api.slack.com/reference/surfaces/formatting

### Styling

- `<i>`, `<em>`: _Italic text_
- `<b>`, `<strong>`: **Bold text**
- `<s>`, `<strike>`, `<del>`: ~~Strikethrough text~~
- `<code>`: `Inline code`

### Block contents

- `<blockquote>`: Block quotation
  - Adds `>` character to the first of each lines for highlighting as quote.

* `<pre>`: Pre-formatted text
  - Marks the content as formatted-text by wrapping content in ` ``` ` .

## Line breaks and paragraph

As same as HTML, line breaks in JSX will be ignored, and replace to a single whitespace. You should always use `<br />` tag.

jsx-slack also can use `<p>` tag. It just makes a blank line around contents. Slack would render it as like as paragraph.

## List simulation

We can simulate the list provided from `<ul>` and `<ol>` tag by using mimicked text.

```html
<ul>
  <li>Item A</li>
  <li>
    Item B
    <ul>
      <li>Sub item 1</li>
      <li>
        Sub item 2
        <ul>
          <li>and more...</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    Item C
    <ol>
      <li>Ordered item 1</li>
      <li>
        Ordered item 2
        <ol type="I">
          <li>Ordered sub item with type 1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5...</li>
        </ol>
      </li>
    </ol>
  </li>
</ul>
```

The above would be replaced to just a plain text like this:

```
• Item A
• Item B
  ◦ Sub item 1
  ◦ Sub item 2
     ▪︎ and more...
• Item C
  1. Ordered item 1
  2. Ordered item 2
       I. Ordered sub item with type
       II. 2
      III. 3
     IV. 4
      V. 5...
```

Indents, look like lumpy in a monospace font, will be aligned pretty when rendering to Slack.

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%E2%80%A2%20Item%20A%5Cn%E2%80%A2%20Item%20B%5Cn%E2%80%87%20%E2%97%A6%20Sub%20item%201%5Cn%E2%80%87%20%E2%97%A6%20Sub%20item%202%5Cn%E2%80%87%20%E2%80%84%E2%80%8A%20%E2%96%AA%EF%B8%8E%20and%20more...%5Cn%E2%80%A2%20Item%20C%5Cn%E2%80%87%201.%20Ordered%20item%201%5Cn%E2%80%87%202.%20Ordered%20item%202%5Cn%E2%80%87%20%E2%80%83%E2%80%8A%20%E2%80%87%E2%80%8AI.%20Ordered%20sub%20item%20with%20type%5Cn%E2%80%87%20%E2%80%83%E2%80%8A%20%E2%80%84%E2%80%8AII.%202%5Cn%E2%80%87%20%E2%80%83%E2%80%8A%20%E2%80%8AIII.%203%5Cn%E2%80%87%20%E2%80%83%E2%80%8A%20IV.%204%5Cn%E2%80%87%20%E2%80%83%E2%80%8A%20%E2%80%85V.%205...%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

As same as HTML, `<ol>` tag supports [`start` and `type` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol#Attributes) and `<li>` tag supports [`value` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#Attributes).

## Links

jsx-slack will not recognize URL-like string as hyperlink unless using [`<Mrkdwn verbatim={false}>`](block-elements.md#mrkdwn). Generally you should use `<a>` tag whenever you want to use a link.

For example, `<a href="https://example.com/">Link</a>` will be converted to `<https://example.com/|Link>`.

### To Slack channel

`<a href="#C01234ABCDE" />` means a link to Slack channel. You have to set **_PUBLIC_ channel's ID that is always starting `C`, not channel name,** as an anchor. [Refer details to documentation by Slack](https://api.slack.com/messaging/composing/formatting#linking-channels) for more details.

If defined what except URL as `href` attribute, _you cannot use a custom content because Slack would fill the content automatically._ Unlike HTML specification, `<a>` tag allows to use as void element `<a />`.

### Mention to user and user group

As like as channel link, `<a href="@U56789FGHIJ" />` (and `<a href="@W01234KLMNO" />` for [Enterprise Grid](https://api.slack.com/enterprise-grid#user_ids)) means a mention to specified user.

jsx-slack can mention to user groups with a same syntax `<a href="@S56789PQRST" />` by detecting user group ID prefixed `S`.

Of course, we also support special mentions like `@here`, `@channel`, and `@everyone`.

## Date formatting

[Slack supports date formatting for localization by timezone](https://api.slack.com/messaging/composing/formatting#date-formatting), and jsx-slack can use it through HTML5 `<time>` tag.

```jsx
<time datetime="1392734382">{'Posted {date_num} {time_secs}'}</time>
// => "<!date^1392734382^Posted {date_num} {time_secs}|Posted 2014-02-18 14:39:42 PM>"

<time datetime="1392734382">{'{date} at {time}'}</time>
// => "<!date^1392734382^{date} at {time}|February 18th, 2014 at 14:39 PM>"

<a href="https://example.com/">
  <time datetime="1392734382" fallback="Feb 18, 2014 PST">
    {'{date_short}'}
  </time>
</a>
// => "<!date^1392734382^{date_short}^https://example.com/|Feb 18, 2014 PST>"
```

An optional fallback text may specify via additional `fallback` attribute. If it is not defined, jsx-slack will generate the fallback text in UTC from template string.

## Correspondence table

### Basics

|            jsx-slack             |       Slack mrkdwn        |
| :------------------------------: | :-----------------------: |
|         `<i>Italic</i>`          |        `_Italic_`         |
|        `<em>Italic</em>`         |        `_Italic_`         |
|          `<b>Bold</b>`           |         `*Bold*`          |
|     `<strong>Bold</strong>`      |         `*Bold*`          |
|         `<s>Strike</s>`          |        `~Strike~`         |
|       `<del>Strike</del>`        |        `~Strike~`         |
|        `Line<br />break`         |       `Line\nbreak`       |
|      `<p>foo</p><p>bar</p>`      |       `foo\n\nbar`        |
| `<blockquote>quote</blockquote>` |       `&gt; quote`        |
|       `<code>code</code>`        |       `` `code` ``        |
|   `<pre>{'code\nblock'}</pre>`   | ` ```\ncode\nblock\n``` ` |
|     `<ul><li>List</li></ul>`     |         `• List`          |
|   `<ol><li>Ordered</li></ol>`    |       `1. Ordered`        |

### Links

|                       jsx-slack                       |           Slack mrkdwn            |
| :---------------------------------------------------: | :-------------------------------: |
|       `<a href="https://example.com/">Link</a>`       |   `<https://example.com/|Link>`   |
| `<a href="https://slack.com/">https://slack.com/</a>` |      `<https://slack.com/>`       |
|     `<a href="mailto:mail@example.com">Mail</a>`      | `<mailto:mail@example.com/|Mail>` |
|              `<a href="#C01234ABCDE" />`              |         `<#C01234ABCDE>`          |
|              `<a href="@U56789FGHIJ" />`              |         `<@U56789FGHIJ>`          |
|              `<a href="@SK1L2M3N4O5" />`              |     `<!subteam^SK1L2M3N4O5>`      |
|                 `<a href="@here" />`                  |          `<!here|here>`           |
|                `<a href="@channel" />`                |       `<!channel|channel>`        |
|               `<a href="@everyone" />`                |      `<!everyone|everyone>`       |

---

###### [Top](../README.md) &raquo; HTML-like formatting
