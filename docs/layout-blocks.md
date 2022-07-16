###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Layout blocks

# Layout blocks

**[Layout blocks](https://api.slack.com/reference/block-kit/blocks)** are a series of basic blocks defined by Slack Block Kit.

All of these blocks can use as the children of [all block containers](block-containers.md), unless there is specific requirements such as [`<File>`](#file) or [`<Call>`](#call).

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

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULAJTk0uyczPA7GBvAI7j9ScnHwdhfL8opwURRv9ArAifbgqG32oXgC2axRh)

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### Accessory

A one of accessory component may include as the children of `<Section>`. The defined element will show in side-by-side or just below of text.

```jsx
<Blocks>
  <Section>
    You can add an image next to text in this block. :point_right:
    <Image src="https://placekitten.com/256/256" alt="Accessory image" />
  </Section>
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJw9jsEKwjAQRO9-xZAPaEDQQ0kFvXn25EniNjRL22xpVtC_10TxMMxcZua50yQ05sMGcJdAypJKBq7yAPkE3_f4GM9-CEjhqVCBFucEjZxxLwsN2kU46W3lIWpbJ9y5lvJKnYmqS26tXSZPYWTVkBqS2W53-yIDP2lnjkQhZ1lf3z8DW8Hsn8zZH-8bd8I7HQ==)

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
- [`<TimePicker>`](block-elements.md#time-picker)
- [`<CheckboxGroup>`](block-elements.md#checkbox-group)
- [`<RadioButtonGroup>`](block-elements.md#radio-button-group)

### <a name="field" id="field"></a> `<Field>`: Fields for section block

In addition the text content, the section block also can use 2 columns texts called fields. In jsx-slack, you can define field by `<Field>` component in `<Section>` block.

```jsx
<Blocks>
  <Section>
    About this repository:
    <Field>
      <b>Name</b>
      <br />
      yhatt/jsx-slack
    </Field>
    <Field>
      <b>Maintainer</b>
      <br />
      Yuki Hattori
    </Field>
    <Image src="https://github.com/yhatt.png" alt="yhatt" />
  </Section>
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJx1kE0LwjAMhu_-itC7y310Az2IHvTiyWNbyxrXraPNwP175-YXqIdAniQ8hFeufTB1KhcA8mgNU2jvPcBKh56BHSWItguJOMQhn1ZyQ9af57ORdHlQjZWo35MI-ITBKWa8pOsyeWXqWYAfhi_bXlHLY9n4z3nqa4Lt6A2Rfgh3jaospGgK4Zi7lCNWxK7XmQkNTg9lXVsJUJ4LMbGY5RJfGUh8JHMDjUNR5Q==)

> :information_source: Contents of `<Field>` would be placed after the main text contents even if placed them anywhere.

## <a name="divider" id="divider"></a> [`<Divider>`: Divider Block](https://api.slack.com/reference/messaging/blocks#divider)

Just a divider. `<hr>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Divider />
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULBxySzLTEktUtC347LRh4oDAJ_dCcQ=)

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="image" id="image"></a> [`<Image>`: Image Block](https://api.slack.com/reference/messaging/blocks#image)

Display an image block. It has well-known props like `<img>` HTML element. In fact, `<img>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Image src="https://placekitten.com/500/500" alt="So cute kitten." />
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULDxzE1MT1UoLkq2VcooKSkottLXL8hJTE7NziwpSc3TS87P1Tc1MABhJYXEnBJbpeB8heTSklQFqAIlBX07Lht9qIkAIpscbw==)

### Props

- `src` (**required**): The URL of the image.
- `alt` (**required**): A plain-text summary of the image.
- `title` (optional): An optional title for the image.
- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="header" id="header"></a> [`<Header>`: Header Block](https://api.slack.com/reference/messaging/blocks#header)

Display a plain text in a larger and bold font. The same name `<header>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Header>Heads up!</Header>
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULDxSE1MSS2yA1HFCqUFijb6UBEuG32oMgBi2w70)

Please be aware that header layout block _only accepts the plain text_ for now. `<br />` will work but [most other HTML-like elements for styling](./html-like-formatting.md#basic-text-formatting) would not work.

### Props

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

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULBxzs8rSa0oAbGBvMzcdIXiomRbpYySkoJiK339gpzE5NTszJKS1Dy95PxcfUMDAxBWUkjMKbFV8gZLKCnoQ7Q7KkBUKiTmpVDDvNz8olSokXogt-rDHWujD_UCAJNMPX4=)

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

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULBxzs8rSa0oAbGBvOKCxDwIU0Hh0fQlNklFCvp2yAyIMn2EOpxacKgEKUESzC3NKcksyElVyC3KTinPKwY5SR_uJht9qEsBMJU35w==)

> :warning: Slack restricts the number of elements consisted of text contents and images up to 10. jsx-slack throws an error if the number of generated elements is going over the limit.

### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

## <a name="input" id="input"></a> [`<Input>`: Input Block](https://api.slack.com/reference/messaging/blocks#input)

Display one of interactive components for input to collect information from users.

If you want to use `<Input>` as layout block, you have to place one of [available interactive components](#available-interactive-components) as a child.

```jsx
<Modal title="Register" submit="OK" close="Cancel">
  <Input label="User" title="Please select one of users." required>
    <UsersSelect placeholder="Choose user..." />
  </Input>
</Modal>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJwtjkEOwjAMBO99heUHtB9oeuGEEAKBeECaLDSSaUqc_J80cPbOjMdz9FYohywwfMMraEZi0jK_QzZ8OTE5iVqPB7s6CE8d0Xhct5JJ7Awx_NCd-CuuAqsghcBliisoPqnUhfZMCZ8SEvzuqJYd1PtvuYl1WKJ4pJpaYk02rO8rN7To0KpTNw7t6ekLOwQ9uw==)

