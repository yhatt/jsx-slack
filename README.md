<h1 align="center">
  <a href="https://npm.im/jsx-slack">
    <img src="https://raw.githubusercontent.com/yhatt/jsx-slack/HEAD/demo/public/logo.svg?sanitize=true" width="100" /><br />
    jsx-slack
  </a>
</h1>

[![CircleCI](https://img.shields.io/circleci/project/github/yhatt/jsx-slack/main.svg?logo=circleci)][circleci]
[![Codecov](https://img.shields.io/codecov/c/github/yhatt/jsx-slack/main.svg?logo=codecov)](https://codecov.io/gh/yhatt/jsx-slack)
[![npm](https://img.shields.io/npm/v/jsx-slack.svg?logo=npm)][npm]
[![LICENSE](https://img.shields.io/github/license/yhatt/jsx-slack.svg)][license]

[circleci]: https://circleci.com/gh/yhatt/jsx-slack/
[npm]: https://npm.im/jsx-slack
[license]: ./LICENSE

Build JSON object for [Slack][slack] [block kit] surfaces from [JSX].

[slack]: https://slack.com
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[react]: https://reactjs.org/
[block kit]: https://api.slack.com/block-kit
[block kit builder]: https://api.slack.com/tools/block-kit-builder

<p align="center">
  <a href="https://jsx-slack.netlify.app/">
    <img src="https://raw.githubusercontent.com/yhatt/jsx-slack/HEAD/docs/jsx.png" width="550" />
  </a>
  <br />
  <a href="https://jsx-slack.netlify.app/#bkb:message">
    <img src="https://raw.githubusercontent.com/yhatt/jsx-slack/HEAD/docs/slack-notification.png" width="532" />
  </a>
</p>

:point_right: **[Try our REPL demo](https://jsx-slack.netlify.app/)** in https://jsx-slack.netlify.app/.

### Features

- **[Block Kit as components](docs/jsx-components-for-block-kit.md)** - Build contents for any surfaces by composing components for Block Kit with JSX.
- **[HTML-like formatting](docs/html-like-formatting.md)** - Keep a readability by using well-known elements.

See **[references](#references)** to dive into jsx-slack deeply.

## Motivation

When developing Slack-integrated app, continuous maintenance of the rich contents is a difficult task. A team member must read and write JSON with deep knowledge about specifications of payload for Slack API.

We believe JSX-based template well-known in front-end development would enhance a developer experience of Slack app.

## Project goal

A project goal is creating an interface to compose contents for Slack with keeping code maintainability by using [JSX].

jsx-slack would allow composing contents with simple and predictable HTML-like markup. It helps in understanding the structure of complex contents and interactions.

## Install

### [Node.js](https://nodejs.org/)

We require Node.js >= 14. If you are using TypeScript, we also require TS >= 3.7.

```bash
# npm
npm install --save jsx-slack
```

```bash
# yarn
yarn add jsx-slack
```

Now you can begin to write the code with [`jsxslack` template literal tag](#quick-start-template-literal). Furthermore, [setting up JSX transpiler](docs/how-to-setup-jsx-transpiler.md) would make the best development experience.

### [Deno](https://deno.land/) ([Slack CLI](https://api.slack.com/future/tools/cli))

We also have Deno support. If you are using Deno v1.28 and later, [you can import jsx-slack through npm directly](https://deno.land/manual/node/npm_specifiers).

```typescript
// `jsxslack` template literal tag
import { jsxslack } from 'npm:jsx-slack@5'
```

```typescript
// JSX transpilation
/** @jsxImportSource npm:jsx-slack@5 */
import { Blocks, Section } from 'npm:jsx-slack@5'
```

> **Note**
> Alternatively [you also can import jsx-slack through esm.sh CDN](https://deno.land/manual@v1.28.1/node/cdns#esmsh): [`https://esm.sh/jsx-slack@5`](https://esm.sh/jsx-slack@5)

## Usage

### Quick start: Template literal

Do you hate troublesome setting up for JSX? All right. We provide **`jsxslack`** tagged template literal to build blocks _right out of the box_.

It allows the template syntax almost same as JSX, powered by [HTM (Hyperscript Tagged Markup)](https://github.com/developit/htm). Setting for transpiler and importing built-in components are not required.

This is a simple example of the template function just to say hello to someone.

```javascript
import { jsxslack } from 'jsx-slack'

export const exampleBlock = ({ name }) => jsxslack`
  <Blocks>
    <Section>
      Hello, <b>${name}</b>!
    </Section>
  </Blocks>
`
```

### [JSX Transpiler](docs/how-to-setup-jsx-transpiler.md)

When you want to use jsx-slack with JSX transpiler, you have to set up to use our runtime for JSX.

**[▶︎ How to setup JSX transpiler](docs/how-to-setup-jsx-transpiler.md)** (Babel / TypeScript / Deno)

```jsx
/** @jsxImportSource jsx-slack */
import { Blocks, Section } from 'jsx-slack'

export const exampleBlock = ({ name }) => (
  <Blocks>
    <Section>
      Hello, <b>{name}</b>!
    </Section>
  </Blocks>
)
```

### Use template in Slack API

After than, just use created template in Slack API. We are using the official Node SDK [`@slack/web-api`](https://github.com/slackapi/node-slack-sdk) in this example. [See also Slack guide.](https://slackapi.github.io/node-slack-sdk/web_api)

```javascript
import { WebClient } from '@slack/web-api'
import { exampleBlock } from './example.jsx'

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

[<img src="./docs/slack-example.png" width="193" />][block-kit-builder-example]

[<img src="./docs/preview-btn.svg" width="240" />][block-kit-builder-example]

[block-kit-builder-example]: https://jsx-slack.netlify.app/#bkb:jsx:eJyzccrJT84utuNSULAJTk0uyczPA7EVFDxSc3LydRRskuwiS7MzFTwSS0ryizJt9JPsFEFq9eGKbfShRgAAVeQWug==

## Block Kit as components

Slack has recommended to use **[Block Kit]** for building tempting messages and modals.

By using jsx-slack, you can build a template with piling up Block Kit blocks by JSX. It is feeling like using components in React or Vue.

### [For messaging](https://jsx-slack.netlify.app/)

```jsx
<Blocks>
  <Section>
    <p>Enjoy building blocks!</p>
    <blockquote>
      <b>
        <a href="https://github.com/yhatt/jsx-slack">jsx-slack</a>
      </b>
      <br />
      <i>Build JSON for Slack Block Kit from JSX</i>
    </blockquote>
    <img src="https://github.com/yhatt.png" alt="yhatt" />
  </Section>
  <Context>
    Maintained by <a href="https://github.com/yhatt">Yuki Hattori</a>
    <img src="https://github.com/yhatt.png" alt="yhatt" />
  </Context>
  <Divider />
  <Actions>
    <Button url="https://github.com/yhatt/jsx-slack">GitHub</Button>
    <Button url="https://npm.im/jsx-slack">npm</Button>
  </Actions>
</Blocks>
```

### [For modal](https://jsx-slack.netlify.app/#modal)

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

### [For home tab](https://jsx-slack.netlify.app/#home)

```jsx
<Home>
  <Image src="https://source.unsplash.com/random/960x240?home" alt="home" />
  <Header>Welcome back to my home! :house_with_garden:</Header>
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
- **[JSX components for Block Kit](docs/jsx-components-for-block-kit.md)**
  - [Block containers](docs/block-containers.md)
  - [Layout blocks](docs/layout-blocks.md)
  - [Block elements](docs/block-elements.md)
    - [Interactive components](docs/block-elements.md#user-content-interactive-components)
    - [Composition objects](docs/block-elements.md#user-content-composition-objects)
    - [Input components](docs/block-elements.md#user-content-input-components)

* **[HTML-like formatting](docs/html-like-formatting.md)**
* **[About escape and exact mode](docs/about-escape-and-exact-mode.md)**

- **[Highlight of v2](docs/highlight/v2.md)**

### Examples by use cases

Ported from templates for [Block Kit Builder].

#### [Message](https://api.slack.com/tools/block-kit-builder?mode=message&template=1)

- [Approval (New device request)](https://jsx-slack.netlify.app/#messagingApprovalNewDevice)
- [Approval (Time Off request)](https://jsx-slack.netlify.app/#messagingApprovalTimeOff)
- [Notification](https://jsx-slack.netlify.app/#messagingNotification)
- [Onboarding (Taskbot)](https://jsx-slack.netlify.app/#messagingOnboardingTaskbot)
- [Onboarding (Onboarding App)](https://jsx-slack.netlify.app/#messagingOnboardingApp)
- [Poll](https://jsx-slack.netlify.app/#messagingPoll)
- [Search Results (TripAgent)](https://jsx-slack.netlify.app/#messagingSearchResultsTripAgent)
- [Search Results (FileCard Agent)](https://jsx-slack.netlify.app/#messagingSearchResultsFileCard)
- [Newsletter](https://jsx-slack.netlify.app/#messagingNewsletter)

#### [Modal](https://api.slack.com/tools/block-kit-builder?mode=modal&template=1)

- [Poll](https://jsx-slack.netlify.app/#modalPoll)
- [Search Results](https://jsx-slack.netlify.app/#modalSearchResults)
- [Settings (App menu)](https://jsx-slack.netlify.app/#modalSettingsAppMenu)
- [Settings (Notification settings)](https://jsx-slack.netlify.app/#modalSettingsNotification)
- [List of information (Your itinerary)](https://jsx-slack.netlify.app/#modalListOfInformationYourItinerary)
- [List of information (Ticket app)](https://jsx-slack.netlify.app/#modalListOfInformationTicketApp)

#### [App Home](https://api.slack.com/tools/block-kit-builder?mode=appHome&template=1)

- [Project Tracker](https://jsx-slack.netlify.app/#appHomeProjectTracker)
- [Calendar](https://jsx-slack.netlify.app/#appHomeCalendar)
- [Expense App](https://jsx-slack.netlify.app/#appHomeExpenseApp)
- [Todo App](https://jsx-slack.netlify.app/#appHomeTodoApp)

## Fragments

[As like as React](https://reactjs.org/docs/fragments.html), jsx-slack provides `<Fragment>` (`<JSXSlack.Fragment>`) component for higher-order component (HOC) consited of multiple blocks or elements.

For example, you can define the custom block by grouping some blocks with `<Fragment>` if you were using JSX transpiler.

Let's say about defining `<Heading>` custom block that is consisted by `<Section>` and `<Divider>`.

```javascript
import { Fragment, Section, Divider } from 'jsx-slack'

const Heading = ({ children }) => (
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
  <Heading>
    <i>jsx-slack custom block</i> :sunglasses:
  </Heading>
  <Section>Let's build your block.</Section>
</Blocks>
```

[<img src="./docs/custom-header-block.png" width="600" />][custom-header-block]

[<img src="./docs/preview-btn.svg" width="240" />][custom-header-block]

[custom-header-block]: https://jsx-slack.netlify.app/#bkb:jsx:eJxVjrEOgzAQQ3e-4jYmejs6Zag6duMLSIjQlZRIOEHt3xcaBphsD8-23EN0E0xFJJ13SeO8-y3ZoptT88KnQejdRC4jxTfZnRJWQy3yPIYe8GgLyH9S-FQnD1118AvxZejpUw2yWcNA35iXUns7ocLHvx9tITN_

### Short syntax for fragments

Babel transpiler and TypeScript 4 can use [the short syntax `<></>` for fragments](https://reactjs.org/docs/fragments.html#short-syntax). See [how to setup JSX transpiler](docs/how-to-setup-jsx-transpiler.md).

```javascript
import { Section, Divider } from 'jsx-slack'

const Heading = ({ children }) => (
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
// Heading.js
import { jsxslack } from 'jsx-slack'

export const Heading = ({ children }) => jsxslack`
  <Section>
    <b>${children}</b>
  </Section>
  <Divider />
`
```

A defined component may use in `jsxslack` tag as below:

```javascript
import { jsxslack } from 'jsx-slack'
import { Heading } from './Heading'

console.log(jsxslack`
  <Blocks>
    <${Heading}>
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

FYI there are some projects based on React ([react-reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)) to generate or manage Slack interactions: [phelia](https://github.com/maxchehab/phelia) framework, [react-chat-renderer](https://github.com/asynchronous-dev/react-chat-renderer) (< v0.1.0), and [rebot](https://github.com/bradennapier/rebot). You should use them if you want to use React ecosystem.

<!-- NOTE: The latest react-chat-renderer is no longer based on react-reconciler. It implements custom JSX renderer as same as jsx-slack. -->

### How do you spell this library?

"jsx-slack" with all in lowercase. It is neither of "JSX-Slack" nor "JSX Slack".

## Similar projects

<!-- This section is listing only libraries that generates Block Kit JSON from JSX. -->

- [phelia](https://github.com/maxchehab/phelia) - :zap: A reactive Slack application framework. <!-- React-based Slack app framework with familiar event handling by hooks -->
- [react-chat-renderer](https://github.com/asynchronous-dev/react-chat-renderer) - React renderer implementation for building rich Slack messages using JSX <!-- Custom JSX renderer for Slack + async component support -->
- [slack-blockx](https://github.com/kevin940726/slack-blockx) - jsx for Slack block-kit <!-- Block Kit JSON builder whose exactly same concept as jsx-slack -->

## Author

- <img src="https://github.com/yhatt.png" alt="@yhatt" width="24" height="24" valign="bottom" /> Yuki Hattori ([@yhatt](https://github.com/yhatt)) - Maintainer

## License

[MIT License](LICENSE)
