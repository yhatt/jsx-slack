###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers

# Block containers

[Slack provides multiple surfaces](https://api.slack.com/surfaces) to place Block Kit [layout blocks](layout-blocks.md). So you should choose the parent container component depending on purpose.

## <a name="blocks" id="blocks"></a> [`<Blocks>`: The basic container for messages](https://api.slack.com/surfaces/messages)

A basic container component for Block Kit suited to [messages](https://api.slack.com/surfaces/messages). Wrap layout block components in `<Blocks>`.

When composing message for using in API such as [`chat.postMessage`](https://api.slack.com/methods/chat.postMessage), you should pass generated array by `<Blocks>` container component to `blocks` field in payloads.

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

## <a name="modal" id="modal"></a> [`<Modal>`: The view container for modals](https://api.slack.com/surfaces/modals)

The container component for [modals](https://api.slack.com/block-kit/surfaces/modals). You can build view payload for modal through JSX.

A generated object by `<Modal>` container should pass to a `view` field in [`views.*`](https://api.slack.com/methods/views.open) API payloads.

```javascript
api.views.open({
  // NOTE: trigger_id received from interaction is required.
  trigger_id: 'xxxxx.xxxxx.xxxxxxxxxxxx',
  view: JSXSlack(
    <Modal title="My first modal">
      <Section>Hello, modal!</Section>
    </Modal>
  ),
})
```

In addition to [layout blocks](layout-blocks.md), `<Modal>` container can place [input components](block-elements.md#input-components-for-modal) as the children directly. So you can compose blocks for modal with predictable JSX template inspired from HTML form.

```jsx
/** @jsx JSXSlack.h */
import JSXSlack, { Modal, ConversationsSelect } from '@speee-js/jsx-slack'

export default function shareModal(opts) {
  return JSXSlack(
    <Modal title="Share" close="Cancel">
      <img src={opts.url} alt="image" />

      <input type="text" name="subject" label="Subject" required />
      <textarea name="comment" label="Comment" maxLength={500} />
      <ConversationsSelect name="shareWith" label="Share with..." required />

      <input type="hidden" name="userId" value={opts.userId} />
      <input type="submit" value="Share" />
    </Modal>
  )
}
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=modal&view=%7B%22type%22%3A%22modal%22%2C%22title%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%22%2C%22emoji%22%3Atrue%7D%2C%22submit%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%22%2C%22emoji%22%3Atrue%7D%2C%22close%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Cancel%22%2C%22emoji%22%3Atrue%7D%2C%22blocks%22%3A%5B%7B%22type%22%3A%22image%22%2C%22alt_text%22%3A%22image%22%2C%22image_url%22%3A%22https%3A%2F%2Fsource.unsplash.com%2Frandom%2F1200x400%22%7D%2C%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Subject%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22subject%22%7D%7D%2C%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Comment%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Atrue%2C%22element%22%3A%7B%22type%22%3A%22plain_text_input%22%2C%22action_id%22%3A%22comment%22%2C%22multiline%22%3Atrue%2C%22max_length%22%3A500%7D%7D%2C%7B%22type%22%3A%22input%22%2C%22label%22%3A%7B%22type%22%3A%22plain_text%22%2C%22text%22%3A%22Share%20with...%22%2C%22emoji%22%3Atrue%7D%2C%22optional%22%3Afalse%2C%22element%22%3A%7B%22type%22%3A%22conversations_select%22%2C%22action_id%22%3A%22shareWith%22%7D%7D%5D%7D)

### Props

- `title` (**required**): An user-facing title of the modal. (24 characters maximum)
- `close` (optional): A text for close button of the modal. (24 characters maximum)
- `submit` (optional): A text for submit button of the modal. The value specified in this prop is preferred than [`<Input type="submit">`](block-elements.md#input-submit) (24 characters maximum)
- `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received. The value specified in this prop is preferred than [`<Input type="hidden">`](block-elements.md#input-hidden). (3000 characters maximum)
- `clearOnClose` (optional): If enabled by setting `true`, all stacked views will be cleared by close button.
- `notifyOnClose` (optional): If enabled by setting `true`, `view_closed` event will be sent to request URL of Slack app when closed modal.
- `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)
- `externalId` (optional): A unique ID for all views on a per-team basis.

> :information_source: Slack requires the submit text when modal has component for inputs, so jsx-slack would set the text "Submit" as the default value of `submit` prop if you are setting no submit text in any way together with using input components.

## <a name="home" id="home"></a> [`<Home>`: The view container for home tabs](https://api.slack.com/surfaces/tabs)

The container component for [home tabs](https://api.slack.com/surfaces/tabs). You can build view payload for home tab.

A generated object by `<Home>` container should pass to a view field in [`views.publish`](https://api.slack.com/methods/views.publish) API payloads.

```javascript
api.views.publish({
  user_id: 'UXXXXXXXX',
  view: JSXSlack(
    <Home>
      <Section>Welcome to my home!</Section>
    </Home>
  ),
})
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />](https://api.slack.com/tools/block-kit-builder?mode=appHome&view=%7B%22type%22%3A%22home%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Welcome%20to%20my%20home!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D%7D)

### Props

- `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received. (3000 characters maximum)
- `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)
- `externalId` (optional): A unique ID for all views on a per-team basis.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers
