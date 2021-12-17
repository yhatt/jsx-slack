# Change Log

## [Unreleased]

### Fixed

- Fix performance issues of tags in `<blockquote>`

## v4.5.0 - 2021-12-02

### Added

- `autoFocus` prop for supported interactive elements ([#253](https://github.com/yhatt/jsx-slack/issues/253), [#254](https://github.com/yhatt/jsx-slack/pull/254))
- Guide for setting up jsx-slack in Deno (Slack CLI) and esbuild ([#245](https://github.com/yhatt/jsx-slack/issues/245), [#252](https://github.com/yhatt/jsx-slack/pull/252))

### Changed

- Upgrade dependent packages to the latest version ([#255](https://github.com/yhatt/jsx-slack/pull/255))

## v4.4.3 - 2021-11-18

### Fixed

- Fix Deno's type error by adding manual type assertion for `<Blocks>` ([#245](https://github.com/yhatt/jsx-slack/issues/245), [#251](https://github.com/yhatt/jsx-slack/pull/251))

## v4.4.2 - 2021-11-17

### Fixed

- Fix internal type of `<Blocks>` for making better type support for ESM CDN ([#245](https://github.com/yhatt/jsx-slack/issues/245), [#250](https://github.com/yhatt/jsx-slack/pull/250))

## v4.4.1 - 2021-11-17

### Fixed

- Avoid using namespace alias and use isomorphic namespace in JSX runtime ([#249](https://github.com/yhatt/jsx-slack/pull/249))

## v4.4.0 - 2021-11-17

### Removed

- Direct dependencies to `hast-util-to-mdast` and `he` ([#247](https://github.com/yhatt/jsx-slack/pull/247))

### Changed

- Upgrade development Node version to v16 LTS ([#246](https://github.com/yhatt/jsx-slack/pull/246))
- Upgrade dependent packages to the latest version ([#246](https://github.com/yhatt/jsx-slack/pull/246))
- Setup esbuild transpile and prebundling ([#247](https://github.com/yhatt/jsx-slack/pull/247))

## v4.3.0 - 2021-06-25

### Added

- Support assigning [`submit_disabled` field](https://api.slack.com/reference/workflows/configuration-view) by setting `submit` prop as `false` in `<Modal type="workflow_step">` ([#233](https://github.com/yhatt/jsx-slack/issues/233), [#234](https://github.com/yhatt/jsx-slack/pull/234))

### Fixed

- Broken JSDoc links in some IDEs ([#235](https://github.com/yhatt/jsx-slack/pull/235))

### Changed

- Upgrade dependent packages to the latest version ([#236](https://github.com/yhatt/jsx-slack/pull/236))

## v4.2.1 - 2021-06-18

### Fixed

- Fixed resolution error when using JSX runtime script through ES modules ([#231](https://github.com/yhatt/jsx-slack/issues/231), [#232](https://github.com/yhatt/jsx-slack/pull/232))

## v4.2.0 - 2021-06-16

### Added

- ES modules support ([#227](https://github.com/yhatt/jsx-slack/pull/227))
- CI test against Node 16 ([#228](https://github.com/yhatt/jsx-slack/pull/228))

### Changed

- Upgrade Node and dependent packages to the latest version ([#228](https://github.com/yhatt/jsx-slack/pull/228))
- Rename `master` branch to `main` ([#229](https://github.com/yhatt/jsx-slack/pull/229))

## v4.1.0 - 2021-06-14

### Added

- Added type exports that are similar to `@types/react` ([#226](https://github.com/yhatt/jsx-slack/pull/226))
  - `FunctionCompnent` / `FC` (Alias to same types in `JSXSlack` namespace)
  - `VoidFunctionComponent` / `VFC` (Alias to same types in `JSXSlack` namespace)
  - `Node` (Similar to `ReactNode` but for jsx-slack. Alias to `JSXSlack.ChildElements`)

### Changed

- Upgrade dependent packages to the latest version ([#225](https://github.com/yhatt/jsx-slack/pull/225))

## v4.0.0 - 2021-04-25

### Breaking

- Dropped Node 10 support ([#219](https://github.com/yhatt/jsx-slack/pull/219))

### Changed

- Allow containing `<Input>` and input components in `<Blocks>` ([#218](https://github.com/yhatt/jsx-slack/issues/218), [#220](https://github.com/yhatt/jsx-slack/pull/220))
- Upgrade dependent packages to the latest version ([#219](https://github.com/yhatt/jsx-slack/pull/219))

### Removed

- Remove deprecated `jsxslack.raw` ([#221](https://github.com/yhatt/jsx-slack/pull/221))

## v3.0.0 - 2021-02-25

### Breaking

The package name has renamed from `@speee-js/jsx-slack` to `jsx-slack`.

### Added

- JSX automatic runtime support for TypeScript 4.1 ([#214](https://github.com/yhatt/jsx-slack/pull/214), [#194](https://github.com/yhatt/jsx-slack/issues/194))

### Changed

- Rename package from `@speee-js/jsx-slack` to `jsx-slack` ([#213](https://github.com/yhatt/jsx-slack/issues/213), [#215](https://github.com/yhatt/jsx-slack/pull/215))
- GitHub repository has transferred to [yhatt/jsx-slack](https://github.com/yhatt/jsx-slack) ([#215](https://github.com/yhatt/jsx-slack/pull/215))

## v2.6.0 - 2020-10-20

### Added

- [Configurable `dispatchAction` prop](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#input) for `<Input type="text">` and `<Textarea>` (equivalent to [`dispatch_action_config` for the plain-text input](https://api.slack.com/reference/block-kit/block-elements#input)) ([#204](https://github.com/yhatt/jsx-slack/issues/204), [#205](https://github.com/yhatt/jsx-slack/pull/205))
- [`<Mrkdwn raw>`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#bypass-html-like-formatting) to bypass HTML-like formatting and auto-escaping ([#161](https://github.com/yhatt/jsx-slack/issues/161), [#207](https://github.com/yhatt/jsx-slack/pull/207))

### Fixed

- Escaped underscores within Korean emoji shorthand have broken ([#203](https://github.com/yhatt/jsx-slack/issues/203), [#206](https://github.com/yhatt/jsx-slack/pull/206))

### Changed

- Upgrade dependent packages to the latest version ([#208](https://github.com/yhatt/jsx-slack/pull/208))

## v2.5.1 - 2020-10-08

### Added

- [`<TimePicker>` interactive component](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#time-picker) ([#199](https://github.com/yhatt/jsx-slack/issues/199), [#202](https://github.com/yhatt/jsx-slack/pull/202))

### Fixed

- Update demo schema for `dispatchAction` prop ([#201](https://github.com/yhatt/jsx-slack/pull/201))

## v2.5.0 - 2020-10-07

### Changed

- `<Input>` and input components are available in home tab container `<Home>` ([#195](https://github.com/yhatt/jsx-slack/issues/195), [#200](https://github.com/yhatt/jsx-slack/pull/200))
- Allow using `<RadioButtonGroup>` and `<CheckboxGroup>` in message container `<Blocks>` ([#196](https://github.com/yhatt/jsx-slack/issues/196), [#197](https://github.com/yhatt/jsx-slack/pull/197))
- Upgrade dependent packages to the latest version ([#191](https://github.com/yhatt/jsx-slack/pull/191), [#198](https://github.com/yhatt/jsx-slack/pull/198))

### Added

- `dispatchAction` prop for `<Input>` layout block and input components ([#200](https://github.com/yhatt/jsx-slack/pull/200))
- Docs: [`jsxFragmentFactory` compiler option for TypeScript v4](https://github.com/yhatt/jsx-slack/blob/main/docs/how-to-setup-jsx-transpiler.md#typescript) ([#173](https://github.com/yhatt/jsx-slack/issues/173), [#191](https://github.com/yhatt/jsx-slack/pull/191))

## v2.4.0 - 2020-07-30

### Added

- [`<Header>` component](https://github.com/yhatt/jsx-slack/blob/main/docs/layout-blocks.md#header) for layout block ([#184](https://github.com/yhatt/jsx-slack/issues/184), [#185](https://github.com/yhatt/jsx-slack/pull/185))

### Fixed

- Fix typos in `how-to-setup-jsx-transpiler.md` ([#183](https://github.com/yhatt/jsx-slack/pull/183) by [@mashabow](https://github.com/mashabow))

## v2.3.0 - 2020-07-22

### Added

- `type` prop and [`workflow_step` type](https://api.slack.com/reference/workflows/configuration-view) for `<Modal>` ([#176](https://github.com/yhatt/jsx-slack/issues/176), [#177](https://github.com/yhatt/jsx-slack/pull/177))
- React-compatible camelCased `dateTime` prop for `<time>` ([#179](https://github.com/yhatt/jsx-slack/issues/179), [#182](https://github.com/yhatt/jsx-slack/pull/182))
- Test against Node 14 ([#181](https://github.com/yhatt/jsx-slack/pull/181))

### Changed

- `datetime` prop for `<time>` is now aliasing into added camelCased prop ([#179](https://github.com/yhatt/jsx-slack/issues/179), [#182](https://github.com/yhatt/jsx-slack/pull/182))
- Upgrade dependent packages to the latest version ([#178](https://github.com/yhatt/jsx-slack/pull/178))

## v2.2.1 - 2020-07-17

### Fixed

- Fix wrong extension for the path of type definition: `.js` -> `.d.ts` ([#171](https://github.com/yhatt/jsx-slack/pull/171))
- Update how to generate Block Kit Builder URL in demo page ([#168](https://github.com/yhatt/jsx-slack/issues/168), [#172](https://github.com/yhatt/jsx-slack/pull/172))

### Changed

- Upgrade Node and dependent packages to the latest version ([#175](https://github.com/yhatt/jsx-slack/pull/175))

## v2.2.0 - 2020-05-21

### Added

- [`<Call>` layout block component](https://github.com/yhatt/jsx-slack/blob/main/docs/layout-blocks.md#call) to show a card of registered call ([#164](https://github.com/yhatt/jsx-slack/issues/164), [#165](https://github.com/yhatt/jsx-slack/pull/165))

### Changed

- Upgrade dependent packages to the latest version ([#166](https://github.com/yhatt/jsx-slack/pull/166))

## v2.1.0 - 2020-05-01

### Added

- Accept [special initial conversation `current`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#special-initial-conversation-current) in `<ConversationsSelect>` ([#154](https://github.com/yhatt/jsx-slack/issues/154), [#155](https://github.com/yhatt/jsx-slack/pull/155))

### Changed

- Upgrade Node and dependent packages to the latest version ([#158](https://github.com/yhatt/jsx-slack/pull/158))
- Refactor special link detection ([#159](https://github.com/yhatt/jsx-slack/pull/159))
- Update demo REPL ([#157](https://github.com/yhatt/jsx-slack/pull/157))
  - Move template examples on README into REPL demo
  - Use Web fonts to get better rendering
  - Disable preview button if Slack may return 414 error due to too long URL

## v2.0.0 - 2020-04-23

<p align="center">
  <img src="./demo/public/logo.svg" width="100" />
</p>

jsx-slack v2 has improved JSX structure and built-in components to output the _real_ JSON from JSX!

**[▶︎ See highlight of v2 updates](https://github.com/yhatt/jsx-slack/blob/main/docs/highlight/v2.md)**

### [Breaking](https://github.com/yhatt/jsx-slack/blob/main/docs/highlight/v2.md#breaking-change)

- Checked states defined in `<CheckboxGroup values>` and `<Checkbox checked>` do no longer merge

* [Breaking for TypeScript](https://github.com/yhatt/jsx-slack/blob/main/docs/highlight/v2.md#changes-for-TypeScript)
  - Require TypeScript >= 3.7 when using jsx-slack through TypeScript
  - Container components have strict type checking for its children
  - Exported type `JSXSlack.Child` and `JSXSlack.Children` have been renamed into `JSXSlack.ChildElement` and `JSXSlack.ChildElements` and no longer provided generics

### Changed

- Fully rewrote JSX structure to render from JSX to JSON directly ([#128](https://github.com/yhatt/jsx-slack/issues/128))
- All built-in components can render the partial JSON of Block Kit
- `<Home>` container now accepts `<Input type="hidden" />` and custom transformer to store private metadata
- `value` prop for `<Option>` has made optional to follow HTML specification
- `confirm` prop for interactive block elements accepts the raw confirm composition object
- `<a>` tag renders short syntax for hyperlink if possible
- Throws error with more helpful message and stacktrace when there is invalid JSX structure ([#143](https://github.com/yhatt/jsx-slack/pull/143))
- Bundle modules through rollup ([#144](https://github.com/yhatt/jsx-slack/pull/144))

### Added

- React-compatible public APIs: `JSXSlack.createElement`, `JSXSlack.isValidElement`, and `JSXSlack.Children` helpers
- HTML-compatible `<Option selected>` and `<RadioButton checked>`
- `value` prop as an alias into `initialXXX` prop in some interactive components
- Added JSDoc to many public APIs and components
- Support new JSX transpile via `automatic` runtime in Babel >= 7.9 _(experimental)_ ([#142](https://github.com/yhatt/jsx-slack/pull/142))
- REPL demo now generates the permalink to specific JSX ([#149](https://github.com/yhatt/jsx-slack/pull/149))
- Dark mode for REPL demo ([#150](https://github.com/yhatt/jsx-slack/pull/150))
- New logo and logo type ([#152](https://github.com/yhatt/jsx-slack/pull/152))

### Fixed

- Suggest string literals on IDE when typing the kind of conversation in `<ConversationsSelect include>` ([#145](https://github.com/yhatt/jsx-slack/pull/145))
- Fix typo in `README.md` ([#146](https://github.com/yhatt/jsx-slack/pull/146) by [@BLNCinema](https://github.com/BLNCinema))

### Removed

- Deprecated features in v1: `JSXSlack.legacyParser()` and `jsxslack.fragment`

### Deprecated

- `jsxslack.raw` template literal tag (It has become just an alias to `jsxslack` in v2)

## v1.7.0 - 2020-04-07

### Added

- `style` prop for `<Confirm>` composition object component ([#114](https://github.com/yhatt/jsx-slack/issues/114), [#139](https://github.com/yhatt/jsx-slack/pull/139))
- `<Button>` inherits its style to assigned confirm composition object if `<Confirm>` has not defined style ([#139](https://github.com/yhatt/jsx-slack/pull/139))

### Changed

- All props of `<Confirm>` component have made optional ([#138](https://github.com/yhatt/jsx-slack/issues/138), [#139](https://github.com/yhatt/jsx-slack/pull/139))
- Upgrade dependent packages to the latest version ([#137](https://github.com/yhatt/jsx-slack/pull/137), [#140](https://github.com/yhatt/jsx-slack/pull/140))

## v1.6.0 - 2020-03-20

### Added

- `responseUrlEnabled` property for modal's input component to `<ConversationsSelect>` and `<ChannelsSelect>` ([#134](https://github.com/yhatt/jsx-slack/issues/134), [#135](https://github.com/yhatt/jsx-slack/pull/135))
- Experimental filter properties to `<ConversationsSelect>`: `include`, `excludeExternalSharedChannels`, and `excludeBotUsers` ([#133](https://github.com/yhatt/jsx-slack/issues/133), [#136](https://github.com/yhatt/jsx-slack/pull/136))

## v1.5.1 - 2020-03-16

### Added

- `value` attribute for `<li>` element ([#130](https://github.com/yhatt/jsx-slack/pull/130))

### Fixed

- Fix mention detection to match to longer Slack ID ([#129](https://github.com/yhatt/jsx-slack/pull/129))

### Changed

- Upgrade deep dependencies ([#131](https://github.com/yhatt/jsx-slack/pull/131))

## v1.5.0 - 2020-03-12

### Changed

- Improve escaping special characters to keep original character as possible ([#124](https://github.com/yhatt/jsx-slack/issues/124), [#125](https://github.com/yhatt/jsx-slack/pull/125))
- Make JSX element for passing to Slack API serializable to JSON directly ([#126](https://github.com/yhatt/jsx-slack/pull/126))
- `jsxslack` template literal tag now returns raw JSX element, or JSON if serializable ([#127](https://github.com/yhatt/jsx-slack/pull/127))

### Added

- `jsxslack.raw` template literal tag to generate JSX element always ([#127](https://github.com/yhatt/jsx-slack/pull/127))

### Deprecated

- Confusable `jsxslack.fragment` template literal tag has deprecated (Use `jsxslack` or `jsxslack.raw` instead) ([#127](https://github.com/yhatt/jsx-slack/pull/127))

## v1.4.0 - 2020-03-06

### Added

- Support `type` attribute for `<ol>` element ([#117](https://github.com/yhatt/jsx-slack/pull/117))

### Changed

- Allow text formatting through mrkdwn and HTML-like elements in `<RadioButton>` ([#119](https://github.com/yhatt/jsx-slack/issues/119), [#122](https://github.com/yhatt/jsx-slack/pull/122))
- Change spaces for indenting lists into unicode spaces that were based on measured width in Slack's font ([#117](https://github.com/yhatt/jsx-slack/pull/117))
- Upgrade development Node and dependent packages to the latest version ([#123](https://github.com/yhatt/jsx-slack/pull/123))

### Fixed

- Prevent over-escaping for link and time formatting ([#118](https://github.com/yhatt/jsx-slack/issues/118), [#120](https://github.com/yhatt/jsx-slack/pull/120))

### Deprecated

- Mark the legacy parser as deprecated ([#121](https://github.com/yhatt/jsx-slack/pull/121))

## v1.3.1 - 2020-02-14

### Fixed

- Fix regression about not rendered special spaces around the content ([#113](https://github.com/yhatt/jsx-slack/pull/113))

## v1.3.0 - 2020-02-14

### Changed

- [Fully-rewrite HTML parser](https://github.com/yhatt/jsx-slack/blob/main/docs/html-like-formatting.md#about-parser) to reduce bundle size drastically (x43 smaller) ([#112](https://github.com/yhatt/jsx-slack/pull/112))

### Added

- [`legacyParser()`](https://github.com/yhatt/jsx-slack/blob/main/docs/html-like-formatting.md#legacy-parser) for switching into legacy parser ([#112](https://github.com/yhatt/jsx-slack/pull/112))

## v1.2.0 - 2020-02-10

### Added

- [`<CheckboxGroup>`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#checkbox-group) and [`<Checkbox>`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#checkbox) interactive component ([#108](https://github.com/yhatt/jsx-slack/issues/108), [#109](https://github.com/yhatt/jsx-slack/pull/109))
- [Redirect the content of `<small>` element into `description`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#redirect-small-into-description) in `<Checkbox>` and `<RadioButton>` ([#109](https://github.com/yhatt/jsx-slack/pull/109))
- Add the build for ES modules to make tree-shakable ([#110](https://github.com/yhatt/jsx-slack/pull/110))

### Changed

- Upgrade dependent packages to the latest version ([#107](https://github.com/yhatt/jsx-slack/pull/107))
- Upgrade development Node to 12.15.0

## v1.1.0 - 2020-01-20

### Added

- [Custom transformer](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#custom-transformer) for modal's private metadata ([#106](https://github.com/yhatt/jsx-slack/pull/106))

### Changed

- Mark `<Home>` container as stable ([#105](https://github.com/yhatt/jsx-slack/pull/105))

## v1.0.0 - 2020-01-10

### Breaking

- Components for [the outdated dialog](https://api.slack.com/dialogs) provided in `jsx-slack/dialog` can no longer use ([#84](https://github.com/yhatt/jsx-slack/pull/84))
- Drop Node 8 support ([#100](https://github.com/yhatt/jsx-slack/pull/100))

### Added

- `<Mrkdwn>` text composition component ([#73](https://github.com/yhatt/jsx-slack/issues/73), [#97](https://github.com/yhatt/jsx-slack/pull/97) by [@javaPhil](https://github.com/javaPhil), [#103](https://github.com/yhatt/jsx-slack/pull/103))

### Fixed

- Prevent over-escaping in valid emoji shorthand ([#98](https://github.com/yhatt/jsx-slack/issues/98), [#101](https://github.com/yhatt/jsx-slack/pull/101))

### Changed

- Upgrade dependent packages to the latest version ([#92](https://github.com/yhatt/jsx-slack/pull/92), [#104](https://github.com/yhatt/jsx-slack/pull/104))
- Upgrade development Node to 12.14.1 ([#104](https://github.com/yhatt/jsx-slack/pull/104))

### Removed

- Remove deprecated dialog support ([#84](https://github.com/yhatt/jsx-slack/pull/84), [#99](https://github.com/yhatt/jsx-slack/pull/99))
- Get rid of `lodash.flattendeep` dependency ([#102](https://github.com/yhatt/jsx-slack/pull/102))

## v0.12.0 - 2019-11-22

### Added

- Radio buttons for modal ([#88](https://github.com/yhatt/jsx-slack/issues/88), [#91](https://github.com/yhatt/jsx-slack/pull/91))
  - `<RadioButtonGroup>` now can use in `<Modal>` container and acts as input component for modal

### Changed

- Upgrade dependent packages to the latest version ([#90](https://github.com/yhatt/jsx-slack/pull/90))

## v0.11.1 - 2019-11-13

### Fixed

- Don't throw error even if `<Overflow>` has only one `<OverflowItem>` ([#85](https://github.com/yhatt/jsx-slack/issues/85), [#86](https://github.com/yhatt/jsx-slack/pull/86))
- Fix 413 error from Block Kit Builder when translated huge JSON on REPL demo ([#82](https://github.com/yhatt/jsx-slack/pull/82))
- Improve internal type definitions for overloaded props ([#83](https://github.com/yhatt/jsx-slack/pull/83))

### Changed

- Upgrade dependent packages to the latest version ([#87](https://github.com/yhatt/jsx-slack/pull/87))

## v0.11.0 - 2019-10-24

### Added

- Add (an experimental) `<Home>` container component for home tab ([#75](https://github.com/yhatt/jsx-slack/issues/75), [#78](https://github.com/yhatt/jsx-slack/pull/78))
- [`<RadioButtonGroup>`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#radio-button-group) and [`<RadioButton>`](https://github.com/yhatt/jsx-slack/blob/main/docs/block-elements.md#radio-button) interactive component for home tab ([#74](https://github.com/yhatt/jsx-slack/issues/74), [#80](https://github.com/yhatt/jsx-slack/pull/80))
- "Copy to clipboard" button on REPL demo ([#77](https://github.com/yhatt/jsx-slack/pull/77))

### Changed

- Upgrade Node for development to v12 LTS ([#79](https://github.com/yhatt/jsx-slack/pull/79))

### Fixed

- Throw an error when using `<File>` in `<Modal>` ([#76](https://github.com/yhatt/jsx-slack/pull/76))
- REPL demo can transfer the complete modal JSON to Block Kit Builder ([#77](https://github.com/yhatt/jsx-slack/pull/77))

### Deprecated

- Output warning about deprecated dialog components ([#72](https://github.com/yhatt/jsx-slack/pull/72))

## v0.10.2 - 2019-10-11

### Fixed

- Make interpolated fragments in template literal work correctly ([#71](https://github.com/yhatt/jsx-slack/pull/71))

## v0.10.1 - 2019-10-10

### Fixed

- Fix invalid array children in template literal ([#69](https://github.com/yhatt/jsx-slack/pull/69))

### Changed

- Upgrade Node and dependent packages to the latest version ([#70](https://github.com/yhatt/jsx-slack/pull/70))

## v0.10.0 - 2019-10-02

### Added

- [Multi-select menus](https://api.slack.com/reference/block-kit/block-elements#multi_select) ([#56](https://github.com/yhatt/jsx-slack/issues/56), [#58](https://github.com/yhatt/jsx-slack/pull/58))
- [Modals support](https://api.slack.com/block-kit/surfaces/modals) ([#57](https://github.com/yhatt/jsx-slack/issues/57))
  - `<Modal>` container component ([#60](https://github.com/yhatt/jsx-slack/pull/60))
  - `<Input>` layout block and component ([#61](https://github.com/yhatt/jsx-slack/pull/61))
  - `<Textarea>` component ([#62](https://github.com/yhatt/jsx-slack/pull/62))
  - Input-compatible props to select-like elements and `<DatePicker>` ([#63](https://github.com/yhatt/jsx-slack/pull/63))
  - Intrinsic HTML elements of input components ([#65](https://github.com/yhatt/jsx-slack/pull/65))
  - Add extra types for `<Input>` component ([#66](https://github.com/yhatt/jsx-slack/pull/66))
  - Update REPL demo to support Modals ([#68](https://github.com/yhatt/jsx-slack/pull/68))

### Changed

- Bump dependent packages to the latest version ([#59](https://github.com/yhatt/jsx-slack/pull/59))
- Check invalid elements in `<Blocks>` and `<Input>` strictly ([#64](https://github.com/yhatt/jsx-slack/pull/64))
- Split test cases for Block Kit components into multiple files ([#66](https://github.com/yhatt/jsx-slack/pull/66))
- Organize documentation ([#20](https://github.com/yhatt/jsx-slack/issues/20), [#67](https://github.com/yhatt/jsx-slack/pull/67))

### Deprecated

- Mark `<Dialog>` as soft-deprecated in favor of Slack Modals ([#60](https://github.com/yhatt/jsx-slack/pull/60))

## v0.9.2 - 2019-08-29

### Fixed

- Nested fragments fail ([#53](https://github.com/yhatt/jsx-slack/issues/53), [#54](https://github.com/yhatt/jsx-slack/pull/54))

### Changed

- Update dependent packages to the latest version ([#52](https://github.com/yhatt/jsx-slack/pull/52))

## v0.9.1 - 2019-08-15

### Fixed

- Fix regression of not preserved `<pre>` whitespaces ([#48](https://github.com/yhatt/jsx-slack/issues/48), [#49](https://github.com/yhatt/jsx-slack/pull/49))

### Changed

- Update dependent packages to the latest version ([#50](https://github.com/yhatt/jsx-slack/pull/50))

## v0.9.0 - 2019-08-15

### Breaking

- Disabled heuristic detection for HTML entities (Escaping works [just as same as React JSX](https://reactjs.org/docs/jsx-in-depth.html#string-literals)) ([#33](https://github.com/yhatt/jsx-slack/pull/33))
- Some raw characters for mrkdwn link, `<`, `>`, and `&` will always escape to entities ([#45](https://github.com/yhatt/jsx-slack/issues/45))

### Changed

- Improve html entity decoding in JSX and template literal tag ([#33](https://github.com/yhatt/jsx-slack/pull/33), [#45](https://github.com/yhatt/jsx-slack/issues/45), [#47](https://github.com/yhatt/jsx-slack/pull/47))
- Allow links in the inside of `<code>` and `<pre>` element ([#16](https://github.com/yhatt/jsx-slack/pull/16), [#46](https://github.com/yhatt/jsx-slack/pull/46))

## v0.8.1 - 2019-08-07

### Added

- Better dialog support for `jsxslack` template literal ([#42](https://github.com/yhatt/jsx-slack/issues/42), [#43](https://github.com/yhatt/jsx-slack/pull/43))
- Update REPL demo to add dialog example ([#43](https://github.com/yhatt/jsx-slack/pull/43))

### Fixed

- Coerce number-expected prop to integer ([#44](https://github.com/yhatt/jsx-slack/pull/44))

## v0.8.0 - 2019-08-06

### Added

- Dialog support ([#19](https://github.com/yhatt/jsx-slack/issues/19), [#39](https://github.com/yhatt/jsx-slack/pull/39))

### Fixed

- Don't prevent generating `<SelectFragment>` with no options ([#41](https://github.com/yhatt/jsx-slack/pull/41))

### Changed

- Update `htm` to [v2.2.0](https://github.com/developit/htm/releases/tag/2.2.0) ([#38](https://github.com/yhatt/jsx-slack/pull/38))

## v0.7.0 - 2019-07-29

### Added

- `<File>` block component ([#34](https://github.com/yhatt/jsx-slack/issues/34), [#35](https://github.com/yhatt/jsx-slack/pull/35))
- `jsxslack.fragment` template literal tag ([#32](https://github.com/yhatt/jsx-slack/pull/32))
- Codecov integration and coverage badge ([#36](https://github.com/yhatt/jsx-slack/pull/36))

### Changed

- Update dependent packages to the latest version ([#37](https://github.com/yhatt/jsx-slack/pull/37))

## v0.6.0 - 2019-07-20

### Added

- Convert `<span>` in `<Context>` into mrkdwn element ([#26](https://github.com/yhatt/jsx-slack/issues/26), [#31](https://github.com/yhatt/jsx-slack/pull/31))
- `<Fragment>` built-in component ([#29](https://github.com/yhatt/jsx-slack/pull/29))

## v0.5.1 - 2019-07-14

### Added

- Support mention to global user ID for Enterprise Grid ([#25](https://github.com/yhatt/jsx-slack/pull/25))

### Changed

- Update dependent packages to the latest version ([#28](https://github.com/yhatt/jsx-slack/pull/28))

## v0.5.0 - 2019-06-28

### Added

- Support Node.js 12 ([#23](https://github.com/yhatt/jsx-slack/pull/23))

### Changed

- Make interchangeable with `<Image>` component and intrinsic `<img>` tag ([#21](https://github.com/yhatt/jsx-slack/pull/21))
- Upgrade dependent packages to the latest version ([#24](https://github.com/yhatt/jsx-slack/pull/24))

### Removed

- Remove deprecated `<Block>` component ([#22](https://github.com/yhatt/jsx-slack/pull/22))

## v0.4.3 - 2019-05-15

### Fixed

- Fix vanishing styled channel links and mentions ([#15](https://github.com/yhatt/jsx-slack/issues/15), [#17](https://github.com/yhatt/jsx-slack/pull/17))

### Changed

- Upgrade dependent packages to the latest version ([#18](https://github.com/yhatt/jsx-slack/pull/18))

## v0.4.2 - 2019-04-13

### Added

- Add `style` prop for `<Button>` component ([#13](https://github.com/yhatt/jsx-slack/issues/13), [#14](https://github.com/yhatt/jsx-slack/pull/14))

## v0.4.1 - 2019-03-13

### Added

- `<Blocks>` container component ([#12](https://github.com/yhatt/jsx-slack/pull/12))

### Deprecated

- Mark a confusable `<Block>` fragment component as deprecated in favor of added `<Blocks>` ([#11](https://github.com/yhatt/jsx-slack/issues/11), [#12](https://github.com/yhatt/jsx-slack/pull/12))

## v0.4.0 - 2019-03-12

### Added

- Support nested list ([#10](https://github.com/yhatt/jsx-slack/pull/10))

## v0.3.0 - 2019-03-11

### Added

- Add `<SelectFragment>` component ([#9](https://github.com/yhatt/jsx-slack/pull/9))

### Changed

- Right-aligned number in ordered list ([#8](https://github.com/yhatt/jsx-slack/pull/8))

## v0.2.0 - 2019-03-07

### Added

- `jsxslack` template literal tag for using jsx-slack without transpiler, powered by [htm](https://github.com/developit/htm) ([#6](https://github.com/yhatt/jsx-slack/issues/6), [#7](https://github.com/yhatt/jsx-slack/pull/7))

### Fixed

- Improve `README.md` with some minor fixes ([#4](https://github.com/yhatt/jsx-slack/pull/4))
- Revert ignored audit ([#5](https://github.com/yhatt/jsx-slack/pull/5))

## v0.1.0 - 2019-03-01

- Initial release.
