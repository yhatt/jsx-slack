###### [Top](../README.md) &raquo; About escape and exact mode

# About escape and exact mode

jsx-slack are making effort to be focusable only to contents of your message. Nevertheless, we may require you to consider escaping contents.

## Special characters

We think that anyone never wants to care about special characters for Slack mrkdwn while using jsx-slack with HTML-like formatting. But unfortunately, Slack does not provide how to escape special characters for formatting text. :thinking:

The content may break when JSX contents may have mrkdwn special characters like `*`, `_`, `~`, `` ` ``, and `>`.

### <a name="user-content-escape" id="escape"></a> `<Escape>`: Escape special characters

To battle against breaking message, we provide `<Escape>` component to keep special characters as plain text as possible (or replace into another similar character on the part of some restricted).

```jsx
<Blocks>
  <Section>&gt; *bold* _italic_ ~strikethrough~ `code`</Section>
  <Section>
    <Escape>&gt; *bold* _italic_ ~strikethrough~ `code`</Escape>
  </Section>
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULAJTk0uyczPs1NLL7FW0ErKz0nRUojPLEnMyUyOV6grLinKzE4tySjKL03PqFNISM5PSU2w0YdpQjYAyAbyXIuTEwtSSTMNqgdkGMJkG32oIwHZUDpP)

_By using `<Escape>`, please notice that it might change characters on the contents by replacement and insertion._ jsx-slack leaves mrkdwn by default to avoid unintended content breaking.

_We recommend using `<Escape>` only to unpredictable contents like made by users._

#### Details

Our basic strategy for escaping special character is using [the fallback text of date formatting](https://api.slack.com/reference/surfaces/formatting#date-formatting). Slack client always renders fallback as plain text, without text formatting, by setting invalid date format.

```
<!date^00000000^{_}|*>
```

We will escape special characters with date formatting as possible, but there are some exceptions:

- Leading `>` (`&gt;`)
- The content of hyperlink (`<a>`)

_Please notice contents may break if you are considering escape in them!_

<p><details>
<summary>More details about exceptions...</summary>

##### Leading quotes

In Slack, both of `>` (`&gt;`) and `＞` (`U+FF1E`) would recognize as blockquote only when it has coming to the beginning of line.

`U+FF1E` can escape through date formatting but `&gt;` cannot; the fallback text won't parse HTML entity used to avoid confliction with date format syntax. So we will add normally invisible soft hyphen (`U+00AD`) to the beginning if `&gt;` was found.

##### Replacements in hyperlink

Due to the same reason, the content of hyperlink (`<a>` tag) cannot escape through date format. So we will replace all special characters to another Unicode character whose similar shape.

- `*` :arrow_right: `∗` (Asterisk operator: `U+2217`)
- `＊` :arrow_right: `﹡` (Small asterisk: `U+FF0A`)
- `_` :arrow_right: `ˍ` (Modifier letter low macron: `U+02CD`)
- `＿` :arrow_right: `⸏` (Paragraphos: `U+2E0F`)
- `` ` `` :arrow_right: `ˋ` (Modifier letter grave accent: `U+02CB`)
- `｀` :arrow_right: `ˋ` (Modifier letter grave accent: `U+02CB`)
- `~` :arrow_right: `∼` (Tilde operator: `U+223C`)
- `>` :arrow_right: `U+00AD` + `>`
- `＞` :arrow_right: `U+00AD` + `＞`

These replacements also will trigger by using corresponded HTML tag. (e.g. `*` and `＊` in the contents of `<b>` tag)

</details></p>

> ℹ️ Special characters in valid emoji shorthand won't be escaped. For example, we will leave underscore(s) of the shorthand such as `:white_check_mark:`, `:marca_de_verificación_blanca:` and `:チェックマーク_緑:`.

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

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULAJTk0uyczPA7EVFIJLC1KLbDLtkhNzMm30M-3SihLTM3Myi0syk22S7FIrCjLBEkl2KfnJmfmlxSAD9OEm2OhDzQUA7gMfzA==)

You can deal workaround via `JSXSlack.exactMode(true)`. It can enable formatting forcibly by inserting zero-width space around special chars.

[<img src="./preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Super%5Cu200b_%5Cu200bcali%5Cu200b_%5Cu200bfragilistic%5Cu200b*%5Cu200bexpiali%5Cu200b*%5Cu200bdocious%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

**Exact mode is a last resort.** _We recommend dealing with incorrect rendering by such as inserting spaces around markup elements._

---

###### [Top](../README.md) &raquo; About escape and exact mode
