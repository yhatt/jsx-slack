###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers

# Block containers

Slack provides [multiple surfaces to place Block Kit blocks](https://api.slack.com/block-kit/surfaces). So you should choose the parent container component depending on purpose.

## <a name="blocks" id="blocks"></a> `<Blocks>`: The basic container for blocks

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

## <a name="modal" id="modal"></a> `<Modal>`: The modal view container

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

### Props

- `title` (**required**): An user-facing title of the modal. (24 characters maximum)
- `close` (optional): A text for close button of the modal. (24 characters maximum)
- `submit` (optional): A text for submit button of the modal. The value specified in this prop is preferred than [`<Input type="submit">`](#input-typesubmit-set-submit-button-text-of-modal) (24 characters maximum)
- `privateMetadata` (optional): An optional string that can be found in payloads of some interactive events Slack app received. The value specified in this prop is preferred than [`<Input type="hidden">`](#input-typehidden-store-hidden-values-to-modal). (3000 characters maximum)
- `clearOnClose` (optional): If enabled by setting `true`, all stacked views will be cleared by close button.
- `notifyOnClose` (optional): If enabled by setting `true`, `view_closed` event will be sent to request URL of Slack app when closed modal.
- `callbackId` (optional): An identifier for this modal to recognize it in various events. (255 characters maximum)
- `externalId` (optional): A unique ID for all views on a per-team basis.

> :information_source: Slack requires the submit text when modal has component for inputs, so jsx-slack would set the text "Submit" as the default value of `submit` prop if you are setting no submit text in any way together with using input components.

---

###### [Top](../README.md) &raquo; [JSX components for Block Kit](jsx-components-for-block-kit.md) &raquo; Block containers
