###### [Top](../README.md) &raquo; How to setup JSX transpiler

# How to setup JSX transpiler

[jsx-slack can use without transpiler by using `jsxslack` template literal tag](<(../README.md#quick-start-template-literal)>), but we strongly recommend to set up JSX in the transpiler because you'll get better developer experience in IDE (e.g. Auto completion, static error check, etc...)

- [Babel](#babel)
- [TypeScript](#typescript)
- [Deno](#deno) (Slack CLI)
- [esbuild](#esbuild)

## [Babel](https://babeljs.io/) <a name="babel"></a>

You can use [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) preset (or [`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin) to transpile JSX.

```javascript
// babel.config.js
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: 'jsx-slack',
        development: api.env('development'),
      },
    ],
  ],
})
```

```jsx
// main.jsx
const { Blocks, Section } = require('jsx-slack')

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
/** @jsxImportSource jsx-slack */
```

### Classic runtime (Babel <= 7.8)

`runtime: 'automatic'` cannot use if you're using Babel <= 7.8. You have to consider using the classic runtime.

<details>
<summary>How to use the classic runtime... 👉</summary>

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

_You should always import `JSXSlack` from `jsx-slack` in every JSX._

```jsx
// main.jsx
const { JSXSlack, Blocks, Section } = require('jsx-slack')

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
const { JSXSlack } = require('jsx-slack')
```

</details>

## [TypeScript](https://www.typescriptlang.org/) <a name="typescript"></a>

### Comment pragma

```tsx
// main.tsx
/** @jsxImportSource jsx-slack */
import { Blocks, Section } from 'jsx-slack'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

### tsconfig.json

Or you can instruct to use jsx-slack in all `.tsx` files by setting up `tsconfig.json`.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx", // or "react-jsxdev" for development
    "jsxImportSource": "jsx-slack"
    // ...
  }
}
```

### Classic (TypeScript <= 4.0 and esbuild) <a name="typescript-classic"></a>

If your using build tool has not yet supported TypeScript `react-jsx` mode, try using a classic `react` mode.

<details>
<summary>How to transpile JSX with classic way in TypeScript... 👉</summary>

#### Comment pragma

_You should always import `JSXSlack` from `jsx-slack` in every TSX files._

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
import { JSXSlack, Blocks, Section } from 'jsx-slack'

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

Please note that `jsxFrag` pragma is available only in [TypeScript >= 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/#custom-jsx-factories).

#### tsconfig.json

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

</details>

### Caveats

In TypeScript, we recommend to **wrap JSX with `JSXSlack()` when passing JSX to SDK for Slack API.** It's a helper function to cast JSX into `any` type, and you can deal with the mismatched JSX type against SDK.

```jsx
import { WebClient } from '@slack/client'
import { JSXSlack, Blocks, Section } from 'jsx-slack'

const api = new WebClient(process.env.SLACK_TOKEN)

api.chat.postMessage({
  channel: 'C1234567890',

  // Wrap in JSXSlack()!
  blocks: JSXSlack(
    <Blocks>
      <Section>
        <p>Hello, world!</p>
      </Section>
    </Blocks>
  ),
})
```

## [Deno](https://deno.land/) (Slack CLI) <a name="deno"></a>

_Please note that [it requires Deno v1.16 and later](https://deno.com/blog/v1.16#support-for-new-jsx-transforms)._

Deno uses TypeScript so the most parts are exactly same as described in [TypeScript](#typescript) section.

### Comment pragma

```jsx
// main.tsx
/** @jsxImportSource https://esm.sh/jsx-slack */
import { Blocks, Section } from 'https://esm.sh/jsx-slack'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

### tsconfig.json

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "https://esm.sh/jsx-slack"
    // ...
  }
}
```

And run Deno with specific configuration file:

```bash
deno run --config ./tsconfig.json main.tsx
```

### Classic (Deno <= 1.15) <a name="typescript-classic"></a>

<details>
<summary>How to transpile JSX with classic way in Deno... 👉</summary>

#### Comment pragma

_You should always import `JSXSlack` from `jsx-slack` ESM CDN in every TSX files._

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
import { JSXSlack, Blocks, Section } from 'https://esm.sh/jsx-slack'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

#### tsconfig.json

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSXSlack.h",
    "jsxFragmentFactory": "JSXSlack.Fragment"
    // ...
  }
}
```

</details>

## [esbuild](https://babeljs.io/) <a name="esbuild"></a>

esbuild does not have supported JSX automatic runtime ([evanw/esbuild#334](https://github.com/evanw/esbuild/issues/334)) so you have to always use the classic way to transpile JSX.

If you are using TypeScript in esbuild, _please refer to [the classic section of TypeScript](#typescript-classic) instead._

#### Comment pragma

_You should always import `JSXSlack` from `jsx-slack` in every JSX files._

```jsx
// main.jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
import { JSXSlack, Blocks, Section } from 'jsx-slack'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>
)
```

#### [CLI](https://esbuild.github.io/content-types/#using-jsx-without-react)

```bash
esbuild main.jsx --jsx-factory=JSXSlack.h --jsx-fragment=JSXSlack.Fragment
```

---

###### [Top](../README.md) &raquo; How to setup JSX transpiler
