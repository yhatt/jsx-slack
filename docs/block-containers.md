###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers

# Block containers

[Slack provides multiple surfaces](https://api.slack.com/surfaces) to place Block Kit [layout blocks](layout-blocks.md). So you should choose the parent container component depending on purpose.

## <a name="user-content-blocks" id="blocks"></a> [`<Blocks>`: The basic container for messages](https://api.slack.com/surfaces/messages)

A basic container component for Block Kit suited to [messages](https://api.slack.com/surfaces/messages). Wrap layout block components in `<Blocks>`.

When composing message for using in API such as [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage), you should pass generated array by `<Blocks>` container component to `blocks` field in payloads.

```javascript
import { WebClient } from '@slack/client'
import { JSXSlack, Blocks, Section } from 'jsx-slack'

const api = new WebClient(process.env.SLACK_TOKEN)

api.chat.postMessage({
  channel: 'C1234567890',
  blocks: (
    <Blocks>
      <Section>Hello, world!</Section>
    </Blocks>
  ),
})
```

## <a name="user-content-modal" id="modal"></a> [`<Modal>`: The view container for modals](https://api.slack.com/surfaces/modals)

The container component for [modals](https://api.slack.com/block-kit/surfaces/modals). You can build view payload for modal through JSX.

A generated object by `<Modal>` container should pass to a `view` field in [`views.*`](https://api.slack.com/methods/views.open) API payloads.

```javascript
api.views.open({
  // NOTE: trigger_id received from interaction is required.
  trigger_id: 'xxxxx.xxxxx.xxxxxxxxxxxx',
  view: (
    <Modal title="My first modal">
      <Section>Hello, modal!</Section>
    </Modal>
  ),
})
```

In addition to [layout blocks](layout-blocks.md), `<Modal>` container can place [input components](block-elements.md#input-components) as the children directly. So you can compose blocks for modal with predictable JSX template inspired from HTML form.

```jsx
/** @jsx JSXSlack.h */
import { JSXSlack, Modal, ConversationsSelect } from 'jsx-slack'

export const shareModal = (opts) => (
  <Modal title="Share" close="Cancel">
    <img src={opts.url} alt="image" />

    <input type="text" name="subject" label="Subject" required />
    <textarea name="comment" label="Comment" maxLength={500} />
    <ConversationsSelect name="shareWith" label="Share with..." required />

    <input type="hidden" name="userId" value={opts.userId} />
    <input type="submit" value="Share" />
  </Modal>
)
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJxdUclOwzAQvfcrLH9AkpaWpUpyyQkJThXiPHVGsZGXYI9L-HsmpaHAyX6jeZumfg49WEGGLDbyoCGiFMqGxKgDr9DKdiVEbdwgUlSN1ERj2pdlCjkqLLJPo4WkCxVcGcH3_Kw3VTVtq0oKsNRI42Bg0bJdnYX8mEnQ58gGhBNJ4cHxP-XjGyqGFo5oOcqCI75nE7GfBZg_czgkXGhs69Bfad2CHUxP6AfSjdzNUb7ZXfAnjAnIBJ8OaNlh8Z-rvxrS1wTzRHzwqCiKvzn-F9Gm79EvVXLC-NhLcQKbGb5U683Ndnd7d_-wxPjN5eLO0M_25QS8V5fn27Rf0kWHnw==)

### Props

- `type` (optional): Set a type of modal.
  - [`modal`](https://api.slack.com/reference/surfaces/views) _(default)_: The regular modal surface.
  - [`workflow_step`](https://api.slack.com/reference/workflows/configuration-view): The modal surface for [custom workflow step](https://api.slack.com/workflows/steps).

* `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received (3000 characters maximum). [By setting function, you can use the custom transformer to serialize hidden values set up via `<Input type="hidden">`](block-elements.md#custom-transformer).
* `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)

#### Props for `modal` type

- `title` (**required**): An user-facing title of the modal. (24 characters maximum)
- `close` (optional): A text for close button of the modal. (24 characters maximum)
- `submit` (optional): A text for submit button of the modal. The value specified in this prop is preferred than [`<Input type="submit">`](block-elements.md#input-submit) (24 characters maximum)
- `clearOnClose` (optional): If enabled by setting `true`, all stacked views will be cleared by close button.
- `notifyOnClose` (optional): If enabled by setting `true`, `view_closed` event will be sent to request URL of Slack app when closed modal.
- `externalId` (optional): A unique ID for all views on a per-team basis.

> :information_source: Slack requires the submit text when modal has component for inputs, so jsx-slack would set the text "Submit" as the default value of `submit` prop if you are setting no submit text in any way together with using input components.

#### Props for `workflow_step` type

- `submit` (optional): By setting as `false`, the submit button will be disabled _until one or more inputs have filled_. It is corresponding with [`submit_disabled` field in a configuration view object](https://api.slack.com/reference/workflows/configuration-view).

## <a name="user-content-home" id="home"></a> [`<Home>`: The view container for home tabs](https://api.slack.com/surfaces/tabs)

The container component for [home tabs](https://api.slack.com/surfaces/tabs). You can build view payload for home tab.

A generated object by `<Home>` container should pass to a view field in [`views.publish`](https://api.slack.com/methods/views.publish) API payloads.

```javascript
api.views.publish({
  user_id: 'UXXXXXXXX',
  view: (
    <Home>
      <Section>Welcome to my home!</Section>
    </Home>
  ),
})
```

[<img src="./preview-btn.svg" width="240" />](https://jsx-slack.netlify.app/#bkb:jsx:eJyz8cjPTbXjUlCwCU5NLsnMz7MLT81JBooplOQr5FYqZACZijb6MEkuG32wBgD3vRIW)

As same as `<Modal>`, `<Home>` can place [input components](block-elements.md#input-components) as the direct child.

### Props

- `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received. (3000 characters maximum) [By setting function, you can use the custom transformer to serialize hidden values set up via `<Input type="hidden">`](block-elements.md#custom-transformer).
- `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)
- `externalId` (optional): A unique ID for all views on a per-team basis.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers
