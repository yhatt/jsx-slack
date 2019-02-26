# jsx-slack

Build JSON objects for [Slack] API from readable HTML-like [JSX].

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

## Install

```bash
# npm
npm install --save @speee/jsx-slack
```

```bash
# yarn
yarn add @speee/jsx-slack
```

## Block Kit as component

Slack has recommended to use **[Block Kit]** for building tempting message. By using jsx-slack, you can build a template with piling up Block Kit blocks by JSX. It is feeling like using components in React or Vue.

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

[<img src="docs/slack-example.png" width="193" />][block-kit-builder-example]

[<img src="docs/preview-btn.svg" width="240" />][block-kit-builder-example]

[block-kit-builder-example]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Hello%2C%20*Yuki%20Hattori*!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D

## JSX component

### Blocks

#### `<Block>`

A container component to use Block Kit. You should wrap Block Kit elements by `<Block>`.

#### [`<Section>`: Section Block](https://api.slack.com/reference/messaging/blocks#section)

Display a simple text message. You have to specify the content as children. It allows [formatting with HTML-like elements](#html-like-formatting).

`<section>` intrinsic HTML element works as well.

```jsx
<Block>
  <Section>Hello, world!</Section>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Hello%2C%20world!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

##### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

##### Accessory

The content of `<Section>` may include one of an accessory component. A defined element will show in side-by-side of text.

```jsx
<Block>
  <Section>
    You can add an image next to text in this block. :point_right:
    <Image src="https://placekitten.com/256/256" alt="Accessory image" />
  </Section>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22You%20can%20add%20an%20image%20next%20to%20text%20in%20this%20block.%20%3Apoint_right%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%0A%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22Accessory%20image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F256%2F256%22%7D%7D%5D)

###### Accessory components

