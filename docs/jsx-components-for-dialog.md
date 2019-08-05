# JSX components for dialog

Dialog components provide from another entry point **`@speee-js/jsx-slack/dialog`** because the specification is different from Block Kit.

Thus, you have to import `JSXSlack` and dialog components from 2 entries normally.

```javascript
/** @jsx JSXSlack.h */
import JSXSlack from '@speee-js/jsx-slack'
import { Dialog, Input, Textarea } from '@speee-js/jsx-slack/dialog'
```

## `<Dialog>`: Create dialog JSON

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

### Props

- `callbackId` (**required**): A string of identifier for dialog. (255 characters maximum)
- `title` (**required**): An user-facing title of dialog. (24 characters maximum)
- `state` (optional): An optional string that will be echoed back to Slack app after interacting with dialog. The value specified in this prop is preferred than `<Input type="hidden">`. (3000 characters maximum)
- `submitLabel` (optional): A string of submit button for dialog. The value specified in this prop is preferred than `<Input type="submit">`. (24 characters maximum)
- `notifyOnCancel` (optional): A boolean attribute whether notify to Slack app on canceling dialog interaction by user. `false` by default.

## `<Input>`

Input element is used mainly for adding text field to dialog. It has almost same interface with `<input>` HTML element.

In fact, a behavior of `<Input>` component varies depending on `type` prop. The default type is `text`.

### `<Input type="text">`: Text field

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

- `name` (**required**):
- `label` (**required**):
- `type` (optional): `text` by default. You can use `text` and [additional HTML5 types](#html5-types), `email`, `number`, `tel`, and `url`.
- `placeholder` (optional):
- `required` (optional):
- `title` / `hint` (optional):
- `value` (optional):
- `maxLength` (optional):
- `minLength` (optional):

#### HTML5 types

- `<Input type="email">`
- `<Input type="number">`
- `<Input type="tel">`
- `<Input type="url">`

These types are same as `type="text"` except the appropriate subtype will be passed to Slack. These types allow using a suitable on-screen keyboard in mobile device.

> :warning: Slack never validate the input value. `type` prop is using only for selecting the best keyboard to input.

### `<Input type="hidden">`: Pass JSON state

### `<Input type="submit">`: Set the label of submit button

## `<Textarea>`

## `<Select>`

### `<Option>`

### `<Optgroup>`

## `<ExternalSelect>`

### `<SelectFragment>`

## `<UsersSelect>`

## `<ConversationsSelect>`

## `<ChannelsSelect>`
