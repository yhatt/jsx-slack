###### [Top](../README.md) &raquo; How to setup JSX transpiler

# How to setup JSX transpiler

When you want to use jsx-slack with JSX transpiler, you have to set up to use imported our parser `JSXSlack.createElement`, or its alias `JSXSlack.h`.

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
const { JSXSlack, Blocks, Section } = require('@speee-js/js-slack')

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
const { JSXSlack } = require('@speee-js/js-slack')
```

### Automatic ([Babel >= 7.9](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154)) _[experimental]_

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
const { Blocks, Section } = require('@speee-js/js-slack')

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

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "JSXSlack.h"
    // ...
  }
}
```

You should always import `JSXSlack` from `@speee-js/jsx-slack` in every JSX.

In addition, we recommend to wrap JSX in `JSXSlack()` to deal with the mismatched type against SDK for Slack API. It's a helper function to cast into `any` type.

```jsx
import { JSXSlack, Blocks, Section } from '@speee-js/js-slack'

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

```jsx
/** @jsx JSXSlack.h **/
import { JSXSlack } from '@speee-js/js-slack'
```

> :warning: TypeScript cannot customize the factory method for fragment short syntax `<></>`. ([Microsoft/TypeScript#20469](https://github.com/Microsoft/TypeScript/issues/20469)) Please use `<Fragment>` component as same as other components.

---

###### [Top](../README.md) &raquo; How to setup JSX transpiler
