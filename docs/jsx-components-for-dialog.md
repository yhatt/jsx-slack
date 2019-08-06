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

## `<Dialog>`: [Create dialog JSON](https://api.slack.com/dialogs#top-level_dialog_attributes)

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

### `<Input type="text">`: [Text field](https://api.slack.com/dialogs#text_elements)

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

- `name` (**required**): The name of input element. (48 character maximum)
- `label` (**required**): The label string for input element. (300 character maximum)
- `type` (optional): `text` by default. You can use `text` and [additional HTML5 types](#html5-types), `email`, `number`, `tel`, and `url` as the input element.
- `placeholder` (optional): Specify a text string appears within the content of input is empty. (150 character maximum)
- `required` (optional): A boolean prop to specify whether user must fill any value. `false` by default for HTML compatibility, and _it is different from Slack's default._
- `title` / `hint` (optional): Specify a helpful text appears under the input element. `title` is alias to `hint` prop for keeping HTML compatibility. (150 character maximum)
- `value` (optional): The default value for this element. (150 character maximum)
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

## `<Textarea>`: [Textarea field](https://api.slack.com/dialogs#textarea_elements)

Put multiline text field as same as `<textarea>` HTML element.

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

- `name` (**required**): The name of textarea element. (48 character maximum)
- `label` (**required**): The label string for textarea element. (300 character maximum)
- `subtype` (optional): The subtype for textarea element that can choose from `email`, `number`, `tel`, and `url`. [As like as `type` prop in `<Input>`](#html5-types), it's useful for typing with better keyboard in mobile device.
- `placeholder` (optional): Specify a text string appears within the content of textarea is empty. (150 character maximum)
- `required` (optional): A boolean prop to specify whether user must fill any value. `false` by default.
- `title` / `hint` (optional): Specify a helpful text appears under the textarea element. `title` is alias to `hint` prop. (150 character maximum)
- `value` (optional): The default value for this element. (3000 character maximum)
- `maxLength` (optional): The maximum number of characters allowed for the textarea element. It must up to 3000 character.
- `minLength` (optional): The minimum number of characters allowed for the textarea element. It must up to 3000 character.

## `<Select>`

### `<Option>`

### `<Optgroup>`

## `<ExternalSelect>`

### `<SelectFragment>`

## `<UsersSelect>`

## `<ConversationsSelect>`

## `<ChannelsSelect>`
