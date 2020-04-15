# jsx-slack

[![CircleCI](https://img.shields.io/circleci/project/github/speee/jsx-slack/master.svg?logo=circleci)][circleci]
[![Codecov](https://img.shields.io/codecov/c/github/speee/jsx-slack/master.svg?logo=codecov)](https://codecov.io/gh/speee/jsx-slack)
[![npm](https://img.shields.io/npm/v/@speee-js/jsx-slack.svg?logo=npm)][npm]
[![LICENSE](https://img.shields.io/github/license/speee/jsx-slack.svg)][license]

[circleci]: https://circleci.com/gh/speee/jsx-slack/
[npm]: https://www.npmjs.com/package/@speee-js/jsx-slack
[license]: ./LICENSE

Build JSON object for [Slack][slack] [block kit] surfaces from readable [JSX].

[slack]: https://slack.com
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[react]: https://reactjs.org/
[block kit]: https://api.slack.com/block-kit
[block kit builder]: https://api.slack.com/tools/block-kit-builder

<p align="center">
  <img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/jsx.png" width="550"><br />
  <img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/slack-notification.png" width="532">
</p>

:point_right: **[Try our REPL demo](https://speee-jsx-slack.netlify.app/)** in https://speee-jsx-slack.netlify.app/.

### Features

:sparkles: **We have sparkling jsx-slack v2!** :sparkles: **[▶︎ See highlights of v2](docs/highlights/v2.md)**

- **[Block Kit as components](docs/jsx-components-for-block-kit.md)** - Build contents for any surfaces by composing components for Block Kit with JSX.
- **[HTML-like formatting](docs/html-like-formatting.md)** - Keep a readability by using well-known elements.

See **[references](#references)** to dive into jsx-slack deeply.

## Motivation

When developing Slack-integrated app, continuous maintenance of the rich contents is a difficult task. A team member must read and write JSON with deep knowledge about specifications of payload for Slack API.

Slack has shipped [Block Kit] and [Block Kit Builder], and efforts to develop app easily. We believe well-known JSX-based template would enhance a developer experience of Slack app to the next stage.

## Project goal

A project goal is creating an interface to compose maintainable contents for Slack with confidence via readable [JSX].

jsx-slack would allow composing blocks with predictable HTML-like markup. It helps in understanding the structure of complex contents and interactions.

## Install

We require Node.js >= 10. If you are using TypeScript, we also require TS >= 3.7.

```bash
# npm
npm install --save @speee-js/jsx-slack
```

```bash
# yarn
yarn add @speee-js/jsx-slack
```

## Usage

### Quick start: Template literal

Do you hate troublesome setting up for JSX? All right. We provide **`jsxslack`** tagged template literal to build blocks _right out of the box_.

It allows the template syntax almost same as JSX, powered by [HTM (Hyperscript Tagged Markup)](https://github.com/developit/htm). Setting for transpiler and importing built-in components are not required.

This is a simple example of the template function just to say hello to someone.

```javascript
import { jsxslack } from '@speee-js/jsx-slack'

export const exampleBlock = ({ name }) => jsxslack`
  <Blocks>
    <Section>
      Hello, <b>${name}</b>!
    </Section>
  </Blocks>
`
```

### [JSX Transpiler](docs/how-to-setup-jsx-transpiler.md)

When you want to use jsx-slack with JSX transpiler, you have to set up to use imported our parser `JSXSlack.createElement` or its alias `JSXSlack.h`.

```jsx
/** @jsx JSXSlack.h */
import { JSXSlack, Blocks, Section } from '@speee-js/jsx-slack'

export const exampleBlock = ({ name }) => (
  <Blocks>
    <Section>
      Hello, <b>{name}</b>!
    </Section>
  </Blocks>
)
```

**[▶︎ See how to setup JSX transpiler](docs/how-to-setup-jsx-transpiler.md)** (Babel / TypeScript)

### Use template in Slack API

After than, just use created template in Slack API. We are using the official Node SDK [`@slack/web-api`](https://github.com/slackapi/node-slack-sdk) in this example. [See also Slack guide.](https://slackapi.github.io/node-slack-sdk/web_api)

```javascript
import { WebClient } from '@slack/web-api'
import { exampleBlock } from './example'

const web = new WebClient(process.env.SLACK_TOKEN)

web.chat
  .postMessage({
    channel: 'C1234567890',
    blocks: exampleBlock({ name: 'Yuki Hattori' }),
  })
  .then((res) => console.log('Message sent: ', res.ts))
  .catch(console.error)
```

It would post a simple Slack message like this:

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/slack-example.png" width="193" />][block-kit-builder-example]

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />][block-kit-builder-example]

[block-kit-builder-example]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Hello%2C%20*Yuki%20Hattori*!%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D

## Block Kit as components

Slack has recommended to use **[Block Kit]** for building tempting messages and modals.

By using jsx-slack, you can build a template with piling up Block Kit blocks by JSX. It is feeling like using components in React or Vue.

### [For messaging](https://speee-jsx-slack.netlify.app/)

```jsx
<Blocks>
  <Section>
    <p>Enjoy building blocks!</p>
    <blockquote>
      <b>
        <a href="https://github.com/speee/jsx-slack">@speee-js/jsx-slack</a>
      </b>
      <br />
      <i>Build JSON for Slack Block Kit from JSX</i>
    </blockquote>
    <Image src="https://github.com/speee.png" alt="Speee, Inc." />
  </Section>
  <Context>
    Maintained by <a href="https://github.com/yhatt">Yuki Hattori</a>
    <img src="https://github.com/yhatt.png" alt="yhatt" />
  </Context>
  <Divider />
  <Actions>
    <Button url="https://github.com/speee/jsx-slack">GitHub</Button>
    <Button url="https://www.npmjs.com/package/@speee-js/jsx-slack">npm</Button>
  </Actions>
</Blocks>
```

### [For modal](https://speee-jsx-slack.netlify.app/#modal)

```jsx
<Modal title="My first modal" close="Cancel">
  <Section>
    <p>
      <strong>It's my first modal!</strong> :sunglasses:
    </p>
    <p>jsx-slack also has supported Slack Modals.</p>
  </Section>
  <Divider />

  <Input type="text" name="subject" label="Subject" required />
  <Textarea name="message" label="Message" maxLength={500} />

  <ConversationsSelect
    name="shareWith"
    label="Share with..."
    required
    include={['public', 'im']}
    excludeBotUsers
    responseUrlEnabled
  />

  <Input type="hidden" name="postId" value="xxxx" />
  <Input type="submit" value="Send" />
</Modal>
```

### [For home tab](https://speee-jsx-slack.netlify.app/#home)

```jsx
<Home>
  <Image src="https://source.unsplash.com/random/960x240?home" alt="home" />
  <Section>
    <b>Welcome back to my home!</b> :house_with_garden:
  </Section>
  <Divider />
  <Section>What's next?</Section>
  <Actions>
    <RadioButtonGroup actionId="next">
      <RadioButton value="tickets" checked>
        <b>See assigned tickets</b> :ticket:
        <small>
          <i>Check your tickets to start your work.</i>
        </small>
      </RadioButton>
      <RadioButton value="reminder">
        <b>Remind a task later</b> :memo:
        <small>
          <i>I'll remember a task for you.</i>
        </small>
      </RadioButton>
      <RadioButton value="pomodoro">
        <b>Start pomodoro timer</b> :tomato:
        <small>
          <i>Get focused on your time, with tomato!</i>
        </small>
      </RadioButton>
    </RadioButtonGroup>
    <Button actionId="start" style="primary">
      Start working
    </Button>
  </Actions>
</Home>
```

### References

- **[How to setup JSX transpiler](docs/how-to-setup-jsx-transpiler.md)**

* **[JSX components for Block Kit](docs/jsx-components-for-block-kit.md)**
  - [Block containers](docs/block-containers.md)
  - [Layout blocks](docs/layout-blocks.md)
  - [Block elements](docs/block-elements.md)
    - [Interactive components](docs/block-elements.md#interactive-components)
    - [Composition objects](docs/block-elements.md#composition-objects)
    - [Input components for modal](docs/block-elements.md#input-components-for-modal)

- **[HTML-like formatting](docs/html-like-formatting.md)**
- **[About escape and exact mode](docs/about-escape-and-exact-mode.md)**

## Fragments

[As like as React](https://reactjs.org/docs/fragments.html), jsx-slack provides `<Fragment>` (`<JSXSlack.Fragment>`) component for higher-order component (HOC) consited of multiple blocks or elements.

For example, you can define the custom block by grouping some blocks with `<Fragment>` if you were using JSX transpiler.

Let's say defines `<Header>` custom block that is consisted by `<Section>` and `<Divider>`.

```javascript
/** @jsx JSXSlack.h */
import { JSXSlack, Fragment } from '@speee-js/jsx-slack'

const Header = ({ children }) => (
  <Fragment>
    <Section>
      <b>{children}</b>
    </Section>
    <Divider />
  </Fragment>
)
```

Now the defined block can use in `<Blocks>` as like as the other blocks:

```jsx
<Blocks>
  <Header>
    <i>jsx-slack custom block</i> :sunglasses:
  </Header>
  <Section>Let's build your block.</Section>
</Blocks>
```

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/custom-header-block.png" width="600" />][custom-header-block]

[<img src="https://raw.githubusercontent.com/speee/jsx-slack/master/docs/preview-btn.svg?sanitize=true" width="240" />][custom-header-block]

[custom-header-block]: https://api.slack.com/tools/block-kit-builder?blocks=%5B%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22*_jsx-slack%20custom%20block_%20%3Asunglasses%3A*%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%2C%7B%22type%22%3A%22divider%22%7D%2C%7B%22type%22%3A%22section%22%2C%22text%22%3A%7B%22text%22%3A%22Let%27s%20build%20your%20block.%22%2C%22type%22%3A%22mrkdwn%22%2C%22verbatim%22%3Atrue%7D%7D%5D

### Short syntax for Babel transpiler

Babel transpiler can use [the short syntax `<></>` for fragments](https://reactjs.org/docs/fragments.html#short-syntax). See [how to setup JSX transpiler](docs/how-to-setup-jsx-transpiler.md#babel).

```javascript
/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { JSXSlack } from '@speee-js/jsx-slack'

const Header = ({ children }) => (
  <>
    <Section>
      <b>{children}</b>
    </Section>
    <Divider />
  </>
)
```

### In the case of template literal tag

`jsxslack` template literal tag has [built-in fragments support](https://github.com/developit/htm#improvements-over-jsx) so `<Fragment>` does not have to use.

```javascript
// Header.js
import { jsxslack } from '@speee-js/jsx-slack'

export const Header = ({ children }) => jsxslack`
  <Section>
    <b>${children}</b>
  </Section>
  <Divider />
`
```

A defined component may use in `jsxslack` tag as below:

```javascript
import { jsxslack } from '@speee-js/jsx-slack'
import { Header } from './Header'

console.log(jsxslack`
  <Blocks>
    <${Header}>
      <i>jsx-slack custom block</i> :sunglasses:
    <//>
    <Section>Let's build your block.</Section>
  </Blocks>
`)
```

Please notice to a usage of component that has a bit different syntax from JSX.

## Frequently questions

### Is jsx-slack the state of production-ready?

Of course! In our workspace, we are developing Slack custom app for internal with providing great UX powered by jsx-slack. And some apps published in Slack app directory are also using jsx-slack in production.

Do you have an app with jsx-slack in public? Please let us know your great app!

### Can I develop Slack app _only using jsx-slack_?

No. jsx-slack just generates JSON for Slack API. You have to send generated message and control interaction with Slack by yourself.

Don't worry; you can use jsx-slack together with helpful libraries: [Bolt framework for JavaScript](https://slack.dev/bolt) (recommended), [Slack Node SDK](https://slack.dev/node-slack-sdk/), and third-party library (e.g. [BotKit](https://botkit.ai/), [Bottender](https://bottender.js.org/)).

### Is this working based on [React]?

No, jsx-slack has very similar API to React but is not based on React, because our library doesn't need to use some features provided by React: incremental updates, event handling, reference to the rendered JSON, and component class.

Nevertheless, jsx-slack can use React's methodology (composition of components) through JSX and the basic JavaScript function. In addition, we can follow up rapidly-evolving Slack Block Kit by keeping the smallest requirements without depending on React.

FYI there are some projects based on React (reconciler) to manage Slack message: [react-chat-renderer](https://github.com/asynchronous-dev/react-chat-renderer), [rebot](https://github.com/bradennapier/rebot), etc...

## Similar projects

- [react-chat-renderer](https://github.com/asynchronous-dev/react-chat-renderer) - React renderer implementation for building rich Slack messages using JSX.
- [slack-blockx](https://github.com/kevin940726/slack-blockx) - jsx for Slack block-kit

## Author

Managed by [<img src="https://github.com/speee.png" alt="Speee, Inc." width="24" height="24" valign="bottom" /> Speee, Inc.](https://speee.jp) ([@speee](https://github.com/speee))

- <img src="https://github.com/yhatt.png" alt="@yhatt" width="24" height="24" valign="bottom" /> Yuki Hattori ([@yhatt](https://github.com/yhatt)) - Maintainer

## Licnese

[MIT License](LICENSE)