### Props

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `title`/ `hint` (optional): Specify a helpful text appears under the element. `title` is alias to `hint` prop for keeping HTML compatibility.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal. `false` by default for HTML compatibility, and _notice that it is different from Slack's default._
- `dispatchAction` (optional): By setting `true`, the input element will dispatch [`block_actions` payload](https://api.slack.com/reference/interaction-payloads/block-actions) when used this.

### Available interactive components

- [`<Select>`](block-elements.md#select)
- [`<ExternalSelect>`](block-elements.md#external-select)
- [`<UsersSelect>`](block-elements.md#users-select)
- [`<ConversationsSelect>`](block-elements.md#conversations-select) \*
- [`<ChannelsSelect>`](block-elements.md#channels-select) \*
- [`<DatePicker>`](block-elements.md#date-picker)
- [`<TimePicker>`](block-elements.md#time-picker)
- [`<CheckboxGroup>`](block-elements.md#checkbox-group)
- [`<RadioButtonGroup>`](block-elements.md#radio-button-group)

> \* Some components have unique properties only for [input components](block-elements.md#input-components). You cannot define them to the interactive component wrapped in `<Input>` layout block _(TypeScript would throw error while compile)_.

### Note

**We usually recommend to use [input components](block-elements.md#input-components) directly** instead of using `<Input>` layout block. These, included [`<Input>`](block-elements.md#input) and [`<Textarea>`](block-elements.md#textarea), can place to modal directly by passing props compatible with `<Input>` block, and you may write JSX template with familiar HTML form style.

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

## <a name="video" id="video"></a> [`<Video>`: Video Block](https://api.slack.com/reference/messaging/blocks#video)

A block for embedding a video. The `<video>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Video
    src="https://www.youtube.com/embed/RRxQQxiM7AA?feature=oembed&autoplay=1"
    alt="How to use Slack?"
    title="How to use Slack."
    poster="https://i.ytimg.com/vi/RRxQQxiM7AA/hqdefault.jpg"
    authorName="Arcado Buendia"
    description="Slack is a new way to communicate with your team. It's faster, better organized and more secure than email."
    titleUrl="https://www.youtube.com/watch?v=RRxQQxiM7AA"
    providerName="YouTube"
    providerIconUrl="https://a.slack-edge.com/80588/img/unfurl_icons/youtube.png"
  />
</Blocks>
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJx1kk9PAjEQxe98igkHvehWD0ZiWAme9KAJ-CfxZIZ2YKvdztpOWfDTWxaMEOOpTV5m3u-9dnjjWH_E6x7A8MUa4nwBiEGX_UqkiVdKtW1brDlJmlGhuVZUz8io6XQ1mazs_eV4PJoTSgpUcicdYRJuHK7L8363DZ2U_VtuQRhSJHh0qD9GW02sOPqrFlu14SgUflFssRZbLzqMpd1nUNWnoTkmJ8V7s9j5Jqk4PGCdDcZBo2G4SeSNxa1uKOpgG7Hsy35nCzYCgqcWWlxvgLJRnbzVKAStlQpyEQGEsC7gTo4jzHFDeAIzknwChwV6-0UG0BuoORBE0rkbkAo9UI3WFXvJn4P7v-gWRVejZbkXc1dL4GV-q120V05PeeRQutPsD5ZjETcJT8ksttsHZxeDgcptquTnKbg3m0ei-gFofNeiuu4N1e6PfAO2dbnp)

> **Warning** Whether the block can play the embedded video correctly is depending on the Slack app settings and the video URL. Please check out [the requirements and constraints of the video layout block in Slack API documentation](https://api.slack.com/reference/block-kit/blocks#video_requirements) first.
>
> Slack Block Kit Builder may not test and preview the video block due to the app constraints. Recommend to use your own Slack app to test.

### Props

- `src` / `videoUrl` (**required**): The URL to be embedded video. _URL must be compatible with an embeddable iframe_ (`<iframe src="******" />`).
- `alt` (**required**): A tooltip text for the video. It is required by Slack for accessibility.
- `title` (**required**): A video title (200 characters maximum).
- `poster` / `thumbnailUrl` (**required**): URL for the thumbnail image of the video.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `authorName` (optional): The author name of the video to be displayed (50 characters maximum).
- `description` (optional): The description for the video.
- `providerName` (optional): The originating application name or domain of the video. (ex. YouTube)
- `providerIconUrl` (optional): An image URL for the video provider icon.
- `titleUrl` (optional): HTTPS URL for the hyperlink of the title text. It must correspond to the non-embeddable URL for the video.

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

## <a name="call" id="call"></a> `<Call>`: Call Block (Only for messaging)

Display a card of the call that was registered to Slack workspace. [Learn about using the Calls API in the document of Slack API.](https://api.slack.com/apis/calls) _This block is only for [`<Blocks>` container](block-containers.md#blocks)._

```jsx
<Blocks>
  <Call callId="R0123456789" />
</Blocks>
```

### Props

- `callId` (**required**): A string of registered call's ID.
- `id` / `blockId` (optional): A string of unique identifier of block.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Layout blocks
