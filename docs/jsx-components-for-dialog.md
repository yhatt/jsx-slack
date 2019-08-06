# JSX components for dialog

Dialog components provide from another entry point **`@speee-js/jsx-slack/dialog`** because the specification is different from Block Kit.

Thus, you have to import `JSXSlack` and dialog components from 2 entries normally.

```javascript
/** @jsx JSXSlack.h */
import JSXSlack from '@speee-js/jsx-slack'
import { Dialog, Input, Textarea } from '@speee-js/jsx-slack/dialog'
```

### `DialogValidationError`

The dialog JSON is very sensitive to the length of each fields. Slack returns error and does not open dialog if an invalid JSON was passed to `dialog.open` API.

Therefore jsx-slack will validate JSON in the client side, and throws `DialogValidationError` if detected invalid value. You can detect invalid JSON before sending to Slack API.

```jsx
/** @jsx JSXSlack.h */
import JSXSlack from '@speee-js/jsx-slack'
import {
  Dialog,
  DialogValidationError,
  Input,
} from '@speee-js/jsx-slack/dialog'

export default function exampleDialog(name) {
  try {
    return JSXSlack(
      <Dialog callbackId="example" title="Example">
        <Input name="name" label="Name" value={name} required />
      </Dialog>
    )
  } catch (e) {
    if (e instanceof DialogValidationError && name) {
      // Fallback to empty default value to avoid name validation error
      return exampleDialog(undefined)
    } else {
      throw e
    }
  }
}
```

## [`<Dialog>`: Create dialog JSON](https://api.slack.com/dialogs#top-level_dialog_attributes)

A container component to build dialog JSON. You should wrap 1-10 dialog element(s) by `<Dialog>`.

```jsx
<Dialog
  callbackId="createAccount"
  title="Create account"
  state="id:1"
  submitLabel="Create"
  notifyOnCancel={true}
>
  ...
</Dialog>
```

#### Props

- `callbackId` (**required**): A string of identifier for dialog. (255 characters maximum)
- `title` (**required**): An user-facing title of dialog. (24 characters maximum)
- `state` (optional): An optional string that will be echoed back to Slack app after interacting with dialog. The value specified in this prop is preferred than `<Input type="hidden">`. (3000 characters maximum)
- `submitLabel` (optional): A string of submit button for dialog. The value specified in this prop is preferred than `<Input type="submit">`. (24 characters maximum)
- `notifyOnCancel` (optional): A boolean attribute whether notify to Slack app on canceling dialog interaction by user. `false` by default.

## `<Input>`

Input element is used mainly for adding text field to dialog. It has almost same interface with `<input>` HTML element. An important difference is required `label` prop to define the label of element.

The behavior of `<Input>` component varies depending on `type` prop (`text` by default).

### [`<Input type="text">`: Text field](https://api.slack.com/dialogs#text_elements)

```jsx
<Dialog callbackId="example" title="Example">
  <Input type="text" name="name" label="Name" required />
  <Input
    name="id"
    label="Your ID"
    placeholder="Optional (Generate automatically if empty)"
    title="Up to 16 characters."
    maxLength={16}
  />
</Dialog>
```

#### Props

- `name` (**required**): The name of input element. (48 characters maximum)
- `label` (**required**): The label string for input element. (300 characters maximum)
- `type` (optional): `text` by default. You can use `text` and [additional HTML5 types](#html5-types), `email`, `number`, `tel`, and `url` as the input element.
- `placeholder` (optional): Specify a text string appears within the content of input is empty. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether user must fill any value. `false` by default for HTML compatibility, and _it is different from Slack's default._
- `title` / `hint` (optional): Specify a helpful text appears under the input element. `title` is alias to `hint` prop for keeping HTML compatibility. (150 characters maximum)
- `value` (optional): The default value for this element. (150 characters maximum)
- `maxLength` (optional): The maximum number of characters allowed for the input element. It must up to 150 character.
- `minLength` (optional): The minimum number of characters allowed for the input element. It must up to 150 character.

##### HTML5 types

- `<Input type="email" />`
- `<Input type="number" />`
- `<Input type="tel" />`
- `<Input type="url" />`

These types are same as `type="text"` except the appropriate subtype will be passed to Slack. These types allow using a suitable on-screen keyboard in mobile device.

> :warning: Slack never validate the input value. `type` prop is using only for selecting the best keyboard to input.

### `<Input type="hidden">`: Pass JSON state

By using `<Input type="hidden">`, you can assign hidden values as JSON for the dialog state with a familiar way in HTML form.

```jsx
<Dialog callbackId="example" title="Example">
  <Input type="hidden" name="foo" value="bar" />
  <Input type="hidden" name="userId" value={123} />
  <Input type="hidden" name="data" value={[{ hidden: 'value' }]} />

  <Input type="text" name="name" label="Name" />
</Dialog>
```

The above example indicates the same dialog as following:

```jsx
<Dialog
  callbackId="example"
  title="Example"
  state={JSON.stringify({
    foo: 'bar',
    userId: 123,
    data: [{ hidden: 'value' }],
  })}
>
  <Input type="text" name="name" label="Name" />
</Dialog>
```

You can use hidden values by parsing JSON stored in callbacked `state` prop.

**`state` prop in parent `<Dialog>` must not define when using `<Input type="hidden">`.** The parent dialog prefers `state` prop than `<Input type="hidden">` whenever it has any value in `state` prop.

And please take care that the maximum length validation will still apply for stringified JSON. The value like string and array that cannot predict the length might over the limit of JSON string length easily (3000 characters).

[As Slack recommends](https://api.slack.com/dialogs#state), the best practice is only storing the value of a pointer to reference data stored elsewhere. _Don't store sensitive data as state and hidden value directly._

#### Props

- `type` (**required**): Must be `hidden`.
- `name` (**required**): The name of hidden value.
- `value` (**required**): A hidden value to store as the dialog state. It must be [a serializable value to JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description).

### `<Input type="submit">`: Set the label of submit button

`<Input type="submit">` can set the label of submit button for current dialog. It is meaning just an alias to `submitLabel` prop of `<Dialog>`, but JSX looks like more natural HTML form.

```jsx
<Dialog callbackId="example" title="Example">
  <Input type="text" name="name" label="Name" />
  <Input type="submit" value="Submit!" />
</Dialog>
```

As you guessed, it is same as below:

```jsx
<Dialog callbackId="example" title="Example" submitLabel="Submit!">
  <Input type="text" name="name" label="Name" />
</Dialog>
```

As like as `hidden` type, **`submitLabel` prop in `<Dialog>` must not define when using `<Input type="submit">`.** The dialog component prefers props defined directly.

#### Props

- `type` (**required**): Must be `submit`.
- `value` (**required**): A string of submit button for current dialog. (24 characters maximum)

## [`<Textarea>`: Textarea field](https://api.slack.com/dialogs#textarea_elements)

Puts multiline text field as same as `<textarea>` HTML element.

```jsx
<Dialog callbackId="example" title="Example">
  <Textarea name="content" label="Content" required />
  <Textarea
    name="tweet"
    label="Tweet"
    placeholder="Optional..."
    title="You can tweet about published content."
    maxLength={140}
  />
</Dialog>
```

#### Props

- `name` (**required**): The name of textarea element. (48 characters maximum)
- `label` (**required**): The label string for textarea element. (300 characters maximum)
- `subtype` (optional): The subtype for textarea element that can choose from `email`, `number`, `tel`, and `url`. [As like as `type` prop in `<Input>`](#html5-types), it's useful for typing with better keyboard in mobile device.
- `placeholder` (optional): Specify a text string appears within the content of textarea is empty. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether user must fill any value. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the textarea element. `title` is alias to `hint` prop. (150 characters maximum)
- `value` (optional): The default value for this element. (3000 characters maximum)
- `maxLength` (optional): The maximum number of characters allowed for the textarea element. It must up to 3000 character.
- `minLength` (optional): The minimum number of characters allowed for the textarea element. It must up to 3000 character.

## [`<Select>`: Select field with static options](https://api.slack.com/dialogs#select_elements)

> :information_source: `<Select>` and similar components are provided to [Block Kit](./jsx-components-for-block-kit.md##select-select-menu-with-static-options) too. There is a difference in the specification of input props and output JSON between Block Kit and dialog. So you must exactly use components imported from `@speee-js/jsx-slack/dialog`, not `@speee-js/jsx-slack`.

Provides select field to pick single one from multiple static options passed by `<Option>` or `<Optgroup>`. It has a interface similar to `<select>` HTML element.

```jsx
<Dialog callbackId="example" title="Example">
  <Select name="rating" label="Rating" required>
    <Option value="5">5 {':star:'.repeat(5)}</Option>
    <Option value="4">4 {':star:'.repeat(4)}</Option>
    <Option value="3">3 {':star:'.repeat(3)}</Option>
    <Option value="2">2 {':star:'.repeat(2)}</Option>
    <Option value="1">1 {':star:'.repeat(1)}</Option>
  </Select>
</Dialog>
```

`<Select>` allows containing up to 100 options.

#### Props

- `name` (**required**): The name of select element. (48 characters maximum)
- `label` (**required**): The label string for select element. (300 characters maximum)
- `placeholder` (optional): Specify a text string appears when the option is not selected. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether user must select any option. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the select element. `title` is alias to `hint` prop. (150 characters maximum)
- `value` (optional): The default value for this element. (75 characters maximum)

### `<Option>`: Option item

Define an option item for `<Select>` and `<Optgroup>`. The text content of element will be used as the label of item. (75 characters maximum)

#### Props

- `value` (**required**): A string value for this option. (75 characters maximum)

### `<Optgroup>`: Group of options

```jsx
<Dialog callbackId="example" title="Example">
  <Select name="favorite_pet" label="Favorite pet">
    <Optgroup label="Dog">
      <Option value="labrador">Labrador</Option>
      <Option value="german_shepherd">German Shepherd</Option>
      <Option value="golden_retriver">Golden Retriever</Option>
      <Option value="bulldog">Bulldog</Option>
    </Optgroup>
    <Optgroup label="Cat">
      <Option value="scottish_fold">Scottish Fold</Option>
      <Option value="american_shorthair">American Shorthair</Option>
      <Option value="munchkin">Munchkin</Option>
      <Option value="russian_blue">Russian Blue</Option>
    </Optgroup>
  </Select>
</Dialog>
```

#### Props

- `label` (**required**): The label string for the group of options. (75 characters maximum)

## [`<ExternalSelect>`: Select field with external data source](https://api.slack.com/dialogs#dynamic_select_elements_external)

You should use `<ExternalSelect>` if you want to provide options from external source dynamically.

It requires setting up URL for external source in your Slack app. [Learn about an external source in Slack documentation.](https://api.slack.com/dialogs#dynamic_select_elements_external)

```jsx
<Dialog callbackId="example" title="Example">
  <ExternalSelect
    name="category"
    label="Category"
    placeholder="Select category..."
    initialOption={<Option value="unknown">Unknown</Option>}
    minQueryLength={2}
    required
  />
</Dialog>
```

#### Props

- `name` (**required**): The name of select element. (48 characters maximum)
- `label` (**required**): The label string for select element. (300 characters maximum)
- `placeholder` (optional): Specify a text string appears when the option is not selected. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether user must select any option. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the select element. `title` is alias to `hint` prop. (150 characters maximum)
- `initialOption` (optional): An initial option exactly matched to provided options from external source. It allows raw JSON object or `<Option>`.
- `minQueryLength` (optional): A length of typed characters to begin JSON request.

### `<SelectFragment>`: Generate options for external source

`<SelectFragment>` can create JSON object for external data source usable in `<ExternalSelect>`. As same as `<Select>`, please include static options by using `<Option>` or `<Optgroup>`.

```jsx
<SelectFragment>
  <Option value="foo">Foo</Option>
  <Option value="bar">Bar</Option>
</SelectFragment>
```

### Example: Serve external source with [Slack bolt](https://slack.dev/bolt)

This is a practical example providing external source with selection narrowing through [Slack Bolt](https://slack.dev/bolt).

```javascript
/** @jsx JSXSlack.h */
import { App } from '@slack/bolt'
import JSXSlack from '@speee-js/jsx-slack'
import { SelectFragment, Option } from '@speee-js/jsx-slack/dialog'

const codenames = {
  cupcake: 'Cupcake',
  donut: 'Donut',
  eclair: 'Eclair',
  froyo: 'Froyo',
  gingerbread: 'Gingerbread',
  honeycomb: 'Honeycomb',
  iceCreamSandwich: 'Ice Cream Sandwich',
  JellyBean: 'Jelly Bean',
  kitKat: 'KitKat',
  lollipop: 'Lollipop',
  marshmallow: 'Marshmallow',
  nougat: 'Nougat',
  oreo: 'Oreo',
  pie: 'Pie',
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

// React to external select in <Dialog callbackId="android">
app.options({ callback_id: 'android' }, ({ options, ack }) => {
  const query = options.value.toLowerCase()

  ack(
    JSXSlack(
      <SelectFragment>
        {Object.keys(codenames).map(
          code =>
            codenames[code].toLowerCase().startsWith(query) && (
              <Option value={code}>{codenames[code]}</Option>
            )
        )}
      </SelectFragment>
    )
  )
})

// Start Bolt server
;(async () => {
  const port = process.env.PORT || 8080

  await app.start(port)
  consolt.log(`Bolt server is running on port ${port}.`)
})()
```

Please set up "Options Load URL" in [your app](https://api.slack.com/apps) :arrow_forward: `Interactive Components` :arrow_forward: `Message Menus` to `https://your-hosted-app.url/slack/events`. (e.g. [ngrok](https://ngrok.com/) URL + `/slack/events` for testing on local)

## [`<UsersSelect>`: Select field with user list](https://api.slack.com/dialogs#dynamic_select_elements_users)

#### Props

- `name` (**required**): The name of select element. (48 characters maximum)
- `label` (**required**): The label string for select element. (300 characters maximum)
- `placeholder` (optional): Specify a text string appears when user is not selected. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether it must be selected any user. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the select element. `title` is alias to `hint` prop. (150 characters maximum)
- `initialUser` (optional): The initial user ID.

## [`<ConversationsSelect>`: Select field with conversations](https://api.slack.com/dialogs#dynamic_select_elements_channels_conversations)

#### Props

- `name` (**required**): The name of select element. (48 characters maximum)
- `label` (**required**): The label string for select element. (300 characters maximum)
- `placeholder` (optional): Specify a text string appears when conversation is not selected. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether it must be selected any conversation. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the select element. `title` is alias to `hint` prop. (150 characters maximum)
- `initialConversation` (optional): The initial conversation ID.

## [`<ChannelsSelect>`: Select field with channels](https://api.slack.com/dialogs#dynamic_select_elements_channels_conversations)

#### Props

- `name` (**required**): The name of select element. (48 characters maximum)
- `label` (**required**): The label string for select element. (300 characters maximum)
- `placeholder` (optional): Specify a text string appears when channel is not selected. (150 characters maximum)
- `required` (optional): A boolean prop to specify whether it must be selected any channel. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the select element. `title` is alias to `hint` prop. (150 characters maximum)
- `initialChannel` (optional): The initial channel ID.
