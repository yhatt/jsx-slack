###### [Top](../) &raquo; About escape and exact mode

# About escape and exact mode

jsx-slack are making effort to be focusable only to contents of your message. Nevertheless, we may require you to consider escaping contents.

## Special characters

We think that anyone never wants to care about special characters for Slack mrkdwn while using jsx-slack. But unfortunately, Slack does not provide how to escape special characters for formatting text. :thinking:

The content would break when JSX contents may have mrkdwn special characters like `*`, `_`, `~`, `` ` ``, and `>`.

### <a name="escape" id="escape"></a> `<Escape>`: Escape special characters

To battle against breaking message, we provide `<Escape>` component to replace special characters into another similar character.

```jsx
<Blocks>
  <Section>&gt; *bold* _italic_ ~strikethrough~ `code`</Section>
  <Section>
    <Escape>&gt; *bold* _italic_ ~strikethrough~ `code`</Escape>
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://bit.ly/2SSNLtz)

**By using `<Escape>`, please notice that it may change characters in contents.** jsx-slack will leave mrkdwn by default to avoid unintended contents interpolation via escape. _We recommend using `<Escape>` only to unpredictable contents like made by users._

#### Details

`>` (`&gt;`) and `＞` (`U+FF1E`) would recognize as blockquote only when it has coming to the beginning of line. If it was found, we will add normally invisible soft hyphen (`U+00AD`) to the beginning.

Other special chars will replace to another Unicode character whose similar shape.

- `*` :arrow_right: `∗` (Asterisk operator: `U+2217`)
- `＊` :arrow_right: `﹡` (Small asterisk: `U+FF0A`)
- `_` :arrow_right: `ˍ` (Modifier letter low macron: `U+02CD`)
- `＿` :arrow_right: `⸏` (Paragraphos: `U+2E0F`)
- `` ` `` :arrow_right: `ˋ` (Modifier letter grave accent: `U+02CB`)
- `｀` :arrow_right: `ˋ` (Modifier letter grave accent: `U+02CB`)
- `~` :arrow_right: `∼` (Tilde operator: `U+223C`)

These replacements also will trigger by using corresponded HTML tag. (e.g. `*` and `＊` in the contents of `<b>` tag)

## Exact mode

Some special characters will work only in breaks of words. Take a look this example:

```jsx
<Blocks>
  <Section>
    Super<i>cali</i>fragilistic<b>expiali</b>docious
  </Section>
</Blocks>
```

We expect showing the post as follow:

> Super*cali*fragilistic**expiali**docious

However, Slack renders as:

> Super_cali_fragilistic\*expiali\*docious

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Super_cali_fragilistic*expiali*docious%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

You can deal workaround via `SlackJSX.exactMode(true)`. It can enable formatting forcibly by inserting zero-width space around special chars.

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Super%5Cu200b_%5Cu200bcali%5Cu200b_%5Cu200bfragilistic%5Cu200b*%5Cu200bexpiali%5Cu200b*%5Cu200bdocious%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

**Exact mode is a last resort.** _We recommend dealing with incorrect rendering by such as inserting spaces around markup elements._

---

###### [Top](../) &raquo; About escape and exact mode
