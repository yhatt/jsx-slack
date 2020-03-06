###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block elements

# Block elements

Slack provides some **[block elements](https://api.slack.com/reference/block-kit/block-elements)** that may include in [layout blocks](layout-blocks.md). e.g. interactive components to exchange information with Slack app.

## Interactive components

### <a name="button" id="button"></a> [`<Button>`: Button element](https://api.slack.com/reference/messaging/block-elements#button)

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
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

### <a name="select" id="select"></a> [`<Select>`: Select menu with static options](https://api.slack.com/reference/messaging/block-elements#static_select)

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

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `value` (optional): A value of item to show initially. It must choose value from defined `<Option>` elements in children. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

#### Multiple select

By defining `multiple` attribute, you also can provide [the selectable menu from multiple options][multi-select] with an appearance is similar to button or text input. The same goes for other select-like components.

[multiple select]: #multiple-select
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

> :warning: **Slack does not allow to place the multi-select menu in `Actions` block.** So jsx-slack throws error if you're trying to use `multiple` attribute in the children of `<Actions>`.

##### Props for [multiple select]

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

#### As [an input component for modal](#input-components-for-modal)

In `<Modal>` container, select-like components will work as [the input component for modal](#input-components-for-modal) by passing suitable props such as required `label` prop. Thereby it would allow natural templating like as HTML form.

```jsx
<Modal title="Programming survey">
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

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Programming%20survey%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Submit%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22hint%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Pick%20language%20you%20want%20to%20learn.%22%2C%22emoji%22%3Atrue%7D%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Language%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22static_select%22%2C%22action_id%22%3A%22language%22%2C%22options%22%3A%5B%7B%22value%22%3A%22javascript%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22JavaScript%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22python%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Python%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22java%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Java%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22c-sharp%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22C%23%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22php%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22PHP%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%7D%5D%7D)

The above JSX means exactly same as following usage of [`<Input>` layout block](layout-blocks.md#input):

<!-- prettier-ignore-start -->

```jsx
<Modal title="Programming survey">
  <Input label="Language" title="Pick language you want to learn." required>
    <Select actionId="language">
      ...
    </Select>
  </Input>
</Modal>
```

<!-- prettier-ignore-end -->

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="option" id="option"></a> `<Option>`: Menu item

Define an item for `<Select>`. `<option>` intrinsic HTML element works as well.

#### Props

- `value` (**required**): A string value to send to Slack App when choose item.

### <a name="optgroup" id="optgroup"></a> `<Optgroup>`: Group of menu items

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

#### Props

- `label` (**required**): A plain text to be shown as a group name.

### <a name="external-select" id="external-select"></a> [`<ExternalSelect>`: Select menu with external data source](https://api.slack.com/reference/messaging/block-elements#external_select)

You should use `<ExternalSelect>` if you want to provide the dynamic list from external source.

It requires setup JSON entry URL in your Slack app. [Learn about external source in Slack documentation.](https://api.slack.com/reference/messaging/block-elements#external_select)

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
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

##### Props for [multiple select]

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="select-fragment" id="select-fragment"></a> `<SelectFragment>`: Generate options for external source

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

### <a name="users-select" id="users-select"></a> [`<UsersSelect>`: Select menu with user list](https://api.slack.com/reference/messaging/block-elements#users_select)

A select menu with options consisted of users in the current workspace.

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialUser` (optional): The initial user ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

##### Props for [multiple select]

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="conversations-select" id="conversations-select"></a> [`<ConversationsSelect>`: Select menu with conversations list](https://api.slack.com/reference/messaging/block-elements#conversation_select)

A select menu with options consisted of any type of conversations in the current workspace.

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialConversation` (optional): The initial conversation ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

##### Props for [multiple select]

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="channels-select" id="channels-select"></a> [`<ChannelsSelect>`: Select menu with channel list](https://api.slack.com/reference/messaging/block-elements#channel_select)

A select menu with options consisted of public channels in the current workspace.

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialChannel` (optional): The initial channel ID. It can pass multiple string values by array when `multiple` is enabled.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

##### Props for [multiple select]

- `multiple` (optional): A boolean value that shows whether multiple options can be selected.
- `maxSelectedItems` (optional): A maximum number of items to allow selected.

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="overflow" id="overflow"></a> [`<Overflow>`: Overflow menu](https://api.slack.com/reference/messaging/block-elements#overflow)

An overflow menu displayed as `...` can access to some hidden menu items. It must contain 1 to 5 `<OverflowItem>` component(s).

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
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog when clicked menu item.

### <a name="overflow-item" id="overflow-item"></a> `<OverflowItem>`: Menu item in overflow menu

#### Props

- `value` (optional): A string value to send to Slack App when choose item.
- `url` (optional): URL to load when clicked button.

### <a name="date-picker" id="date-picker"></a> [`<DatePicker>`: Select date from calendar](https://api.slack.com/reference/messaging/block-elements#datepicker)

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
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

#### As [an input component for modal](#input-components-for-modal)

`<DatePicker>` also will work as [the input component for modal](#input-components-for-modal), and may place as the children of `<Modal>` by passing required props.

```jsx
<Modal title="My App">
  <DatePicker label="Date" name="date" />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22My%20App%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Submit%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Date%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Atrue%2C%22element%22%3A%7B%22type%22%3A%22datepicker%22%2C%22action_id%22%3A%22date%22%7D%7D%5D%7D)

##### Props for modal's input

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="checkbox-group" id="checkbox-group"></a> [`<CheckboxGroup>`: Checkbox group](https://api.slack.com/reference/block-kit/block-elements#checkboxes) (Only for modal and home tab)

A container for grouping checkboxes. _This component is only for [`<Modal>`](block-containers.md#modal) and [`<Home>`](block-containers.md#home) container. It cannot use in [`<Blocks>`](block-containers.md#blocks) container for messaging._

```jsx
<Home>
  <Section>
    <b>ToDo List</b>
    <CheckboxGroup actionId="todo">
      <Checkbox value="xxx-0001">
        <b>Learn about Slack app</b> (
        <time datetime={new Date(2020, 1, 24)}>{'{date}'}</time>)
        <small>
          <i>
            XXX-0001: <b>High</b>
          </i>
        </small>
      </Checkbox>
      <Checkbox value="xxx-0002">
        <b>Learn about jsx-slack</b> (
        <time datetime={new Date(2020, 1, 27)}>{'{date}'}</time>)
        <small>
          <i>
            XXX-0002: <b>Medium</b>
          </i>
        </small>
      </Checkbox>
      <Checkbox value="xxx-0003" checked>
        <s>
          <b>Prepare development environment</b> (
          <time datetime={new Date(2020, 1, 21)}>{'{date}'}</time>)
        </s>
        <small>
          <i>
            XXX-0003: <b>Medium</b>
          </i>
        </small>
      </Checkbox>
    </CheckboxGroup>
  </Section>
</Home>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](<https://api.slack.com/tools/block-kit-builder?mode=appHome&view=%7B%22type%22%3A%22home%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*ToDo%20List*%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%7B%22type%22%3A%22checkboxes%22%2C%22action_id%22%3A%22todo%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Learn%20about%20Slack%20app*%20(%3C!date%5E1582470000%5E%7Bdate%7D%7CFebruary%2023rd%2C%202020%3E)%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22xxx-0001%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_XXX-0001%3A%20*High*_%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Learn%20about%20jsx-slack*%20(%3C!date%5E1582729200%5E%7Bdate%7D%7CFebruary%2026th%2C%202020%3E)%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22xxx-0002%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_XXX-0002%3A%20*Medium*_%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22~*Prepare%20development%20environment*%20(%3C!date%5E1582210800%5E%7Bdate%7D%7CFebruary%2020th%2C%202020%3E)~%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22xxx-0003%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_XXX-0003%3A%20*Medium*_%22%2C%22verbatim%22%3Atrue%7D%7D%5D%2C%22initial_options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22~*Prepare%20development%20environment*%20(%3C!date%5E1582210800%5E%7Bdate%7D%7CFebruary%2020th%2C%202020%3E)~%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22xxx-0003%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_XXX-0003%3A%20*Medium*_%22%2C%22verbatim%22%3Atrue%7D%7D%5D%7D%7D%5D%7D>)

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `values` (optional): An array of value for initially selected checkboxes. They must match to `value` property in `<Checkbox>` elements in children.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

#### As [an input component for modal](#input-components-for-modal)

```jsx
<Modal title="Quick survey">
  <CheckboxGroup
    id="foods"
    name="foods"
    label="What do you want to eat for the party in this Friday?"
    required
  >
    <Checkbox value="burger">Burger :hamburger:</Checkbox>
    <Checkbox value="pizza">Pizza :pizza:</Checkbox>
    <Checkbox value="taco">Tex-Mex taco :taco:</Checkbox>
    <Checkbox value="sushi">Sushi :sushi:</Checkbox>
    <Checkbox value="others">
      Others
      <small>
        <i>Let me know in the below form.</i>
      </small>
    </Checkbox>
  </CheckboxGroup>
  <Input type="text" id="others" name="others" label="What do you want?" />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Quick%20survey%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Submit%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22block_id%22%3A%22foods%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22What%20do%20you%20want%20to%20eat%20for%20the%20party%20in%20this%20Friday%3F%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22checkboxes%22%2C%22action_id%22%3A%22foods%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Burger%20%3Ahamburger%3A%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22burger%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Pizza%20%3Apizza%3A%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22pizza%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Tex-Mex%20taco%20%3Ataco%3A%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22taco%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Sushi%20%3Asushi%3A%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22sushi%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Others%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22others%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_Let%20me%20know%20in%20the%20below%20form._%22%2C%22verbatim%22%3Atrue%7D%7D%5D%7D%7D%2C%7B%22type%22%3A%22input%22%2C%22block_id%22%3A%22others%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22What%20do%20you%20want%3F%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Atrue%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22others%22%7D%7D%5D%7D)

##### Props for modal's input

- `label` (**required**): The label string for the group.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the group.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="checkbox" id="checkbox"></a> `<Checkbox>`: Checkbox

A checkbox item. It must place in the children of `<CheckboxGroup>`.

It supports raw [mrkdwn format](https://api.slack.com/reference/surfaces/formatting) / [HTML-like formatting](./html-like-formatting.md) in the both of contents and `description` property.

```jsx
<Checkbox
  value="checkbox"
  description={
    <Fragment>
      XXX-1234 - <i>by Yuki Hattori</i>
    </Fragment>
  }
>
  <b>Checkbox item</b>: foobar
</Checkbox>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=appHome&view=%7B%22type%22%3A%22home%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22checkboxes%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Checkbox%20item*%3A%20foobar%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22checkbox%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22XXX-1234%20-%20_by%20Yuki%20Hattori_%22%2C%22verbatim%22%3Atrue%7D%7D%5D%7D%5D%7D%5D%7D)

> :information_source: [Links and mentions through `<a>` tag](https://github.com/speee/jsx-slack/blob/master/docs/html-like-formatting.md#links) will be ignored by Slack.

#### Props

- `value` (**required**): A string value to send to Slack App when choosing the checkbox.
- `description` (optional): A description string or JSX element for the current checkbox. It can see with faded color just below the main label. `<Checkbox>` prefers this prop than redirection by `<small>`.
- `checked` (optional): A boolean value indicating the initial state of the checkbox. If it's not defined, the initial state is following `values` property in the parent `<CheckboxGroup>`.

#### Redirect `<small>` into description

`<Checkbox>` allows `<small>` element for ergonomic templating, to redirect the content into description when `description` prop is not defined.

A below checkbox is meaning exactly the same as an example shown earlier.

```jsx
<Checkbox value="checkbox">
  <b>Checkbox item</b>: foobar
  <small>
    XXX-1234 - <i>by Yuki Hattori</i>
  </small>
</Checkbox>
```

### <a name="radio-button-group" id="radio-button-group"></a> [`<RadioButtonGroup>`: Radio button group](https://api.slack.com/reference/block-kit/block-elements#radio) (Only for modal and home tab)

A container for grouping radio buttons. It provides easy control of the selected option through similar interface to [`<Select>`](#select).

_This component is only for [`<Modal>`](block-containers.md#modal) and [`<Home>`](block-containers.md#home) container. It cannot use in [`<Blocks>`](block-containers.md#blocks) container for messaging._

```jsx
<Home>
  <Section>
    Select the tier of our service:
    <RadioButtonGroup actionId="tier" value="free">
      <RadioButton value="free" description="$0!">
        <b>Free</b>
      </RadioButton>
      <RadioButton
        value="standard"
        description={
          <Fragment>
            $5/month, <b>and 30 days trial!</b>
          </Fragment>
        }
      >
        <b>Standard</b>
      </RadioButton>
      <RadioButton value="premium" description="$30/month">
        <b>Premium</b>
      </RadioButton>
      <RadioButton
        value="business"
        description={<i>Please contact to support.</i>}
      >
        <b>Business</b>
      </RadioButton>
    </RadioButtonGroup>
  </Section>
</Home>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=appHome&view=%7B%22type%22%3A%22home%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Select%20the%20tier%20of%20our%20service%3A%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%7B%22type%22%3A%22radio_buttons%22%2C%22action_id%22%3A%22tier%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Free*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22free%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%240!%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Standard*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22standard%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%245%2Fmonth%2C%20*and%2030%20days%20trial!*%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Premium*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22premium%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%2430%2Fmonth%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Business*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22business%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_Please%20contact%20to%20support._%22%2C%22verbatim%22%3Atrue%7D%7D%5D%2C%22initial_option%22%3A%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Free*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22free%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%240!%22%2C%22verbatim%22%3Atrue%7D%7D%7D%7D%5D%7D)

#### Props

- `name` / `actionId` (optional): An identifier for the action.
- `value` (optional): A value for initially selected option. It must match to `value` property in one of `<RadioButton>` elements in children.
- `confirm` (optional): [`<Confirm>` element](#confirm) to show confirmation dialog.

#### As [an input component for modal](#input-components-for-modal)

In `<Modal>` container, `<RadioButtonGroup>` can place as `<Modal>`'s direct child by passing `label` prop as same as the input component for modal.

```jsx
<Modal title="Preferences" close="Cancel">
  <RadioButtonGroup
    label="Notifications"
    id="notifications"
    name="notifications"
    title="Setting a frequency of notifications by app."
    value="all"
    required
  >
    <RadioButton value="all">
      All events
      <small>Notify all received events every time.</small>
    </RadioButton>
    <RadioButton value="summary">
      Daily summary
      <small>Send a daily summary at AM 9:30 every day.</small>
    </RadioButton>
    <RadioButton value="off">Off</RadioButton>
  </RadioButtonGroup>
  <Input type="submit" value="OK" />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Preferences%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22OK%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22block_id%22%3A%22notifications%22%2C%22hint%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Setting%20a%20frequency%20of%20notifications%20by%20app.%22%2C%22emoji%22%3Atrue%7D%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Notifications%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22radio_buttons%22%2C%22action_id%22%3A%22notifications%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22All%20events%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22all%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Notify%20all%20received%20events%20every%20time.%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Daily%20summary%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22summary%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Send%20a%20daily%20summary%20at%20AM%209%3A30%20every%20day.%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Off%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22off%22%7D%5D%2C%22initial_option%22%3A%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22All%20events%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22all%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Notify%20all%20received%20events%20every%20time.%22%2C%22verbatim%22%3Atrue%7D%7D%7D%7D%5D%7D)

##### Props for modal's input

- `label` (**required**): The label string for the group.
- `id` / `blockId` (optional): A string of unique identifier of [`<Input>` layout block](layout-blocks.md#input).
- `title`/ `hint` (optional): Specify a helpful text appears under the group.
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.

### <a name="radio-button" id="radio-button"></a> `<RadioButton>`: Radio button

An item of the radio button. It must place in the children of `<RadioButtonGroup>`.

It supports raw [mrkdwn format](https://api.slack.com/reference/surfaces/formatting) / [HTML-like formatting](./html-like-formatting.md) in the both of contents and `description` property.

```jsx
<RadioButton value="radio" description={<i>Description</i>}>
  <b>Radio button</b>
</RadioButton>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=appHome&view=%7B%22type%22%3A%22home%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22radio_buttons%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Radio%20button*%22%2C%22verbatim%22%3Atrue%7D%2C%22value%22%3A%22radio%22%2C%22description%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22_Description_%22%2C%22verbatim%22%3Atrue%7D%7D%5D%7D%5D%7D%5D%7D)

> :information_source: [Links and mentions through `<a>` tag](https://github.com/speee/jsx-slack/blob/master/docs/html-like-formatting.md#links) will be ignored by Slack.

#### Props

- `value` (**required**): A string value to send to Slack App when choosing the radio button.
- `description` (optional): A description string or JSX element for the current radio button. It can see with faded color just below the main label. `<RadioButton>` prefers this prop than redirection by `<small>`.

#### Redirect `<small>` into description

`<RadioButton>` allows `<small>` element for ergonomic templating, to redirect the text content into description when `description` prop is not defined.

A below radio button is meaning exactly the same as an example shown earlier.

```jsx
<RadioButton value="radio">
  <b>Radio button</b>
  <small>
    <i>Description</i>
  </small>
</RadioButton>
```

## [Composition objects](https://api.slack.com/reference/messaging/composition-objects)

### <a name="confirm" id="confirm"></a> [`<Confirm>`: Confirmation dialog](https://api.slack.com/reference/messaging/composition-objects#confirm)

Define confirmation dialog. Many interactive elements can open confirmation dialog when selected, by passing `<Confirm>` to `confirm` prop.

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

You can use [HTML-like formatting](./html-like-formatting.md) to the content of confirmation dialog. However, you have to be careful that _Slack ignores any line breaks and the content will render just in a line._

#### Props

- `title` (**required**): The title of confirmation dialog.
- `confirm` (**required**): A text content of the button to confirm.
- `deny` (**required**): A text content of the button to cancel.

### <a name="mrkdwn" id="mrkdwn"></a> [`<Mrkdwn>`: Text composition object for `mrkdwn` type](https://api.slack.com/reference/block-kit/composition-objects#text)

`<Mrkdwn>`, is a component for text composition object, can use as a child of components which support HTML-like formatting. Typically it would be used when needed to set `verbatim` property explicitly.

Setting `verbatim` to `false` will tell Slack to auto-convert links, conversation names, and certain mentions to be linkified and automatically parsed. If `verbatim` set to true Slack will skip any preprocessing.

```jsx
<Blocks>
  {/* Section block */}
  <Section>
    <Mrkdwn verbatim={false}>https://example.com/</Mrkdwn>
  </Section>

  {/* Section block with fields */}
  <Section>
    <Field>
      <Mrkdwn verbatim={false}>#general</Mrkdwn>
    </Field>
  </Section>

  {/* Context block */}
  <Context>
    <Mrkdwn verbatim={false}>@here</Mrkdwn>
    Hello!
  </Context>

  {/* Confirm composition object */}
  <Actions>
    <Button
      confirm={
        <Confirm title="Commit your action" confirm="Yes, please" deny="Cancel">
          <Mrkdwn verbatim={false}>
            <b>@foobar</b> Are you sure?
          </Mrkdwn>
        </Confirm>
      }
    >
      Button
    </Button>
  </Actions>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=message&blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22https%3A%2F%2Fexample.com%2F%22%2C%22verbatim%22%3Afalse%7D%7D%2C%7B%22type%22%3A%22section%22%2C%22fields%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%23general%22%2C%22verbatim%22%3Afalse%7D%5D%7D%2C%7B%22type%22%3A%22context%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22%40here%22%2C%22verbatim%22%3Afalse%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22Hello!%22%2C%22verbatim%22%3Atrue%7D%5D%7D%2C%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Button%22%2C%22emoji%22%3Atrue%7D%2C%22confirm%22%3A%7B%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Commit%20your%20action%22%2C%22emoji%22%3Atrue%7D%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*%40here*%20Are%20you%20sure%3F%22%2C%22verbatim%22%3Afalse%7D%2C%22confirm%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Yes%2C%20please%22%2C%22emoji%22%3Atrue%7D%2C%22deny%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%7D%7D%5D%7D%5D)

<!-- INFO: We have no example in checkbox due to meaningless: Slack will be ignored links and mentions in checkbox. -->

#### Note

_Slack recommends disabling automatic parsing on text composition components and they have made it clear that they might deprecate this feature in the future._ More information can be found [here](https://api.slack.com/reference/surfaces/formatting#why_you_should_consider_disabling_automatic_parsing).

jsx-slack will disable automatic parsing by default even if you were not used `<Mrkdwn>` specifically. If possible, **we recommend never to use `<Mrkdwn>`** in Slack app created newly with jsx-slack.

#### Props

- `verbatim`: (optional): A boolean prop whether to disable automatic parsing for links, conversation names, and mentions by Slack.

## Input components for modal

**Input components** are available only for [`<Modal>`](block-containers.md#modal). These include a part of [interactive components](#interactive-components) and dedicated components such as [`<Input>`](#input) and [`<Textarea>`](#textarea).

All of input components **must be placed as the children of `<Modal>`, and defining `label` prop is required.** (for [`<Input>` layout block](layout-blocks.md#input))

The list of input components is following:

- [`<Input>`](#input) / `<input>`
- [`<Textarea>`](#textarea) / `<textarea>`
- [`<Select>`](#select) / `<select>`
- [`<ExternalSelect>`](#external-select)
- [`<UsersSelect>`](#users-select)
- [`<ConversationsSelect>`](#conversations-select)
- [`<ChannelsSelect>`](#channels-select)
- [`<DatePicker>`](#date-picker)
- [`<CheckboxGroup>`](#checkbox-group)
- [`<RadioButtonGroup>`](#radio-button-group)

### <a name="input" id="input"></a> [`<Input>`: Plain-text input element](https://api.slack.com/reference/block-kit/block-elements#input)

`<Input>` component is for placing a single-line input form within `<Modal>`. It can place as children of `<Modal>` directly.

It has an interface similar to `<input>` HTML element and `<input>` intrinsic HTML element also works as well, but must be defined `label` prop as mentioned above.

```jsx
<Modal title="My App">
  <Input label="Title" name="title" maxLength={80} required />
</Modal>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22My%20App%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Submit%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Title%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22title%22%2C%22max_length%22%3A80%7D%7D%5D%7D)

#### <a name="input-props" id="input-props"></a> Props

- `label` (**required**): The label string for the element.
- `id` / `blockId` (optional): A string of unique identifier for [`<Input>` layout block](layout-blocks.md#input).
- `name` / `actionId` (optional): A string of unique identifier for the action.
- `type` (optional): `text` by default.
- `title`/ `hint` (optional): Specify a helpful text appears under the element.
- `placeholder` (optional): Specify a text string appears within the content of input is empty. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether any value must be filled when user confirms modal.
- `value` (optional): An initial value for plain-text input.
- `maxLength` (optional): The maximum number of characters allowed for the input element. It must up to 3000 character.
- `minLength` (optional): The minimum number of characters allowed for the input element.

### <a name="input-hidden" id="input-hidden"></a> `<Input type="hidden">`: Store hidden values to modal

By using `<Input type="hidden">`, you can assign hidden values as the private metadata JSON of modal with a familiar way in HTML form.

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

#### Note

`<Modal>` prefers the string defined in `privateMetadata` prop directly than `<Input type="hidden">`.

And please take care that the maximum length validation by Slack will still apply for stringified JSON. The value like string and array that cannot predict the length might over the limit of JSON string length easily (3000 characters).

The best practice is only storing the value of a pointer to reference data stored elsewhere. _It's better not to store complex data as hidden value directly._

#### Props

- `type` (**required**): Must be `hidden`.
- `name` (**required**): The name of hidden value.
- `value` (**required**): A value to store into modal. It must be [a serializable value to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description).

#### Custom transformer

If you want to store hidden values by own way, you can use a custom transformer by passing function to `privateMetadata` prop in the parent `<Modal>`.

```jsx
<Modal
  title="test"
  privateMetadata={hidden => hidden && new URLSearchParams(hidden).toString()}
>
  <Input type="hidden" name="A" value="foobar" />
  <Input type="hidden" name="B" value={123} />
  <Input type="hidden" name="C" value={true} />
</Modal>
```

In this example, the value of `private_metadata` field in returned payload would be **`A=foobar&B=123&C=true`** by transformation using [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) instead of `JSON.stringify`.

The transformer takes an argument: JSON object of hidden values or `undefined` when there was no hidden values. It must return the transformed string, or `undefined` if won't assign private metadata.

### <a name="input-submit" id="input-submit"></a> `<Input type="submit">`: Set submit button text of modal

`<Input type="submit">` can set the label of submit button for the current modal. It is meaning just an alias into `submit` prop of `<Modal>`, but JSX looks like more natural HTML form.

```jsx
<Modal title="Example">
  <Input name="name" label="Name" />
  <Input type="submit" value="Send" />
</Modal>
```

`submit` prop in `<Modal>` must not define when using `<Input type="submit">`. `<Modal>` prefers the prop defined directly.

#### Props

- `type` (**required**): Must be `submit`.
- `value` (**required**): A string of submit button for the current modal. (24 characters maximum)

### <a name="textarea" id="textarea"></a> `<Textarea>`: Plain-text input element with multiline

`<Textarea>` component has very similar interface to [`<Input>` input component](#input). An only difference is to allow multi-line input.

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

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22My%20App%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Submit%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Tweet%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22tweet%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22What%E2%80%99s%20happening%3F%22%2C%22emoji%22%3Afalse%7D%2C%22multiline%22%3Atrue%2C%22max_length%22%3A280%7D%7D%5D%7D)

`<textarea>` intrinsic HTML element also works as well.

#### Props

It's exactly same as [`<Input>` component](#input-props), except `type` prop.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block elements
