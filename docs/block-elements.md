###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block elements

# Block elements

[Layout blocks](layout-blocks.md) and [modal container](block-containers.md#modal) may include some **[block elements](https://api.slack.com/reference/block-kit/block-elements)**. e.g. the interactive component to exchange info with Slack app.

|         Components          | `<Action>` layout block | `<Input>` layout block | `<Modal>` container \* |
| :-------------------------: | :---------------------: | :--------------------: | :--------------------: |
|       **`<Button>`**        |   :white_check_mark:    |          :x:           |          :x:           |
|       **`<Select>`**        |       Single only       |   :white_check_mark:   |   :white_check_mark:   |
|   **`<ExternalSelect>`**    |       Single only       |   :white_check_mark:   |   :white_check_mark:   |
|     **`<UsersSelect>`**     |       Single only       |   :white_check_mark:   |   :white_check_mark:   |
|   **`<ChannelsSelect>`**    |       Single only       |   :white_check_mark:   |   :white_check_mark:   |
| **`<ConversationsSelect>`** |       Single only       |   :white_check_mark:   |   :white_check_mark:   |
|      **`<Overflow>`**       |   :white_check_mark:    |          :x:           |          :x:           |
|     **`<DatePicker>`**      |   :white_check_mark:    |   :white_check_mark:   |   :white_check_mark:   |
|        **`<Input>`**        |           :x:           |           -            |   :white_check_mark:   |
|      **`<Textarea>`**       |           :x:           |          :x:           |   :white_check_mark:   |

\*: `<Button>` and `<Overflow>` also can place through `<Action>` layout block.

## Interactive components

### [`<Button>`: Button element](https://api.slack.com/reference/messaging/block-elements#button)

A simple button to send action to registered Slack App, or open external URL. `<button>` intrinsic HTML element also works as well.

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

- `name` / `actionId` (optional): An identifier for the action.
- `value` (optional): A string value to send to Slack App when clicked button.
- `url` (optional): URL to load when clicked button.
- `style` (optional): Select the colored button decoration from `primary` and `danger`.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

### [`<Select>`: Select menu with static options](https://api.slack.com/reference/messaging/block-elements#static-select)

A menu element with static options passed by `<Option>` or `<Optgroup>`. It has a interface similar to `<select>` HTML element. In fact, `<select>` intrinsic HTML element works as well.

```jsx
<Blocks>
  <Actions>
    <Select actionId="rating" placeholder="Rate it!">
      <Option value="5">5 {':star:'.repeat(5)}</Option>
      <Option value="4">4 {':star:'.repeat(4)}</Option>
      <Option value="3">3 {':star:'.repeat(3)}</Option>
      <Option value="2">2 {':star:'.repeat(2)}</Option>
      <Option value="1">1 {':star:'.repeat(1)}</Option>
    </Select>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22static_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Rate%20it!%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22rating%22%2C%22options%22%3A%5B%7B%22value%22%3A%225%22%2C%22text%22%3A%7B%22text%22%3A%225%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%224%22%2C%22text%22%3A%7B%22text%22%3A%224%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%223%22%2C%22text%22%3A%7B%22text%22%3A%223%20%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%222%22%2C%22text%22%3A%7B%22text%22%3A%222%20%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%221%22%2C%22text%22%3A%7B%22text%22%3A%221%20%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%5D%7D%5D)

#### Multiple select

By defining `multiple` attribute, you also can provide [the selectable menu from multiple options][multi-select] with an appearance is similar to button or text input. The same goes for other select-like components.

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

#### Usage in `<Modal>` container

In `<Modal>` container, select-like components may place as children of `<Modal>` directly by wrapping in [`<Input>` layout block](#input-block) by passing `label` prop. Thereby it would allow natural templating like as HTML form style.

```jsx
<Modal title="My App">
  <Select
    label="Language"
    name="language"
    title="Pick language you want to learn."
    required
  >
    <Option value="javascript">JavaScript</Option>
    <Option value="python">Python</Option>
    <Option value="java">Java</Option>
    <Option value="c-sharp">C#</Option>
    <Option value="php">PHP</Option>
  </Select>
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22hint%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Pick%20language%20you%20want%20to%20learn.%22%2C%22emoji%22%3Atrue%7D%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Language%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22static_select%22%2C%22action_id%22%3A%22language%22%2C%22options%22%3A%5B%7B%22value%22%3A%22javascript%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22JavaScript%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22python%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Python%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22java%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Java%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22c-sharp%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22C%23%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22php%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22PHP%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%7D%5D&mode=modal)

The above JSX means exactly same as following:

<!-- prettier-ignore-start -->

```jsx
<Modal title="My App">
  <Input label="Language" title="Pick language you want to learn." required>
    <Select actionId="language">
      ...
    </Select>
  </Input>
</Modal>
```

<!-- prettier-ignore-end -->

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `value` (optional): A value of item to show initially. It must choose value from defined `<Option>` elements in children. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

#### `<Option>`: Menu item

Define an item for `<Select>`. `<option>` intrinsic HTML element works as well.

##### Props

- `value` (**required**): A string value to send to Slack App when choose item.

#### `<Optgroup>`: Group of menu items

Define a group for `<Select>`. `<optgroup>` intrinsic HTML element works as well.

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

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialOption` (optional): An initial option exactly matched to provided options from external source. It allows raw JSON object or `<Option>`. It can pass multiple options by array when `multiple` is enabled.
- `minQueryLength` (optional): A length of typed characters to begin JSON request.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

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

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialUser` (optional): The initial user ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### [`<ConversationsSelect>`: Select menu with conversations list](https://api.slack.com/reference/messaging/block-elements#conversation-select)

