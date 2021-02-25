###### [Top](../README.md) &raquo; How to setup JSX transpiler

# How to setup JSX transpiler

When you want to use jsx-slack with JSX transpiler, you have to set up to use imported our parser `JSXSlack.createElement`, or its alias `JSXSlack.h`.

> :information_source: You can also use jsx-slack without setting up JSX transpiler as well! Check out ["Quick start: Template literal"](../README.md#quick-start-template-literal) section.
>
> On the other hand, you'll get better developer experience in IDE (auto completion, static error check, etc...) if you've set up JSX transpiler.

## [Babel](https://babeljs.io/)

You can use [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) preset (or [`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin) to transpile JSX.

```javascript
// babel.config.js
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@speee-js/jsx-slack',
        development: api.env('development'),
      },
    ],
  ],
})
```

```jsx
const { Blocks, Section } = require('@speee-js/jsx-slack')

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

### Comment pragma

If you have already set up JSX transpiler for React, you can also use comment pragma to switch the transformation way per JSX file.

```jsx
/** @jsxImportSource @speee-js/jsx-slack */
```

### Classic runtime (Babel <= 7.8)

`runtime: 'automatic'` cannot use if you're using Babel <= 7.8. You have to consider using the classic runtime.

<details>
<summary>How to use the classic runtime...</summary>

```javascript
// babel.config.js
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
        pragma: 'JSXSlack.h',
        pragmaFrag: 'JSXSlack.Fragment',
        development: api.env('development'),
      },
    ],
  ],
})
```

_You should always import `JSXSlack` from `@speee-js/jsx-slack` in every JSX._

```jsx
const { JSXSlack, Blocks, Section } = require('@speee-js/jsx-slack')

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

#### Comment pragma

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
const { JSXSlack } = require('@speee-js/jsx-slack')
```

</details>

## [TypeScript](https://www.typescriptlang.org/)

You can use TypeScript built-in JSX transpiler too.

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx", // or "react-jsxdev" for development
    "jsxImportSource": "@speee-js/jsx-slack"
    // ...
  }
}
```

```tsx
import { Blocks, Section } from '@speee-js/jsx-slack'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

### Comment pragma

Currently _the empty import at least is required to make recognize jsx-slack to TypeScript._

```jsx
/** @jsxImportSource @speee-js/jsx-slack **/
import {} from '@speee-js/jsx-slack'
```

### Classic (TypeScript <= 4.0)

<details>
<summary>How to transpile jsx-slack with the classic way...</summary>

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSXSlack.h",
    // NOTE: jsxFragmentFactory is available only in TypeScript >= v4.0.
    "jsxFragmentFactory": "JSXSlack.Fragment"
    // ...
  }
}
```

_You should always import `JSXSlack` from `@speee-js/jsx-slack` in every JSX._

```jsx
import { JSXSlack, Blocks, Section } from '@speee-js/jsx-slack'

console.log(
  JSXSlack(
    <Blocks>
      <Section>
        <p>Hello, world!</p>
      </Section>
    </Blocks>
  )
)
```

#### Comment pragma

Please note that `jsxFrag` pragma is available only in [TypeScript >= 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/#custom-jsx-factories).

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
import { JSXSlack } from '@speee-js/jsx-slack'
```

</details>

### Caveats

In TypeScript, we recommend to **wrap JSX with `JSXSlack()` when passing JSX to SDK for Slack API.** It's a helper function to cast JSX into `any` type, and you can deal with the mismatched JSX type against SDK.

```jsx
import { WebClient } from '@slack/client'
import { JSXSlack, Blocks, Section } from '@speee-js/jsx-slack'

const api = new WebClient(process.env.SLACK_TOKEN)

api.chat.postMessage({
  channel: 'C1234567890',

  // Please wrap in JSXSlack()!
  blocks: JSXSlack(
    <Blocks>
      <Section>Hello, world!</Section>
    </Blocks>
  ),
})
```

---

###### [Top](../README.md) &raquo; How to setup JSX transpiler
