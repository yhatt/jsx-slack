###### [Top](../README.md) &raquo; How to setup JSX transpiler

# How to setup JSX transpiler

When you want to use jsx-slack with JSX transpiler, you have to set up to use imported our parser `JSXSlack.createElement`, or its alias `JSXSlack.h`.

> :information_source: You can also use jsx-slack without setting up JSX transpiler as well! Check out ["Quick start: Template literal"](../README.md#quick-start-template-literal) section.
>
> On the other hand, you'll get better developer experience in IDE (auto completion, static error check, etc...) if you've set up JSX transpiler.

## [Babel](https://babeljs.io/)

You can use [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) preset (or [`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin) to transpile JSX.

### Classic

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

You should always import `JSXSlack` from `@speee-js/jsx-slack` in every JSX.

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

You can also use comment pragma per JSX file if you have already set up JSX transpiler for React.

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
const { JSXSlack } = require('@speee-js/jsx-slack')
```

### Automatic ([Babel >= 7.9](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154))

We also have supported `automatic` runtime.

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

Babel will automatically import functions for transpiling JSX. You only have to import required components from `@speee-js/jsx-slack`.

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

#### Comment pragma

```jsx
/** @jsxImportSource @speee-js/jsx-slack */
```

## [TypeScript](https://www.typescriptlang.org/)

You can use TypeScript built-in JSX transpiler too.

### Classic

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSXSlack.h",
    // NOTE: jsxFragmentFactory is available only in TypeScript >= 4.0.
    "jsxFragmentFactory": "JSXSlack.Fragment"
    // ...
  }
}
```

You should always import `JSXSlack` from `@speee-js/jsx-slack` in every JSX.

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

### Automatic ([TypeScript >= 4.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#react-17-jsx-factories))

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx", // or "react-jsxdev" for development
    "jsxImportSource": "@speee-js/jsx-slack"
    // ...
  }
}
```

#### Comment pragma

```jsx
/** @jsxImportSource @speee-js/jsx-slack **/
import {} from '@speee-js/jsx-slack'
```

### Caveats

In TypeScript, **you should always place import syntax from `@speee-js/jsx-slack`** even if you're not using any components, to avoid type error while compiling.

```jsx
// Should place empty import to avoid compile error
import {} from '@speee-js/jsx-slack'

export const CustomComponent = ({ a, b }) => (
  <b>
    Hello, {a}, and {b}!
  </b>
)
```

And we recommend to **wrap JSX with `JSXSlack()` when passing JSX to SDK for Slack API.** It's a helper function to cast JSX into `any` type, and you can deal with the mismatched JSX type against SDK.

```jsx
import { WebClient } from '@slack/client'
import { JSXSlack, Blocks, Section } from '@speee-js/jsx-slack'

const api = new WebClient(process.env.SLACK_TOKEN)

api.chat.postMessage({
  channel: 'C1234567890',

  // Important using JSXSlack()!
  blocks: JSXSlack(
    <Blocks>
      <Section>Hello, world!</Section>
    </Blocks>
  ),
})
```

---

###### [Top](../README.md) &raquo; How to setup JSX transpiler