A select menu with options consisted of any type of conversations in the current workspace.

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialConversation` (optional): The initial conversation ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### [`<ChannelsSelect>`: Select menu with channel list](https://api.slack.com/reference/messaging/block-elements#channel-select)

A select menu with options consisted of public channels in the current workspace.

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialChannel` (optional): The initial channel ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for [multi-select] menu

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

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

- `name` / `actionId` (optional): An identifier for the action.
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

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialDate` (optional): An initially selected date. It allows `YYYY-MM-DD` formatted string, UNIX timestamp in millisecond, and JavaScript [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### Props for modal's input

As same as [select-like elements](#usage-in-modal-container), `<DatePicker>` also can place as children of `<Modal>` by passing required props.

```jsx
<Modal title="My App">
  <DatePicker label="Date" name="date" />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Date%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Atrue%2C%22element%22%3A%7B%22type%22%3A%22datepicker%22%2C%22action_id%22%3A%22date%22%7D%7D%5D&mode=modal)

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](#input-block).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

## Components for modal

### [`<Input>`: Plain-text input element](https://api.slack.com/reference/block-kit/block-elements#input) <a name="input-element" id="input-element">(Only for modal)</a>

`<Input>` block element is for placing a single-line input form within `<Modal>`. It can place as children of `<Modal>` directly.

It has a interface similar to `<input>` HTML element and `<input>` intrinsic HTML element also works as well, but the biggest difference is required `label` prop for [`<Input>` layout block](#input-block).

```jsx
<Modal title="My App">
  <Input label="Title" name="title" maxLength={80} required />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Title%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22title%22%2C%22max_length%22%3A80%7D%7D%5D&mode=modal)

This is same for the other inputable elements too. In children of `<Modal>`, please take care to define `label` prop into them.

#### <a name="input-element-props" id="input-element-props">Props (Block element)</a>

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier for [`<Input>` layout block](#input-block).
- `name` / `actionId` (optional): A string of unique identifier for the action.
- `type` (optional): `text` by default.
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `placeholder` (optional): Specify a text string appears within the content of input is empty. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.
- `value` (optional): An initial value for plain-text input.
- `maxLength` (optional): The maximum number of characters allowed for the input element. It must up to 3000 character.
- `minLength` (optional): The minimum number of characters allowed for the input element.

> :information_source: Internally this is syntactic sugar for [`<Input>` layout block](#input-block) with [a plain-text input](https://api.slack.com/reference/block-kit/block-elements#input).

### `<Input type="hidden">`: Store hidden values to modal

By using `<Input type="hidden">`, you can assign hidden values as a private metadata JSON of modal with a familiar way in HTML form.

```jsx
<Modal title="modal">
  <Input type="hidden" name="foo" value="bar" />
  <Input type="hidden" name="userId" value={123} />
  <Input type="hidden" name="data" value={[{ hidden: 'value' }]} />

  <Input name="name" label="Name" />
</Modal>
```

The above example indicates the same modal as following:

```jsx
<Modal
  title="modal"
  privateMetadata={JSON.stringify({
    foo: 'bar',
    userId: 123,
    data: [{ hidden: 'value' }],
  })}
>
  <Input name="name" label="Name" />
</Modal>
```

You can use hidden values by parsing JSON stored in [callbacked `private_metadata` from Slack](https://api.slack.com/block-kit/surfaces/modals#private_metadata).

`privateMetadata` prop in parent `<Modal>` _must not define_ when using `<Input type="hidden">`. `<Modal>` prefers `privateMetadata` than `<Input type="hidden">` whenever it has any value in `privateMetadata` prop.

And please take care that the maximum length validation by Slack will still apply for stringified JSON. The value like string and array that cannot predict the length might over the limit of JSON string length easily (3000 characters).

The best practice is only storing the value of a pointer to reference data stored elsewhere. _It's better not to store complex data as hidden value directly._

#### Props

- `type` (**required**): Must be `hidden`.
- `name` (**required**): The name of hidden value.
- `value` (**required**): A value to store into modal. It must be [a serializable value to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description).

### `<Input type="submit">`: Set submit button text of modal

`<Input type="submit">` can set the label of submit button for the current modal. It is meaning just an alias into `submit` prop of `<Modal>`, but JSX looks like more natural HTML form.

```jsx
<Modal title="Example">
  <Input name="name" label="Name" />
  <Input type="submit" value="Send" />
</Modal>
```

As same as `<Input type="hidden">`, `submit` prop in `<Modal>` must not define when using `<Input type="submit">`. `<Modal>` prefers props defined directly.

#### Props

- `type` (**required**): Must be `submit`.
- `value` (**required**): A string of submit button for the current modal. (24 characters maximum)

### `<Textarea>`: Plain-text input element with multiline (Only for modal)

`<Textarea>` component has very similar interface to [`<Input>` block element](#input-element). An only difference is to allow multi-line input.

```jsx
<Modal title="My App">
  <Textarea
    label="Tweet"
    name="tweet"
    placeholder="What’s happening?"
    maxLength={280}
    required
  />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Tweet%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22tweet%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22What%E2%80%99s%20happening%3F%22%2C%22emoji%22%3Afalse%7D%2C%22multiline%22%3Atrue%2C%22max_length%22%3A280%7D%7D%5D&mode=modal)

`<textarea>` intrinsic HTML element also works as well.

#### Props

It's exactly same as [`<Input>` block element](#input-element-props).

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

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block elements
