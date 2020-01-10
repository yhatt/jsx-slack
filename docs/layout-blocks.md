###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Layout blocks

# Layout blocks

**[Layout blocks](https://api.slack.com/reference/block-kit/blocks)** are a series of basic blocks defined by Slack Block Kit.

All of these blocks can use as the children of [all block containers](block-containers.md), unless there is specific requirements such as [`<File>`](#file) or [`<Input>`](#input).

## <a name="section" id="section"></a> [`<Section>`: Section Block](https://api.slack.com/reference/messaging/blocks#section)

Display a simple text message. You have to specify the content as children. It allows [formatting with HTML-like elements](./html-like-formatting.md).

`<section>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Section>
    <p>Hello, world!</p>
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Hello%2C%20world!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### Accessory

A one of accessory component may include as the children of `<Section>`. The defined element will show in side-by-side of text.

```jsx
<Blocks>
  <Section>
    You can add an image next to text in this block. :point_right:
    <Image src="https://placekitten.com/256/256" alt="Accessory image" />
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22You%20can%20add%20an%20image%20next%20to%20text%20in%20this%20block.%20%3Apoint_right%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%0A%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22Accessory%20image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F256%2F256%22%7D%7D%5D)

#### Accessory components

- [`<Image>`](#image) / `<img>`
- [`<Button>`](block-elements.md#button) / `<button>`
- [`<Select>`](block-elements.md#select) / `<select>`
- [`<ExternalSelect>`](block-elements.md#external-select)
- [`<UsersSelect>`](block-elements.md#users-select)
- [`<ConversationsSelect>`](block-elements.md#conversations-select)
- [`<ChannelsSelect>`](block-elements.md#channels-select)
- [`<Overflow>`](block-elements.md#overflow)
- [`<DatePicker>`](block-elements.md#date-picker)
- [`<RadioButtonGroup>`](block-elements.md#radio-button-group) (Only for [`<Modal>`](block-containers.md#modal) and [`<Home>`](block-containers.md#home) container)

### <a name="field" id="field"></a> `<Field>`: Fields for section block

In addition the text content, the section block also can use 2 columns texts called fields. In jsx-slack, you can define field by `<Field>` component in `<Section>` block.

```jsx
<Blocks>
  <Section>
    About this repository:
    <Field>
      <b>Name</b>
      <br />
      speee/jsx-slack
    </Field>
    <Field>
      <b>Maintainer</b>
      <br />
      Yuki Hattori
    </Field>
    <Field>
      <b>Organization</b>
      <br />
      Speee, Inc.
    </Field>
    <Image src="https://github.com/speee.png" alt="Speee, Inc." />
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22About%20this%20repository%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22Speee%2C%20Inc.%22%2C%22image_url%22%3A%22https%3A%2F%2Fgithub.com%2Fspeee.png%22%7D%2C%22fields%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Name*%5Cnspeee%2Fjsx-slack%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Maintainer*%5CnYuki%20Hattori%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Organization*%5CnSpeee%2C%20Inc.%22%2C%22verbatim%22%3Atrue%7D%5D%7D%5D)

> :information_source: Contents of `<Field>` would be placed after the main text contents even if placed them anywhere.

## <a name="divider" id="divider"></a> [`<Divider>`: Divider Block](https://api.slack.com/reference/messaging/blocks#divider)

Just a divider. `<hr>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Divider />
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22divider%22%7D%5D)

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="image" id="image"></a> [`<Image>`: Image Block](https://api.slack.com/reference/messaging/blocks#image)

Display an image block. It has well-known props like `<img>` HTML element. In fact, `<img>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Image src="https://placekitten.com/500/500" alt="So cute kitten." />
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22So%20cute%20kitten.%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F500%2F500%22%7D%5D)

### Props

- `src` (**required**): The URL of the image.
- `alt` (**required**): A plain-text summary of the image.
- `title` (optional): An optional title for the image.
- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="actions" id="actions"></a> [`<Actions>`: Actions Block](https://api.slack.com/reference/messaging/blocks#actions)

A block to hold [interactive components](block-elements.md#interactive-components) provided by block elements. Slack allows a maximum of 25 interactive elements in `<Actions>` (But recommends to place up to 5 elements).

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="context" id="context"></a> [`<Context>`: Context Block](https://api.slack.com/reference/messaging/blocks#context)

Display message context. It allows mixed contents consisted of texts and `<Image>` components or `<img>` tags.

```jsx
<Blocks>
  <Context>
    <img src="https://placekitten.com/100/100" alt="Kitten" />
    A kitten and
    <img src="https://placekitten.com/100/100" alt="Kitten" />
    more kitten.
  </Context>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22context%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F100%2F100%22%2C%22alt_text%22%3A%22Kitten%22%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22A%20kitten%20and%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F100%2F100%22%2C%22alt_text%22%3A%22Kitten%22%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22more%20kitten.%22%2C%22verbatim%22%3Atrue%7D%5D%7D%5D)

Text contents will merge in pertinent mrkdwn elements automatically, but they also may divide clearly by using `<span>` HTML intrinsic element (or [`<Mrkdwn>` component](block-elements.md#mrkdwn) for text composition object).

```jsx
<Blocks>
  <Context>
    <span>
      ◤<br />◤<br />◤
    </span>
    <span>
      ◤<br />◤
    </span>
    <span>◤</span>
    multiple mrkdwns
  </Context>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22context%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%E2%97%A4%5Cn%E2%97%A4%5Cn%E2%97%A4%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%E2%97%A4%5Cn%E2%97%A4%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%E2%97%A4%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22multiple%20mrkdwns%22%2C%22verbatim%22%3Atrue%7D%5D%7D%5D)

> :warning: Slack restricts the number of elements consisted of text contents and images up to 10. jsx-slack throws an error if the number of generated elements is going over the limit.

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="file" id="file"></a> [`<File>`: File Block](https://api.slack.com/reference/messaging/blocks#file) (Only for messaging)

Display a remote file that was added to Slack workspace. [Learn about adding remote files in the document of Slack API.](https://api.slack.com/messaging/files/remote) _This block is only for [`<Blocks>` container](block-containers.md#blocks)._

```jsx
<Blocks>
  <File externalId="ABCD1" />
</Blocks>
```

### Props

- `externalId` (**required**): A string of unique ID for the file to show.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `source` (optional): Override `source` field. At the moment, you should not take care this because only the default value `remote` is available.

## <a name="input" id="input"></a> [`<Input>`: Input Block](https://api.slack.com/reference/messaging/blocks#input) (Only for modal)

Display one of interactive components for input to collect information from users. _This block is only for [`<Modal>` container](block-containers.md#modal)._

If you want to use `<Input>` as layout block, you have to place one of [available interactive components](#available-interactive-components) as a child.

```jsx
<Modal title="Register" submit="OK" close="Cancel">
  <Input label="User" title="Please select one of users." required>
    <UsersSelect placeholder="Choose user..." />
  </Input>
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Register%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22OK%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22hint%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Please%20select%20one%20of%20users.%22%2C%22emoji%22%3Atrue%7D%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22User%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22users_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Choose%20user...%22%2C%22emoji%22%3Atrue%7D%7D%7D%5D%7D)

### Props

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `title`/ `hint` (optional): Specify a helpful text appears under the element. `title` is alias to `hint` prop for keeping HTML compatibility.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal. `false` by default for HTML compatibility, and _notice that it is different from Slack's default._

### Available interactive components

- [`<Select>`](block-elements.md#select)
- [`<ExternalSelect>`](block-elements.md#external-select)
- [`<UsersSelect>`](block-elements.md#users-select)
- [`<ConversationsSelect>`](block-elements.md#conversations-select)
- [`<ChannelsSelect>`](block-elements.md#channels-select)
- [`<DatePicker>`](block-elements.md#date-picker)
- [`<RadioButtonGroup>`](block-elements.md#radio-button-group)

### Note

**We usually recommend to use [input components for modal](block-elements.md#input-components-for-modal) directly** instead of using `<Input>` layout block. These, included [`<Input>`](block-elements.md#input) and [`<Textarea>`](block-elements.md#textarea), can place to modal directly by passing props compatible with `<Input>` block, and you may write JSX template with familiar HTML form style.

```jsx
<Modal title="My App">
  <Input type="text" name="subject" label="Subject" required />
  <UsersSelect
    label="User"
    title="Please select one of users."
    required
    placeholder="Choose user..."
  />
  <Textarea name="message" label="Message" maxLength={500} />
</Modal>
```

`<Input>` component for layout block is provided for user that want templating with Slack API style rather than HTML style.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Layout blocks
