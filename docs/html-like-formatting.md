###### [Top](../README.md) &raquo; HTML-like formatting

# HTML-like formatting

Slack can format message by very rational short syntaxes called [mrkdwn]. On the other hand, someone might yearn for a template engine with clear tag definition like HTML, especially when building a complex message.

jsx-slack has HTML-compatible JSX elements to format messages. It might be verbose as a text, but would give readablity by well-known HTML elements.

_Using HTML elements is not mandatory. You may also use [a regular mrkdwn syntax][mrkdwn] to format if necessary._

[mrkdwn]: https://api.slack.com/docs/message-formatting

## Format text style

- `<i>`, `<em>`: _Italic text_
- `<b>`, `<strong>`: **Bold text**
- `<s>`, `<strike>`, `<del>`: ~~Strikethrough text~~
- `<code>`: `Inline code`

## Line breaks

As same as HTML, line breaks in JSX will be ignored, and replace to a single whitespace. You shoud use `<br />` tag in this case.

## HTML block contents

- `<p>` tag just makes a blank line around contents. Slack would render it as like as paragraph.
- `<blockquote>` adds `>` character to the first of each lines for highlighting as quote.
- `<pre>` tag will recognize the content as formatted-text, and wrapped content by ` ``` ` .

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
      <li>Ordered item 2</li>
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
```

## Links

jsx-slack will not recognize URL-like string as hyperlink. You should use `<a href="">` whenever you want to use a link.

For example, `<a href="https://example.com/">Link</a>` will be converted to `<https://example.com/|Link>`, and rendered as like as "[Link](https://example.com)".

### To Slack channel

`<a href="#C024BE7LR" />` means a link to Slack channel. You have to set **_PUBLIC_ channel's ID, not channel name,** as an anchor. [Refer details to documentation by Slack](https://api.slack.com/messaging/composing/formatting#linking-channels) for more details.

If defined what except URL as `href` attribute, _you cannot use a custom content because Slack would fill the content automatically._ Unlike HTML specification, `<a>` tag allows to use as void element `<a />`.

### Mention to user and user group

As like as channel link, `<a href="@U024BE7LH" />` (and `<a href="@W41S032FC" />` for [Enterprise Grid](https://api.slack.com/enterprise-grid#user_ids)) means a mention to specified user.

jsx-slack can mention to user groups with a same syntax `<a href="@SAZ94GDB8" />` by detecting user group ID prefixed `S`.

Of course, we also support special mentions like `@here`, `@channel`, and `@everyone`.

## Date formatting

[Slack supports date formatting for localization by timezone.](https://api.slack.com/messaging/composing/formatting#date-formatting) jsx-slack also supports it by HTML5 `<time>` tag.

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

### Links

|                  jsx-slack                   |            Slack mrkdwn            |
| :------------------------------------------: | :--------------------------------: |
|  `<a href="https://example.com/">Link</a>`   |   `<https://example.com/\|Link>`   |
| `<a href="mailto:mail@example.com">Mail</a>` | `<mailto:mail@example.com/\|Mail>` |
|          `<a href="#C024BE7LR" />`           |           `<#C024BE7LR>`           |
|          `<a href="@U024BE7LH" />`           |           `<@U024BE7LH>`           |
|          `<a href="@SAZ94GDB8" />`           |       `<!subteam^SAZ94GDB8>`       |
|             `<a href="@here" />`             |          `<!here\|here>`           |
|           `<a href="@channel" />`            |       `<!channel\|channel>`        |
|           `<a href="@everyone" />`           |      `<!everyone\|everyone>`       |

---

###### [Top](../README.md) &raquo; HTML-like formatting
