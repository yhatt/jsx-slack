# Change Log

## [Unreleased]

### Breaking

- Disabled heuristic detection for HTML entities (Now escaping works [just like JSX](https://reactjs.org/docs/jsx-in-depth.html#string-literals)) ([#33](https://github.com/speee/jsx-slack/pull/33))
- Some raw characters for mrkdwn link, `<`, `>`, and `&` will always escape to entities ([#45](https://github.com/speee/jsx-slack/issues/45))

### Changed

- Improve html entity decoding in JSX and template literal tag ([#33](https://github.com/speee/jsx-slack/pull/33), [#45](https://github.com/speee/jsx-slack/issues/45))

## v0.8.1 - 2019-08-07

### Added

- Better dialog support for `jsxslack` template literal ([#42](https://github.com/speee/jsx-slack/issues/42), [#43](https://github.com/speee/jsx-slack/pull/43))
- Update REPL demo to add dialog example ([#43](https://github.com/speee/jsx-slack/pull/43))

### Fixed

- Coerce number-expected prop to integer ([#44](https://github.com/speee/jsx-slack/pull/44))

## v0.8.0 - 2019-08-06

### Added

- [Dialog support](docs/jsx-components-for-dialog.md) ([#19](https://github.com/speee/jsx-slack/issues/19), [#39](https://github.com/speee/jsx-slack/pull/39))

### Fixed

- Don't prevent generating `<SelectFragment>` with no options ([#41](https://github.com/speee/jsx-slack/pull/41))

### Changed

- Update `htm` to [v2.2.0](https://github.com/developit/htm/releases/tag/2.2.0) ([#38](https://github.com/speee/jsx-slack/pull/38))

## v0.7.0 - 2019-07-29

### Added

- `<File>` block component ([#34](https://github.com/speee/jsx-slack/issues/34), [#35](https://github.com/speee/jsx-slack/pull/35))
- `jsxslack.fragment` template literal tag ([#32](https://github.com/speee/jsx-slack/pull/32))
- Codecov integration and coverage badge ([#36](https://github.com/speee/jsx-slack/pull/36))

### Changed

- Update dependent packages to the latest version ([#37](https://github.com/speee/jsx-slack/pull/37))

## v0.6.0 - 2019-07-20

### Added

- Convert `<span>` in `<Context>` into mrkdwn element ([#26](https://github.com/speee/jsx-slack/issues/26), [#31](https://github.com/speee/jsx-slack/pull/31))
- `<Fragment>` built-in component ([#29](https://github.com/speee/jsx-slack/pull/29))

## v0.5.1 - 2019-07-14

### Added

- Support mention to global user ID for Enterprise Grid ([#25](https://github.com/speee/jsx-slack/pull/25))

### Changed

- Update dependent packages to the latest version ([#28](https://github.com/speee/jsx-slack/pull/28))

## v0.5.0 - 2019-06-28

### Added

- Support Node.js 12 ([#23](https://github.com/speee/jsx-slack/pull/23))

### Changed

- Make interchangeable with `<Image>` component and intrinsic `<img>` tag ([#21](https://github.com/speee/jsx-slack/pull/21))
- Upgrade dependent packages to the latest version ([#24](https://github.com/speee/jsx-slack/pull/24))

### Removed

- Remove deprecated `<Block>` component ([#22](https://github.com/speee/jsx-slack/pull/22))

## v0.4.3 - 2019-05-15

### Fixed

- Fix vanishing styled channel links and mentions ([#15](https://github.com/speee/jsx-slack/issues/15), [#17](https://github.com/speee/jsx-slack/pull/17))

### Changed

- Upgrade dependent packages to the latest version ([#18](https://github.com/speee/jsx-slack/pull/18))

## v0.4.2 - 2019-04-13

### Added

- Add `style` prop for `<Button>` component ([#13](https://github.com/speee/jsx-slack/issues/13), [#14](https://github.com/speee/jsx-slack/pull/14))

## v0.4.1 - 2019-03-13

### Added

- `<Blocks>` container component ([#12](https://github.com/speee/jsx-slack/pull/12))

### Deprecated

- Mark a confusable `<Block>` fragment component as deprecated in favor of added `<Blocks>` ([#11](https://github.com/speee/jsx-slack/issues/11), [#12](https://github.com/speee/jsx-slack/pull/12))

## v0.4.0 - 2019-03-12

### Added

- Support nested list ([#10](https://github.com/speee/jsx-slack/pull/10))

## v0.3.0 - 2019-03-11

### Added

- Add `<SelectFragment>` component ([#9](https://github.com/speee/jsx-slack/pull/9))

### Changed

- Right-aligned number in ordered list ([#8](https://github.com/speee/jsx-slack/pull/8))

## v0.2.0 - 2019-03-07

### Added

- `jsxslack` template literal tag for using jsx-slack without transpiler, powered by [htm](https://github.com/developit/htm) ([#6](https://github.com/speee/jsx-slack/issues/6), [#7](https://github.com/speee/jsx-slack/pull/7))

### Fixed

- Improve `README.md` with some minor fixes ([#4](https://github.com/speee/jsx-slack/pull/4))
- Revert ignored audit ([#5](https://github.com/speee/jsx-slack/pull/5))

## v0.1.0 - 2019-03-01

- Initial release.
