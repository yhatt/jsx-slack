###### [Top](../README.md) &raquo; How to setup JSX transpiler

# How to setup JSX transpiler

[jsx-slack can use without transpiler by using `jsxslack` template literal tag](../README.md#user-content-quick-start-template-literal), but we strongly recommend to set up JSX in the transpiler because you'll get better developer experience in IDE (e.g. Auto completion, static error check, etc...)

- [Babel](#babel)
- [TypeScript](#typescript)
- [Deno](#deno) (Slack CLI)

## [Babel](https://babeljs.io/) <a name="user-content-babel" id="babel"></a>

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
  </Blocks>,
)
```

### Comment pragma

If you have already set up JSX transpiler for React, you can also use comment pragma to switch the transformation way per JSX file.

```jsx
/** @jsxImportSource jsx-slack */
```

###### Classic (Babel <= 7.8)

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
  </Blocks>,
)
```

#### Comment pragma

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
const { JSXSlack } = require('jsx-slack')
```

</details>

## [TypeScript](https://www.typescriptlang.org/) <a name="user-content-typescript" id="typescript"></a>

JSX (TSX) transpile in TypeScript can be used in some of different ways.

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
  </Blocks>,
)
```

### tsconfig.json

Or you can instruct to use jsx-slack in all TSX files by setting up `tsconfig.json`.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx", // or "react-jsxdev" for development
    "jsxImportSource": "jsx-slack",
    // ...
  },
}
```

###### Classic (TypeScript <= 4.0) <a name="user-content-typescript-classic" id="typescript-classic"></a>

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
    </Blocks>,
  ),
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
    "jsxFragmentFactory": "JSXSlack.Fragment",
    // ...
  },
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
    </Blocks>,
  ),
})
```

## [Deno](https://deno.land/) (Slack CLI) <a name="user-content-deno" id="deno"></a>

_[Importing jsx-slack from npm requires Deno v1.28 and later](https://deno.com/blog/v1.28#using-npm)._

Deno uses TypeScript so the most parts are exactly same as described in [TypeScript](#typescript) section. An important difference is using `npm:jsx-slack@6` to import module.

> **Note**
> Alternatively [you also can import jsx-slack through esm.sh CDN](https://deno.land/manual@v1.28.1/node/cdns#esmsh) ([`https://esm.sh/jsx-slack@6`](https://esm.sh/jsx-slack@6)). Try ESM CDN if you are using old Deno version that has not supported npm.

### Comment pragma

```jsx
// main.tsx
/** @jsxImportSource npm:jsx-slack@6 */
import { Blocks, Section } from 'npm:jsx-slack@6'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>,
)
```

### tsconfig.json

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:jsx-slack@6",
    // ...
  },
}
```

###### Classic <a name="user-content-deno-classic" id="deno-classic"></a>

[Setting up JSX transpilation with this spec requires Deno v1.16 and later](https://deno.com/blog/v1.16#support-for-new-jsx-transforms). If you are using Deno v1.15 and former, you should set up JSX with a classic way.

<details>
<summary>How to transpile JSX with classic way in Deno... 👉</summary>

#### Comment pragma

_You should always import `JSXSlack` from `https://esm.sh/jsx-slack@6` in every TSX files._

```jsx
/** @jsx JSXSlack.h **/
/** @jsxFrag JSXSlack.Fragment **/
import { JSXSlack, Blocks, Section } from 'https://esm.sh/jsx-slack@6'

console.log(
  <Blocks>
    <Section>
      <p>Hello, world!</p>
    </Section>
  </Blocks>,
)
```

#### tsconfig.json

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSXSlack.h",
    "jsxFragmentFactory": "JSXSlack.Fragment",
    // ...
  },
}
```

</details>

### Import maps

You also can define [import maps](https://deno.land/manual/linking_to_external_code/import_maps) for setting to resolve with the module name instead using full URL import.

```json
{
  "imports": {
    "jsx-slack": "npm:jsx-slack@6",
    "jsx-slack/jsx-runtime": "npm:jsx-slack@6/jsx-runtime",
    "jsx-slack/jsx-dev-runtime": "npm:jsx-slack@6/jsx-dev-runtime"
  }
}
```

Then you can use the comment pragma and `import` statement as following. Your JSX/TSX source codes can make compatible with Node.js.

```tsx
/** @jsxImportSource jsx-slack */
import { Blocks, Section } from 'jsx-slack'
```

In addition, the import maps is also helpful for using alternative ESM CDN. [See the Deno manual for more details.](https://deno.land/manual/jsx_dom/jsx#using-an-import-map)

<details>
<summary>Example: Use Skypack CDN...</summary>

```json
{
  "imports": {
    "jsx-slack": "https://cdn.skypack.dev/jsx-slack?dts",
    "jsx-slack/jsx-runtime": "https://cdn.skypack.dev/jsx-slack/jsx-runtime?dts",
    "jsx-slack/jsx-dev-runtime": "https://cdn.skypack.dev/jsx-slack/jsx-dev-runtime?dts"
  }
}
```

</details>

---

###### [Top](../README.md) &raquo; How to setup JSX transpiler
