# jsx-slack

Build JSON objects for [Slack] API from readable [JSX].

[slack]: https://slack.com
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[block kit]: https://api.slack.com/block-kit
[block kit builder]: https://api.slack.com/tools/block-kit-builder

### Supports

- **[Block Kit as component](#block-kit-as-component)** - Building your blocks as component.
- **[HTML-like formatting](#html-like-formatting)** - Keep a readability by using well-known elements.

## Motivation

When developing Slack-integrated app, continuous maintenance of the rich contents is a difficult task. A team member must read and write JSON with deep knowledge about Slack API.

Slack has shipped [Block Kit] and [Block Kit Builder], and efforts to develop app easily. And I believe JSX-based template would enhance a developer experience of Slack app to the next stage.

## Project goal

A project goal is creating an interface to build a maintainable Slack message with confidence via readable [JSX].

jsx-slack would allow building message blocks by JSX with predictable markup. It helps in understanding the structure of the complex message.

## Block Kit as component

> :warning: This section is currently draft.

_[Work in progress]_

## HTML-like formatting

> :warning: This section is currently draft.

Slack can format message by very rational short syntaxes called `mrkdwn`. On the other hand, someone might yearn for a template engine with clear tag definition like HTML, especially when building a complex message.

jsx-slack has HTML-compatible JSX elements to format messages. It might be verbose as a text, but would give readablity by well-known HTML elements, and allows autocomplete via TypeScript type definition.

_You may also use a regular mrkdwn syntax via the attribute defined in block if these are unnecessary._

### Format text style

- `<i>`, `<em>`: _Italic text_
- `<b>`, `<strong>`: **Bold text**
- `<s>`, `<del>`: ~~Strikethrough text~~

### Line breaks

As same as HTML, line breaks will be ignored even if you have multi-line text, and replace to a single whitespace. You shoud use `<br />` tag to break line inside text. A exception is the pre-formatted text inside `<pre>` tag.

### HTML block contents

- `<p>` tag just makes a blank line around contents. Slack would render it as like as paragraph.
- `<blockquote>` adds `>` character to the first of each lines for highlighting as quote.
- `<pre>` tag will recognize the content as formatted-text, and wrapped content by ` ``` ` It would not ignore line break in the content.

#### Unordered list simulation

We can simulate unordered list provided from `<ul>` tag by using mimicked text.

```html
<ul>
  <li>List A</li>
  <li>List B</li>
  <li>List C</li>
</ul>
```

The above would be replaced to just a plain text like this:

```
• List A
• List B
• List C
```

### Links

jsx-slack will not recognize URL-like as hyperlink. You should use `<a href="">` if you want using a link.

For example, `<a href="https://example.com/">Link</a>` will be converted to `<https://example.com/|Link>`, and rendered as like as "[Link](https://example.com)".

#### To Slack channel

`<a href="#C024BE7LR" />` means a link to Slack channel. You have to set **_PUBLIC_ channel's ID, not channel name,** as an anchor. [Refer details to documentation by Slack](https://api.slack.com/messaging/composing/formatting#linking-channels) for more details.

Unlike HTML specification, jsx-slack only allows `<a />` tag without contents. _You cannot use a custom content because Slack would fill the name of specified channel automatically._

#### Mention to user and user group

As like as channel link, `<a href="@U024BE7LH" />` means a mention to specified user.

jsx-slack can mention to user groups with a same syntax `<a href="@SAZ94GDB8" />` by detecting user group ID prefixed `S`.

Of course, we also support special mentions like `@here`, `@channel`, and `@everyone`.

### Date formatting

[Slack supports date formatting for localization by timezone.](https://api.slack.com/messaging/composing/formatting#date-formatting) jsx-slack also support it by HTML5 `<time>` tag.

```jsx
<time datetime="1392734382">{'Posted {date_num} {time_secs}'}</time>
// => "<!date^1392734382^Posted {date_num} {time_secs}>"

<time datetime="1392734382">{'{date} at {time}'}</time>
// => "<!date^1392734382^Posted {date_num} {time_secs}>"

<a href="https://example.com/">
  <time datetime="1392734382" fallback="Feb 18, 2014 PST">
    {'{date_short}'}
  </time>
</a>
// => "<!date^1392734382^{date_short}^https://example.com/>"
```

An optional fallback text may specify via additional `fallback` attribute.

### Correspondence table

#### Basics

|            jsx-slack             |     Slack mrkdwn      |
| :------------------------------: | :-------------------: |
|         `<i>Italic</i>`          |      `_Italic_`       |
|        `<em>Italic</em>`         |      `_Italic_`       |
|          `<b>Bold</b>`           |       `*Bold*`        |
|     `<strong>Bold</strong>`      |       `*Bold*`        |
|         `<s>Strike</s>`          |      `~Strike~`       |
|       `<del>Strike</del>`        |      `~Strike~`       |
|        `Line<br />break`         |     `Line\nbreak`     |
|      `<p>foo</p><p>bar</p>`      |     `foo\n\nbar`      |
| `<blockquote>quote</blockquote>` |       `>quote`        |
|       `<code>code</code>`        |     `` `code` ``      |
|     `<pre>code\nblock</pre>`     | ` ```code\nblock``` ` |
|     `<ul><li>List</li></ul>`     |       `• List`        |

#### Links

|                  jsx-slack                   |           Slack mrkdwn            |
| :------------------------------------------: | :-------------------------------: |
|  `<a href="https://example.com/">Link</a>`   |   `<https://example.com/|Link>`   |
| `<a href="mailto:mail@example.com">Mail</a>` | `<mailto:mail@example.com/|Mail>` |
|          `<a href="#C024BE7LR" />`           |          `<!#C024BE7LR>`          |
|          `<a href="@U024BE7LH" />`           |          `<!@U024BE7LH>`          |
|          `<a href="@SAZ94GDB8" />`           |      `<!subteam^SAZ94GDB8>`       |
|             `<a href="@here" />`             |          `<!here|here>`           |
|           `<a href="@channel" />`            |       `<!channel|channel>`        |
|           `<a href="@everyone" />`           |      `<!everyone|everyone>`       |

## Similar projects

- [slack-jsx](https://github.com/zcei/slack-jsx) - Compose Slack messages from JSX Components instead of writing JSON. (INACTIVE)

## Licnese

[MIT License](LICENSE)
