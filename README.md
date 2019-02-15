# jsx-slack

Build JSON objects for Slack API from readable [JSX].

### Supports

- **[Block Kit as component](#block-kit-as-component)** - Building your blocks as component.
- **[HTML-like formatting](#html-like-formatting)** - Keep a readability by using well-known elements.

## Motivation

When developing Slack-integrated app, continuous maintenance of the rich contents is a difficult task. A team member must read and write JSON with deep knowledge about Slack API.

Slack has shipped [Block Kit] and [Block Kit Builder], and efforts to develop app easily. And I believe JSX-based template would enhance a developer experience of Slack app to the next stage.

## Project goal

A project goal is creating an interface to build a maintainable Slack message with confidence via readable [JSX].

jsx-slack would allow building message blocks by JSX with predictable markup. It helps in understanding the structure of the complex message.

[slack]: https://slack.com
[block kit]: https://api.slack.com/block-kit
[block kit builder]: https://api.slack.com/tools/block-kit-builder
[jsx]: https://reactjs.org/docs/introducing-jsx.html

## Block Kit component

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

`<a href="#C024BE7LR">#channel</a>` means a link to Slack channel. You have to set **_PUBLIC_ channel's ID, not channel name,** as an anchor. [Refer details to documentation by Slack](https://api.slack.com/messaging/composing/formatting#linking-channels) for more details.

> :warning: To indiciate a link to channel, **Slack will always prepend `#` mark to the content of links.** e.g. `<a href="#C0123ABCD">foobar</a>` would be rendered as like as [#foobar](#C0123ABCD), NOT [foobar](#C0123ABCD).

Unlike HTML specification, jsx-slack allows `<a href="#CC024BE7LR" />` tag with blank content. Slack can be filled the name of specified channel automatically, so typically it is more useful than including text content.

#### User mention

_[Work in progress]_

##### Special mentions

Link to `@here`, `@channel`, and `@everyone` are special mentions. These allow only void element like `<a href="@here" />`.

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

> :information_source: The optional fallback text may specify via additional `fallback` attribute.

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

## Licnese

[MIT License](LICENSE)
