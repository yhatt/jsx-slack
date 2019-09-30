# JSX components for Block Kit

## Block containers

Slack provides [multiple surfaces to place Block Kit blocks](https://api.slack.com/block-kit/surfaces). So you should choose the parent container component depending on purpose.

### `<Blocks>`: The basic container for blocks

A basic container component for [Block Kit in messaging](https://api.slack.com/block-kit/surfaces/messages). Wrap layout block components in `<Blocks>`.

When composing message for using in API such as [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage), you should pass generated array by this container component to `blocks` field in payloads.

```javascript
import { WebClient } from '@slack/client'
import JSXSlack, { Blocks, Section } from '@speee-js/jsx-slack'

const api = new WebClient(process.env.SLACK_TOKEN)

api.chat.postMessage({
  channel: 'C1232456',
  blocks: JSXSlack(
    <Blocks>
      <Section>Hello, world!</Section>
    </Blocks>
  ),
})
```

### `<Modal>`: The modal view container

A container component for [Block Kit in modals](https://api.slack.com/block-kit/surfaces/modals). For focusing into interactions between user and app, you can create JSON object for modal powered by Block Kit.

A generated object by `<Modal>` container should pass to a `view` field in [`views.*`](https://api.slack.com/methods/views.open) API payloads.

```javascript
api.views.open({
  // NOTE: trigger_id received from another interaction is required.
  trigger_id: 'xxxxx.xxxxx.xxxxxxxxxxxx',
  view: JSXSlack(
    <Modal title="My first modal">
      <Section>Hello, modal!</Section>
    </Modal>
  ),
})
```

#### Props

- `title` (**required**): An user-facing title of the modal. (24 characters maximum)
- `close` (optional): A text for close button of the modal. (24 characters maximum)
- `submit` (optional): A text for submit button of the modal. (24 characters maximum)
- `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received. (3000 characters maximum)
- `clearOnClose` (optional): If enabled by setting `true`, all stacked views will be cleared by close button.
- `notifyOnClose` (optional): If enabled by setting `true`, `view_closed` event will be sent to request URL of Slack app when closed modal.
- `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)
- `externalId` (optional): A unique ID for all views on a per-team basis.

> :information_source: Slack requires the submit text when modal has component for inputs, so jsx-slack would set the text "Submit" as the default value of `submit` prop if you are setting no text together with using input components.

## Layout blocks

### [`<Section>`: Section Block](https://api.slack.com/reference/messaging/blocks#section)

Display a simple text message. You have to specify the content as children. It allows [formatting with HTML-like elements](./html-like-formatting.md).

`<section>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Section>Hello, world!</Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Hello%2C%20world!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

#### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

#### Accessory

The content of `<Section>` may include one of an accessory component. A defined element will show in side-by-side of text.

```jsx
<Blocks>
  <Section>
    You can add an image next to text in this block. :point_right:
    <Image src="https://placekitten.com/256/256" alt="Accessory image" />
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22You%20can%20add%20an%20image%20next%20to%20text%20in%20this%20block.%20%3Apoint_right%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%0A%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22Accessory%20image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F256%2F256%22%7D%7D%5D)

##### Accessory components

- [`<Image>`](#image-image-block)
- [`<Button>`](#button-button-element)
- [`<Select>`](#select-select-menu-with-static-options)
- [`<ExternalSelect>`](#externalselect-select-menu-with-external-data-source)
- [`<UsersSelect>`](#usersselect-select-menu-with-user-list)
- [`<ConversationsSelect>`](#conversationsselect-select-menu-with-conversations-list)
- [`<ChannelsSelect>`](#channelsselect-select-menu-with-channel-list)
- [`<Overflow>`](#overflow-overflow-menu)
- [`<DatePicker>`](#datepicker-select-date-from-calendar)

#### `<Field>`: Fields for section block

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

> Contents of `<Field>` would be placed after the main text contents even if placed them anywhere.

### [`<Divider>`: Divider Block](https://api.slack.com/reference/messaging/blocks#divider)

Just a divider. `<hr>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Divider />
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22divider%22%7D%5D)

#### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### [`<Image>`: Image Block](https://api.slack.com/reference/messaging/blocks#image)

Display an image block. It has well-known props like `<img>` HTML element. In fact, `<img>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Image src="https://placekitten.com/500/500" alt="So cute kitten." />
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22So%20cute%20kitten.%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F500%2F500%22%7D%5D)

#### Props

- `src` (**required**): The URL of the image.
- `alt` (**required**): A plain-text summary of the image.
- `title` (optional): An optional title for the image.
- `id` / `blockId` (optional): A string of unique identifier of block.

### [`<Actions>`: Actions Block](https://api.slack.com/reference/messaging/blocks#actions)

A block to hold interactive elements provided by [block elements](#block-elements). Slack allows a maximum of 25 interactive elements in `<Actions>` (But recommends to place up to 5 elements).

#### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### [`<Context>`: Context Block](https://api.slack.com/reference/messaging/blocks#context)

Display message context. It allows mixed contents consisted of texts and `<Image>` components / `<img>` tags.

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

Text contents will merge in pertinent mrkdwn elements automatically, but they also may divide clearly by using `<span>` HTML intrinsic element.

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

#### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### [`<File>`: File Block](https://api.slack.com/reference/messaging/blocks#file)

Display a remote file that was added to Slack workspace. [Learn about adding remote files in the document of Slack API.](https://api.slack.com/messaging/files/remote)

```jsx
<Blocks>
  <File externalId="ABCD1" />
</Blocks>
```

#### Props

- `externalId` (**required**): A string of unique ID for the file to show.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `source` (optional): Override `source` field. At the moment, you should not take care this because only the default value `remote` is available.

### [`<Input>`: Input Block](https://api.slack.com/reference/messaging/blocks#input) <a name="input-block" id="input-block">(Only for modal)</a>

Display one of input elements for collecting information from users. _This block is only for `<Modal>`._

If you want to use `<Input>` as layout block, you have to place the one of availables as a child.

```jsx
<Modal title="My App">
  <Input label="User" hint="Please select one of users." required>
    <UsersSelect placeholder="Choose user..." />
  </Input>
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22hint%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Please%20select%20one%20of%20users.%22%2C%22emoji%22%3Atrue%7D%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22User%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Atrue%2C%22element%22%3A%7B%22type%22%3A%22users_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Choose%20user...%22%2C%22emoji%22%3Atrue%7D%7D%7D%5D&mode=modal)

#### Props (Layout block)

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of block.
- `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal. `false` by default for HTML compatibility, and _notice that it is different from Slack's default._

#### Available elements as a child

- [`<Select>`](#select-select-menu-with-static-options)
- [`<ExternalSelect>`](#externalselect-select-menu-with-external-data-source)
- [`<UsersSelect>`](#usersselect-select-menu-with-user-list)
- [`<ConversationsSelect>`](#conversationsselect-select-menu-with-conversations-list)
- [`<ChannelsSelect>`](#channelsselect-select-menu-with-channel-list)

In jsx-slack, [`<Input>` component also can use as the block element for plain text input in modal.](#input-element)

## Block elements

Some blocks may include block elements. e.g. the interactive component to exchange info with Slack app.

### [`<Button>`: Button element](https://api.slack.com/reference/messaging/block-elements#button)

A simple button to send action to registered Slack App, or open external URL.

```jsx
<Blocks>
  <Actions>
    <Button actionId="action" value="value" style="primary">
      Action button
    </Button>
    <Button url="https://example.com/">Link to URL</Button>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Action%20button%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22action%22%2C%22style%22%3A%22primary%22%2C%22value%22%3A%22value%22%7D%2C%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Link%20to%20URL%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Fexample.com%2F%22%7D%5D%7D%5D)

#### Props

- `actionId` (optional): An identifier for the action.
- `value` (optional): A string value to send to Slack App when clicked button.
- `url` (optional): URL to load when clicked button.
- `style` (optional): Select the colored button decoration from `primary` and `danger`.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

### [`<Select>`: Select menu with static options](https://api.slack.com/reference/messaging/block-elements#static-select)

A menu element with static options passed by `<Option>` or `<Optgroup>`. It has a interface similar to `<select>` HTML element.

```jsx
<Blocks>
  <Actions>
    <Select actionId="rating" placeholder="Rate it!">
      <Option value="5">5 :star::star::star::star::star:</Option>
      <Option value="4">4 :star::star::star::star:</Option>
      <Option value="3">3 :star::star::star:</Option>
      <Option value="2">2 :star::star:</Option>
      <Option value="1">1 :star:</Option>
    </Select>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22static_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Rate%20it!%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22rating%22%2C%22options%22%3A%5B%7B%22value%22%3A%225%22%2C%22text%22%3A%7B%22text%22%3A%225%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%224%22%2C%22text%22%3A%7B%22text%22%3A%224%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%223%22%2C%22text%22%3A%7B%22text%22%3A%223%20%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%222%22%2C%22text%22%3A%7B%22text%22%3A%222%20%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%221%22%2C%22text%22%3A%7B%22text%22%3A%221%20%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%5D%7D%5D)

By defining `multiple` attribute, you also can provide [the selectable menu from multiple options][multi-select] with an appearance is similar to button or text input. The same goes for other menu-like components.

[multi-select]: https://api.slack.com/reference/block-kit/block-elements#multi_select

```jsx
<Blocks>
  <Section>
    What kind of dogs do you love? :dog:
    <Select
      actionId="dogs"
      multiple
      placeholder="Choose favorite dog(s)"
      value={['labrador', 'golden_retriver']}
    >
      <Option value="labrador">Labrador</Option>
      <Option value="german_shepherd">German Shepherd</Option>
      <Option value="golden_retriver">Golden Retriever</Option>
      <Option value="bulldog">Bulldog</Option>
    </Select>
  </Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](<https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22What%20kind%20of%20dogs%20do%20you%20love%3F%20%3Adog%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%7B%22type%22%3A%22multi_static_select%22%2C%22action_id%22%3A%22dogs%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Choose%20favorite%20dog(s)%22%2C%22emoji%22%3Atrue%7D%2C%22initial_options%22%3A%5B%7B%22value%22%3A%22labrador%22%2C%22text%22%3A%7B%22text%22%3A%22Labrador%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22golden_retriver%22%2C%22text%22%3A%7B%22text%22%3A%22Golden%20Retriever%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%2C%22options%22%3A%5B%7B%22value%22%3A%22labrador%22%2C%22text%22%3A%7B%22text%22%3A%22Labrador%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22german_shepherd%22%2C%22text%22%3A%7B%22text%22%3A%22German%20Shepherd%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22golden_retriver%22%2C%22text%22%3A%7B%22text%22%3A%22Golden%20Retriever%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22bulldog%22%2C%22text%22%3A%7B%22text%22%3A%22Bulldog%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%7D%5D&mode=message>)

> :warning: Slack does not allow to place the multi-select menu in `Actions` block. So jsx-slack throws error if you're trying to use `multiple` attribute in the children of `<Actions>`.

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `value` (optional): A value of item to show initially. It must choose value from defined `<Option>` elements in children. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

#### `<Option>`: Menu item

##### Props

- `value` (**required**): A string value to send to Slack App when choose item.

#### `<Optgroup>`: Group of menu items

```jsx
<Blocks>
  <Actions>
    <Select actionId="action" placeholder="Action...">
      <Optgroup label="Search with">
        <Option value="search_google">Google</Option>
        <Option value="search_bing">Bing</Option>
        <Option value="search_duckduckgo">DuckDuckGo</Option>
      </Optgroup>
      <Optgroup label="Share to">
        <Option value="share_facebook">Facebook</Option>
        <Option value="share_twitter">Twitter</Option>
      </Optgroup>
    </Select>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22static_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Action...%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22action%22%2C%22option_groups%22%3A%5B%7B%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Search%20with%22%2C%22emoji%22%3Atrue%7D%2C%22options%22%3A%5B%7B%22value%22%3A%22search_google%22%2C%22text%22%3A%7B%22text%22%3A%22Google%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22search_bing%22%2C%22text%22%3A%7B%22text%22%3A%22Bing%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22search_duckduckgo%22%2C%22text%22%3A%7B%22text%22%3A%22DuckDuckGo%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%2C%7B%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%20to%22%2C%22emoji%22%3Atrue%7D%2C%22options%22%3A%5B%7B%22value%22%3A%22share_facebook%22%2C%22text%22%3A%7B%22text%22%3A%22Facebook%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22share_twitter%22%2C%22text%22%3A%7B%22text%22%3A%22Twitter%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%5D%7D%5D%7D%5D)

##### Props

- `label` (**required**): A plain text to be shown as a group name.

### [`<ExternalSelect>`: Select menu with external data source](https://api.slack.com/reference/messaging/block-elements#external-select)

You should use `<ExternalSelect>` if you want to provide the dynamic list from external source.

It requires setup JSON entry URL in your Slack app. [Learn about external source in Slack documentation.](https://api.slack.com/reference/messaging/block-elements#external-select)

```jsx
<Blocks>
  <Actions>
    <ExternalSelect
      actionId="category"
      placeholder="Select category..."
      minQueryLength={2}
    />
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22external_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Select%20category...%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22category%22%2C%22min_query_length%22%3A2%7D%5D%7D%5D)

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialOption` (optional): An initial option exactly matched to provided options from external source. It allows raw JSON object or `<Option>`. It can pass multiple options by array when `multiple` is enabled.
- `minQueryLength` (optional): A length of typed characters to begin JSON request.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

#### `<SelectFragment>`: Generate options for external source

You would want to build not only the message but also the data source by jsx-slack. `<SelectFragment>` component can create JSON object for external data source usable in `<ExternalSelect>`.

A following is a super simple example to serve JSON for external select via [express](https://expressjs.com/). It is using [`jsxslack` tagged template literal](../README.md#quick-start-template-literal).

```javascript
import { jsxslack } from '@speee-js/jsx-slack'
import express from 'express'

const app = express()

app.get('/external-data-source', (req, res) => {
  res.json(jsxslack`
    <SelectFragment>
      <Option value="item-a">Item A</Option>
      <Option value="item-b">Item B</Option>
      <Option value="item-c">Item C</Option>
    </SelectFragment>
  `)
})

app.listen(80)
```

### [`<UsersSelect>`: Select menu with user list](https://api.slack.com/reference/messaging/block-elements#users-select)

A select menu with options consisted of users in the current workspace.

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialUser` (optional): The initial user ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

### [`<ConversationsSelect>`: Select menu with conversations list](https://api.slack.com/reference/messaging/block-elements#conversation-select)

A select menu with options consisted of any type of conversations in the current workspace.

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialConversation` (optional): The initial conversation ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

### [`<ChannelsSelect>`: Select menu with channel list](https://api.slack.com/reference/messaging/block-elements#channel-select)

A select menu with options consisted of public channels in the current workspace.

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialChannel` (optional): The initial channel ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

### [`<Overflow>`: Overflow menu](https://api.slack.com/reference/messaging/block-elements#overflow)

An overflow menu displayed as `...` can access to some hidden menu items by many actions. _It must contain least of 2 `<OverflowItem>` components._

```jsx
<Blocks>
  <Actions>
    <Overflow actionId="overflow_menu">
      <OverflowItem value="share">Share</OverflowItem>
      <OverflowItem value="reply">Reply message</OverflowItem>
      <OverflowItem url="https://example.com/">Open in browser</OverflowItem>
    </Overflow>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22overflow%22%2C%22action_id%22%3A%22overflow_menu%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%22%2C%22emoji%22%3Atrue%7D%2C%22value%22%3A%22share%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Reply%20message%22%2C%22emoji%22%3Atrue%7D%2C%22value%22%3A%22reply%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Open%20in%20browser%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Fexample.com%2F%22%7D%5D%7D%5D%7D%5D)

#### Props

- `actionId` (optional): An identifier for the action.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog when clicked menu item.

#### `<OverflowItem>`: Menu item in overflow menu

##### Props

- `value` (optional): A string value to send to Slack App when choose item.
- `url` (optional): URL to load when clicked button.

### [`<DatePicker>`: Select date from calendar](https://api.slack.com/reference/messaging/block-elements#datepicker)

An easy way to let the user selecting any date is using `<DatePicker>` component.

```jsx
<Blocks>
  <Actions>
    <DatePicker actionId="date_picker" initialDate={new Date()} />
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22datepicker%22%2C%22action_id%22%3A%22date_picker%22%2C%22initial_date%22%3A%222019-02-22%22%7D%5D%7D%5D)

#### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialDate` (optional): An initially selected date. It allows `YYYY-MM-DD` formatted string, UNIX timestamp in millisecond, and JavaScript [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

### [`<Input>`: Plain-text input element](https://api.slack.com/reference/block-kit/block-elements#input) <a name="input-element" id="input-element">(Only for modal)</a>

`<Input>` block element is for placing a single-line input form within `<Modal>`. It has a interface similar to `<input>` HTML element.

It can place as children of `<Modal>` directly.

```jsx
<Modal title="My App">
  <Input label="Title" name="title" maxLength={80} required />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Title%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22title%22%2C%22max_length%22%3A80%7D%7D%5D&mode=modal)

> Internally this is syntactic sugar for [`<Input>` block](#input-block) with a plain-text input.

#### Props (Block element)

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier for [`<Input>` block](#input-block).
- `name` / `actionId` (optional): A string of unique identifier for the action.
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `placeholder` (optional): Specify a text string appears within the content of input is empty. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.
- `value` (optional): An initial value for plain-text input.
- `maxLength` (optional): The maximum number of characters allowed for the input element. It must up to 3000 character.
- `minLength` (optional): The minimum number of characters allowed for the input element.

## Components for [composition objects](https://api.slack.com/reference/messaging/composition-objects)

### [`<Confirm>`: Confirmation dialog](https://api.slack.com/reference/messaging/composition-objects#confirm)

Define confirmation dialog. Interactive elements can open confirmation dialog when selected, by passing `<Confirm>` to `confirm` prop.

```jsx
<Blocks>
  <Actions>
    <Button
      actionId="commit"
      value="value"
      confirm={
        <Confirm title="Commit your action" confirm="Yes, please" deny="Cancel">
          <b>Are you sure?</b> Please confirm your action again.
        </Confirm>
      }
    >
      Commit
    </Button>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/confirmation.png" width="500" />][confirmation]

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />][confirmation]

[confirmation]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Commit%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22commit%22%2C%22confirm%22%3A%7B%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Commit%20your%20action%22%2C%22emoji%22%3Atrue%7D%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Are%20you%20sure%3F*%20Please%20confirm%20your%20action%20again.%22%2C%22verbatim%22%3Atrue%7D%2C%22confirm%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Yes%2C%20please%22%2C%22emoji%22%3Atrue%7D%2C%22deny%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%7D%2C%22value%22%3A%22value%22%7D%5D%7D%5D

> :information_source: You can use [HTML-like formatting](./html-like-formatting.md) to the content of confirmation dialog. However, you have to be careful that Slack ignores any line breaks and the content will render just in a line.

#### Props

- `title` (**required**): The title of confirmation dialog.
- `confirm` (**required**): A text content of the button to confirm.
- `deny` (**required**): A text content of the button to cancel.