- [`<Image>`](#image-image-block)
- [`<Button>`](#button-button-element)
- [`<Select>`](#select-select-menu-with-static-options)
- [`<ExternalSelect>`](#externalselect-select-menu-with-external-data-source)
- [`<UsersSelect>`](#usersselect-select-menu-with-user-list)
- [`<ConversationsSelect>`](#conversationsselect-select-menu-with-conversations-list)
- [`<ChannelsSelect>`](#channelsselect-select-menu-with-channel-list)
- [`<Overflow>`](#overflow-overflow-menu)
- [`<DatePicker>`](#datepicker-select-date-from-calendar)

##### `<Field>`: Fields for section block

In addition the text content, the section block also can use 2 columns texts called fields. In jsx-slack, you can define field by `<Field>` component in `<Section>` block.

```jsx
<Block>
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
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22About%20this%20repository%3A%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%2C%22accessory%22%3A%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22Speee%2C%20Inc.%22%2C%22image_url%22%3A%22https%3A%2F%2Fgithub.com%2Fspeee.png%22%7D%2C%22fields%22%3A%5B%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Name*%5Cnspeee%2Fjsx-slack%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Maintainer*%5CnYuki%20Hattori%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Organization*%5CnSpeee%2C%20Inc.%22%2C%22verbatim%22%3Atrue%7D%5D%7D%5D)

> Contents of `<Field>` would be placed after the main text contents even if placed them anywhere.

#### [`<Divider>`: Divider Block](https://api.slack.com/reference/messaging/blocks#divider)

Just a divider. `<hr>` intrinsic HTML element works as well.

```jsx
<Block>
  <Divider />
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22divider%22%7D%5D)

##### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

#### [`<Image>`: Image Block](https://api.slack.com/reference/messaging/blocks#image)

Display an image block. It has well-known props like `<img>` HTML element.

In `<Block>`, `<img>` intrinsic HTML element works as well.

```jsx
<Block>
  <Image src="https://placekitten.com/500/500" alt="So cute kitten." />
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22So%20cute%20kitten.%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F500%2F500%22%7D%5D)

##### Props

- `src` (**required**): The URL of the image.
- `alt` (**required**): A plain-text summary of the image.
- `title` (optional): An optional title for the image.
- `id` / `blockId` (optional): A string of unique identifier of block.

#### [`<Actions>`: Actions Block](https://api.slack.com/reference/messaging/blocks#actions)

A block to hold [interactive elements](#interactive-elements). Slack allows a maximum of 25 interactive elements in `<Actions>` (But recommends to place up to 5 elements).

##### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

#### [`<Context>`: Context Block](https://api.slack.com/reference/messaging/blocks#context)

Display message context. It allows mixed contents consisted of the text and the `<img>` tag image.

```jsx
<Block>
  <Context>
    <img src="https://placekitten.com/100/100" alt="Kitten" />
    A kitten and
    <img src="https://placekitten.com/100/100" alt="Kitten" />
    more kitten.
  </Context>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22context%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F100%2F100%22%2C%22alt_text%22%3A%22Kitten%22%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22A%20kitten%20and%22%2C%22verbatim%22%3Atrue%7D%2C%7B%22type%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fplacekitten.com%2F100%2F100%22%2C%22alt_text%22%3A%22Kitten%22%7D%2C%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22more%20kitten.%22%2C%22verbatim%22%3Atrue%7D%5D%7D%5D)

> :warning: Slack restricts the number of elements consisted of text content and image up to 10. jsx-slack throws error if the number of generated elements is going over the limit.

##### Props

- `id` / `blockId` (optional): A string of unique identifier of block.

### Interactive elements

Some blocks may include the interactive component to exchange info with Slack app.

#### [`<Button>`: Button element](https://api.slack.com/reference/messaging/block-elements#button)

A simple button to send action to registered Slack App, or open external URL.

```jsx
<Block>
  <Actions>
    <Button actionId="action" value="value">
      Action button
    </Button>
    <Button url="https://example.com/">Link to URL</Button>
  </Actions>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Action%20button%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22action%22%2C%22value%22%3A%22value%22%7D%2C%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Link%20to%20URL%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Fexample.com%2F%22%7D%5D%7D%5D)

##### Props

- `actionId` (optional): An identifier for the action.
- `value` (optional): A string value to send to Slack App when clicked button.
- `url` (optional): URL to load when clicked button.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

#### [`<Select>`: Select menu with static options](https://api.slack.com/reference/messaging/block-elements#static-select)

A menu element with static options passed by `<Option>` or `<Optgroup>`. It has a interface similar to `<select>` HTML element.

```jsx
<Block>
  <Actions>
    <Select actionId="rating" placeholder="Rate it!">
      <Option value="5">5 :star::star::star::star::star:</Option>
      <Option value="4">4 :star::star::star::star:</Option>
      <Option value="3">3 :star::star::star:</Option>
      <Option value="2">2 :star::star:</Option>
      <Option value="1">1 :star:</Option>
    </Select>
  </Actions>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22static_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Rate%20it!%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22rating%22%2C%22options%22%3A%5B%7B%22value%22%3A%225%22%2C%22text%22%3A%7B%22text%22%3A%225%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%224%22%2C%22text%22%3A%7B%22text%22%3A%224%20%3Astar%3A%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%223%22%2C%22text%22%3A%7B%22text%22%3A%223%20%3Astar%3A%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%222%22%2C%22text%22%3A%7B%22text%22%3A%222%20%3Astar%3A%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%221%22%2C%22text%22%3A%7B%22text%22%3A%221%20%3Astar%3A%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%5D%7D%5D)

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `value` (optional): A value of item to show initially. It must choose value from defined `<Option>` elements in children.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

##### `<Option>`: Menu item

###### Props

- `value` (**required**): A string value to send to Slack App when choose item.

##### `<Optgroup>`: Group of menu items

```jsx
<Block>
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
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22static_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Action...%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22action%22%2C%22option_groups%22%3A%5B%7B%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Search%20with%22%2C%22emoji%22%3Atrue%7D%2C%22options%22%3A%5B%7B%22value%22%3A%22search_google%22%2C%22text%22%3A%7B%22text%22%3A%22Google%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22search_bing%22%2C%22text%22%3A%7B%22text%22%3A%22Bing%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22search_duckduckgo%22%2C%22text%22%3A%7B%22text%22%3A%22DuckDuckGo%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%2C%7B%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%20to%22%2C%22emoji%22%3Atrue%7D%2C%22options%22%3A%5B%7B%22value%22%3A%22share_facebook%22%2C%22text%22%3A%7B%22text%22%3A%22Facebook%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%2C%7B%22value%22%3A%22share_twitter%22%2C%22text%22%3A%7B%22text%22%3A%22Twitter%22%2C%22type%22%3A%22plain_text%22%2C%22emoji%22%3Atrue%7D%7D%5D%7D%5D%7D%5D%7D%5D)

###### Props

- `label` (**required**): A plain text to be shown as a group name.

#### [`<ExternalSelect>`: Select menu with external data source](https://api.slack.com/reference/messaging/block-elements#external-select)

You should use `<ExternalSelect>` if you want to provide the dynamic list from external source.

It requires setup JSON entry URL in your Slack app. [Learn about external source in Slack documentation.](https://api.slack.com/reference/messaging/block-elements#external-select)

```jsx
<Block>
  <Actions>
    <ExternalSelect
      actionId="category"
      placeholder="Select category..."
      minQueryLength={2}
    />
  </Actions>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22external_select%22%2C%22placeholder%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Select%20category...%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22category%22%2C%22min_query_length%22%3A2%7D%5D%7D%5D)

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialOption` (optional): An initial option exactly matched to provided options from external source. It allows raw JSON object or `<Option>`.
- `minQueryLength` (optional): A length of typed characters to begin JSON request.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

#### [`<UsersSelect>`: Select menu with user list](https://api.slack.com/reference/messaging/block-elements#users-select)

A select menu with options consisted of users in the current workspace.

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialUser` (optional): The initial user ID.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

#### [`<ConversationsSelect>`: Select menu with conversations list](https://api.slack.com/reference/messaging/block-elements#conversation-select)

A select menu with options consisted of any type of conversations in the current workspace.

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialConversation` (optional): The initial conversation ID.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

#### [`<ChannelsSelect>`: Select menu with channel list](https://api.slack.com/reference/messaging/block-elements#channel-select)

A select menu with options consisted of public channels in the current workspace.

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialChannel` (optional): The initial channel ID.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog.

#### [`<Overflow>`: Overflow menu](https://api.slack.com/reference/messaging/block-elements#overflow)

An overflow menu displayed as `...` can access to some hidden menu items by many actions. _It must contain least of 2 `<OverflowItem>` components._

```jsx
<Block>
  <Actions>
    <Overflow actionId="overflow_menu">
      <OverflowItem value="share">Share</OverflowItem>
      <OverflowItem value="reply">Reply message</OverflowItem>
      <OverflowItem url="https://example.com/">Open in browser</OverflowItem>
    </Overflow>
  </Actions>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22overflow%22%2C%22action_id%22%3A%22overflow_menu%22%2C%22options%22%3A%5B%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%22%2C%22emoji%22%3Atrue%7D%2C%22value%22%3A%22share%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Reply%20message%22%2C%22emoji%22%3Atrue%7D%2C%22value%22%3A%22reply%22%7D%2C%7B%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Open%20in%20browser%22%2C%22emoji%22%3Atrue%7D%2C%22url%22%3A%22https%3A%2F%2Fexample.com%2F%22%7D%5D%7D%5D%7D%5D)

##### Props

- `actionId` (optional): An identifier for the action.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog when clicked menu item.

##### `<OverflowItem>`: Menu item in overflow menu

###### Props

- `value` (optional): A string value to send to Slack App when choose item.
- `url` (optional): URL to load when clicked button.

#### [`<DatePicker>`: Select date from calendar](https://api.slack.com/reference/messaging/block-elements#datepicker)

An easy way to let the user selecting any date is using `<DatePicker>` component.

```jsx
<Block>
  <Actions>
    <DatePicker actionId="date_picker" initialDate={new Date()} />
  </Actions>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22datepicker%22%2C%22action_id%22%3A%22date_picker%22%2C%22initial_date%22%3A%222019-02-22%22%7D%5D%7D%5D)

##### Props

- `actionId` (optional): An identifier for the action.
- `placeholder` (optional): A plain text to be shown at first.
- `initialDate` (optional): An initially selected date. It allows `YYYY-MM-DD` formatted string and JavaScript [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance.
- `confirm` (optional): [`<Confirm>` element](#confirm-confirmation-dialog) to show confirmation dialog when clicked menu item.

### Components for [composition objects](https://api.slack.com/reference/messaging/composition-objects)

#### [`<Confirm>`: Confirmation dialog](https://api.slack.com/reference/messaging/composition-objects#confirm)

Define confirmation dialog. Some interactive elements can open confirmation dialog when selected, by passing `<Confirm>` to `confirm` prop.

```jsx
<Block>
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
</Block>
```

[<img src="docs/confirmation.png" width="500" />][confirmation]

[<img src="docs/preview-btn.svg" width="240" />][confirmation]

[confirmation]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22actions%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22button%22%2C%22text%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Commit%22%2C%22emoji%22%3Atrue%7D%2C%22action_id%22%3A%22commit%22%2C%22confirm%22%3A%7B%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Commit%20your%20action%22%2C%22emoji%22%3Atrue%7D%2C%22text%22%3A%7B%22type%22%3A%22mrkdwn%22%2C%22text%22%3A%22*Are%20you%20sure%3F*%20Please%20confirm%20your%20action%20again.%22%2C%22verbatim%22%3Atrue%7D%2C%22confirm%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Yes%2C%20please%22%2C%22emoji%22%3Atrue%7D%2C%22deny%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%7D%2C%22value%22%3A%22value%22%7D%5D%7D%5D

##### Props

- `title` (**required**): The title of confirmation dialog.
- `confirm` (**required**): A text content of the button to confirm.
- `deny` (**required**): A text content of the button to cancel.

## HTML-like formatting

Slack can format message by very rational short syntaxes called "mrkdwn". On the other hand, someone might yearn for a template engine with clear tag definition like HTML, especially when building a complex message.

jsx-slack has HTML-compatible JSX elements to format messages. It might be verbose as a text, but would give readablity by well-known HTML elements.

You may also use a regular mrkdwn syntax to format if necessary.

### Format text style

- `<i>`, `<em>`: _Italic text_
- `<b>`, `<strong>`: **Bold text**
- `<s>`, `<strike>`, `<del>`: ~~Strikethrough text~~
- `<code>`: `Inline code`

### Line breaks

As same as HTML, line breaks in JSX will be ignored, and replace to a single whitespace. You shoud use `<br />` tag in this case.

### HTML block contents

- `<p>` tag just makes a blank line around contents. Slack would render it as like as paragraph.
- `<blockquote>` adds `>` character to the first of each lines for highlighting as quote.
- `<pre>` tag will recognize the content as formatted-text, and wrapped content by ` ``` ` .

#### List simulation

We can simulate the list provided from `<ul>` and `<oi>` tag by using mimicked text.

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

jsx-slack will not recognize URL-like string as hyperlink. You should use `<a href="">` if you want using a link.

For example, `<a href="https://example.com/">Link</a>` will be converted to `<https://example.com/|Link>`, and rendered as like as "[Link](https://example.com)".

#### To Slack channel

`<a href="#C024BE7LR" />` means a link to Slack channel. You have to set **_PUBLIC_ channel's ID, not channel name,** as an anchor. [Refer details to documentation by Slack](https://api.slack.com/messaging/composing/formatting#linking-channels) for more details.

If defined what except URL as `href` attribute, _you cannot use a custom content because Slack would fill the content automatically._ Unlike HTML specification, `<a>` tag allows to use as void element `<a />`.

#### Mention to user and user group

As like as channel link, `<a href="@U024BE7LH" />` means a mention to specified user.

jsx-slack can mention to user groups with a same syntax `<a href="@SAZ94GDB8" />` by detecting user group ID prefixed `S`.

Of course, we also support special mentions like `@here`, `@channel`, and `@everyone`.

### Date formatting

[Slack supports date formatting for localization by timezone.](https://api.slack.com/messaging/composing/formatting#date-formatting) jsx-slack also support it by HTML5 `<time>` tag.

```jsx
<time datetime="1392734382">{'Posted {date_num} {time_secs}'}</time>
// => "<!date^1392734382^Posted {date_num} {time_secs}|Posted 2014-02-18 14:39:42 PM>"

<time datetime="1392734382">{'{date} at {time}'}</time>
// => "<!date^1392734382^{date} at {time}|February 18th, 2014 at 14:39 PM>"

<a href="https://example.com/">
  <time datetime="1392734382" fallback="Feb 18, 2014 PST">
    {'{date_short}'}
  </time>
</a>
// => "<!date^1392734382^{date_short}^https://example.com/|Feb 18, 2014 PST>"
```

An optional fallback text may specify via additional `fallback` attribute. If it is not defined, jsx-slack will generate the fallback text in UTC from template string.

### Correspondence table

#### Basics

|            jsx-slack             |       Slack mrkdwn        |
| :------------------------------: | :-----------------------: |
|         `<i>Italic</i>`          |        `_Italic_`         |
|        `<em>Italic</em>`         |        `_Italic_`         |
|          `<b>Bold</b>`           |         `*Bold*`          |
|     `<strong>Bold</strong>`      |         `*Bold*`          |
|         `<s>Strike</s>`          |        `~Strike~`         |
|       `<del>Strike</del>`        |        `~Strike~`         |
|        `Line<br />break`         |       `Line\nbreak`       |
|      `<p>foo</p><p>bar</p>`      |       `foo\n\nbar`        |
| `<blockquote>quote</blockquote>` |       `&gt; quote`        |
|       `<code>code</code>`        |       `` `code` ``        |
|   `<pre>{'code\nblock'}</pre>`   | ` ```\ncode\nblock\n``` ` |
|     `<ul><li>List</li></ul>`     |         `• List`          |

#### Links

|                  jsx-slack                   |            Slack mrkdwn            |
| :------------------------------------------: | :--------------------------------: |
|  `<a href="https://example.com/">Link</a>`   |   `<https://example.com/\|Link>`   |
| `<a href="mailto:mail@example.com">Mail</a>` | `<mailto:mail@example.com/\|Mail>` |
|          `<a href="#C024BE7LR" />`           |           `<#C024BE7LR>`           |
|          `<a href="@U024BE7LH" />`           |           `<@U024BE7LH>`           |
|          `<a href="@SAZ94GDB8" />`           |       `<!subteam^SAZ94GDB8>`       |
|             `<a href="@here" />`             |          `<!here\|here>`           |
|           `<a href="@channel" />`            |       `<!channel\|channel>`        |
|           `<a href="@everyone" />`           |      `<!everyone\|everyone>`       |

## About escape

jsx-slack are making effort to be focusable only to contents of your message. Nevertheless, we may require you to consider escaping contents.

### Special characters

We think that anyone never wants to care about special characters for Slack mrkdwn while using jsx-slack. But unfortunately, Slack does not provide how to escape special characters for formatting text. :thinking:

The content would break when JSX contents may have mrkdwn special characters like `*` `_` `~` `` ` `` `>`.

#### `<Escape>`: Escape special characters

To battle against breaking message, we provide `<Escape>` component to replace special characters into another similar character.

```jsx
<Block>
  <Section>&gt; *bold* _italic_ ~strikethrough~ `code`</Section>
  <Section>
    <Escape>&gt; *bold* _italic_ ~strikethrough~ `code`</Escape>
  </Section>
</Block>
```

[<img src="docs/preview-btn.svg" width="240" />](https://bit.ly/2SSNLtz)

**By using `<Escape>`, please notice that it may change characters in contents.** jsx-slack will leave mrkdwn by default to avoid unintended contents interpolation via escape. _We recommend using `<Escape>` only to unpredictable contents like made by users._

##### Details

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

### Exact mode

Some special characters will work only in breaks of words. Take a look this example:

```jsx
<Block>
  <Section>
    Super<i>cali</i>fragilistic<b>expiali</b>docious
  </Section>
</Block>
```

We expect showing the post as follow:

> Super*cali*fragilistic**expiali**docious

However, Slack renders as:

> Super_cali_fragilistic\*expiali\*docious

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Super_cali_fragilistic*expiali*docious%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

You can deal workaround via `SlackJSX.exactMode(true)`. It can enable formatting forcibly by inserting zero-width space around special chars.

[<img src="docs/preview-btn.svg" width="240" />](https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Super%E2%80%8B_%E2%80%8Bcali%E2%80%8B_%E2%80%8Bfragilistic%E2%80%8B*%E2%80%8Bexpiali%E2%80%8B*%E2%80%8Bdocious%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D)

**Exact mode is a last resort.** _We recommend dealing with incorrect rendering by such as inserting spaces around markup elements._

## Similar projects

- [slack-jsx](https://github.com/zcei/slack-jsx) - Compose Slack messages from JSX Components instead of writing JSON.

## Author

Managed by [<img src="https://github.com/speee.png" alt="Speee, Inc." width="24" height="24" valign="bottom" /> Speee, Inc.](https://speee.jp) ([@speee](https://github.com/speee))

- <img src="https://github.com/yhatt.png" alt="@yhatt" width="24" height="24" valign="bottom" /> Yuki Hattori ([@yhatt](https://github.com/yhatt)) - Maintainer

## Licnese

[MIT License](LICENSE)
