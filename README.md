# jsx-slack

Build JSON objects for [Slack] API from readable [JSX].

### :warning: This project is in development and cannot use currently.

[slack]: https://slack.com
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[block kit]: https://api.slack.com/block-kit
[block kit builder]: https://api.slack.com/tools/block-kit-builder

### Supports

- **[Block Kit as component](#block-kit-as-component)** - Building your blocks as component.
- **[HTML-like formatting](#html-like-formatting)** - Keep a readability by using well-known elements.

## Motivation

When developing Slack-integrated app, continuous maintenance of the rich contents is a difficult task. A team member must read and write JSON with deep knowledge about a specification of Slack messaging.

Slack has shipped [Block Kit] and [Block Kit Builder], and efforts to develop app easily. We believe JSX-based template would enhance a developer experience of Slack app to the next stage.

## Project goal

A project goal is creating an interface to build a maintainable Slack message with confidence via readable [JSX].

jsx-slack would allow building message blocks with predictable HTML-like markup. It helps in understanding the structure of the complex message.

## Block Kit as component

Slack has recommended to use **[Block Kit]** for building tempting message, and jsx-slack can pile up blocks by JSX. It is feeling like using components in React or Vue.

### Usage

At first, you have to setting JSX to use imported our parser `JSXSlack.h`. Typically, we recommend to use pragma comment `/* @jsx JSXSlack.h */`.

This is a simple block example `example.jsx` just to say hello to someone. Wrap JSX by `JSXSlack()` function.

```jsx
/** @jsx JSXSlack.h */
import JSXSlack, { Block, Section } from '@speee/jsx-slack'

export default function exampleBlock({ name }) {
  return JSXSlack(
    <Block>
      <Section>
        Hello, <b>{name}</b>!
      </Section>
    </Block>
  )
}
```

A prgama would work in Babel ([@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx)) and [TypeScript >= 2.8 with `--jsx react`](https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions).

After than, just use created template in Slack API. We are using the official Node SDK [`@slack/client`](https://github.com/slackapi/node-slack-sdk) in this example. [See also Slack guide.](https://slackapi.github.io/node-slack-sdk/web_api)

```javascript
import { WebClient } from '@slack/client'
import exampleBlock from './example'

const web = new WebClient(process.env.SLACK_TOKEN)

web.chat
  .postMessage({
    channel: 'C1232456',
    blocks: exampleBlock({ name: 'Yuki Hattori' }),
  })
  .then(res => console.log('Message sent: ', res.ts))
  .catch(console.error)
```

It would post a simple Slack message like this:

[<img src="slack-example.png" width="193" />][block-kit-builder-example]

[<img src="https://slack.com/favicon.ico" alt="Slack" width="24" height="24" valign="bottom" /> Preview in Block Kit Builder][block-kit-builder-example]

[block-kit-builder-example]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Hello%2C%20*Yuki%20Hattori*!%22%7D%7D%5D

Of course, you can also use inline JSX.

```jsx
import JSXSlack, { Block, Section } from '@speee/jsx-slack'

const name = 'Yuki Hattori'

web.chat.postMessage({
  channel: 'C1232456',
  blocks: JSXSlack(
    <Block>
      <Section>
        Hello, <b>{name}</b>!
      </Section>
    </Block>
  ),
})
```

## JSX component

### Blocks

#### `<Block>`

A container component to use Block Kit. You should wrap Block Kit elements by `<Block>`.

#### [`<Section>`: Section Block](https://api.slack.com/reference/messaging/blocks#section)

Display a simple text message. You have to specify the content as children. It allows [formatting with HTML-like elements](#html-like-formatting).

```jsx
<Block>
  <Section>Hello, world!</Section>
</Block>
```

[<img src="https://slack.com/favicon.ico" alt="Slack" width="24" height="24" valign="bottom" /> Preview in Block Kit Builder](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Hello%2C%20world!%22%7D%7D%5D)

##### Props

- `blockId` (optional): A string of unique identifier of block.

#### [`<Divider>`: Divider Block](https://api.slack.com/reference/messaging/blocks#divider)

Just a divider.

```jsx
<Block>
  <Divider />
</Block>
```

[<img src="https://slack.com/favicon.ico" alt="Slack" width="24" height="24" valign="bottom" /> Preview in Block Kit Builder](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22divider%22%7D%5D)

##### Props

- `blockId` (optional): A string of unique identifier of block.

#### [`<Image>`: Image Block](https://api.slack.com/reference/messaging/blocks#image)

Display an image block. It has well-known props like `<img>` HTML element.

```jsx
<Block>
  <Image src="http://placekitten.com/500/500" alt="So cute kitten." />
</Block>
```

[<img src="https://slack.com/favicon.ico" alt="Slack" width="24" height="24" valign="bottom" /> Preview in Block Kit Builder](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22So%20cute%20kitten.%22%2C%22image_url%22%3A%22http%3A%2F%2Fplacekitten.com%2F500%2F500%22%7D%5D)

##### Props

- `src` (**required**): The URL of the image.
- `alt` (**required**): A plain-text summary of the image.
- `title` (optional): An optional title for the image.
- `blockId` (optional): A string of unique identifier of block.

#### [`<Actions>`: Actions Block](https://api.slack.com/reference/messaging/blocks#actions)

> :warning: under construction.

#### [`<Context>`: Context Block](https://api.slack.com/reference/messaging/blocks#context)

> :warning: under construction.

## HTML-like formatting

> :warning: This is a draft of specification. Current implementation might not fill these spec.

Slack can format message by very rational short syntaxes called `mrkdwn`. On the other hand, someone might yearn for a template engine with clear tag definition like HTML, especially when building a complex message.

jsx-slack has HTML-compatible JSX elements to format messages. It might be verbose as a text, but would give readablity by well-known HTML elements.

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

|                  jsx-slack                   |            Slack mrkdwn            |
| :------------------------------------------: | :--------------------------------: |
|  `<a href="https://example.com/">Link</a>`   |   `<https://example.com/\|Link>`   |
| `<a href="mailto:mail@example.com">Mail</a>` | `<mailto:mail@example.com/\|Mail>` |
|          `<a href="#C024BE7LR" />`           |          `<!#C024BE7LR>`           |
|          `<a href="@U024BE7LH" />`           |          `<!@U024BE7LH>`           |
|          `<a href="@SAZ94GDB8" />`           |       `<!subteam^SAZ94GDB8>`       |
|             `<a href="@here" />`             |          `<!here\|here>`           |
|           `<a href="@channel" />`            |       `<!channel\|channel>`        |
|           `<a href="@everyone" />`           |      `<!everyone\|everyone>`       |

## Similar projects

- [slack-jsx](https://github.com/zcei/slack-jsx) - Compose Slack messages from JSX Components instead of writing JSON.

## Author

Managed by [<img src="https://github.com/speee.png" alt="Speee, Inc." width="24" height="24" valign="bottom" /> Speee, Inc.](https://speee.jp) ([@speee](https://github.com/speee))

- <img src="https://github.com/yhatt.png" alt="@yhatt" width="24" height="24" valign="bottom" /> Yuki Hattori ([@yhatt](https://github.com/yhatt)) - Maintainer

## Licnese

[MIT License](LICENSE)
