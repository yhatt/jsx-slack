import {
  Option,
  OptionComposition,
  optionSelectedSymbol,
} from '../composition/Option'
import { Optgroup, OptgroupComposition } from '../composition/Optgroup'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, BuiltInComponent, createComponent } from '../../jsx'

export const selectFragmentSelectedOptionsSymbol = Symbol(
  'jsx-slack-select-fragment-selected-options'
)

export type SelectFragmentObject = (
  | { options: OptionComposition[] }
  | { option_groups: OptgroupComposition[] }
) & {
  readonly [selectFragmentSelectedOptionsSymbol]?: OptionComposition[]
}

export interface SelectFragmentProps {
  children?: JSXSlack.ChildNodes
}

export const SelectFragmentInternal = createComponent<
  SelectFragmentProps & { from?: BuiltInComponent<any> },
  SelectFragmentObject
>('SelectFragment', ({ children, from }) => {
  let count = 0
  let mode: typeof Option | typeof Optgroup | undefined

  const parent = `<${from?.$$jsxslackComponent.name || 'SelectFragment'}>`
  const selected: OptionComposition[] = []

  const opts = JSXSlack.Children.toArray(children).reduce(
    (reduced: (OptionComposition | OptgroupComposition)[], child) => {
      if (!JSXSlack.isValidElement(child)) return reduced

      let opt: any = child

      if (child.$$jsxslack.type === 'option') opt = alias(child, Option, false)
      if (child.$$jsxslack.type === 'optgroup')
        opt = alias(child, Optgroup, false)

      const { type } = opt.$$jsxslack

      if (type === Option) {
        count += 1
        if (opt[optionSelectedSymbol]) selected.push(opt)
      } else if (type === Optgroup) {
        count += opt.options.length
        selected.push(...opt.options.filter((o) => o[optionSelectedSymbol]))
      } else {
        const tag = resolveTagName(child)
        throw new Error(
          `${parent} must contain either of <Option> or <Optgroup>${
            tag ? ` but it is included ${tag}` : ''
          }.`
        )
      }

      if (mode && mode !== type)
        throw new Error(
          `<Option> and <Optgroup> cannot be mixed in the immediate children of ${parent}.`
        )

      mode = type
      return [...reduced, opt]
    },
    []
  )

  if (count > 0) {
    const ret = mode === Optgroup ? { option_groups: opts } : { options: opts }

    return Object.defineProperty(ret, selectFragmentSelectedOptionsSymbol, {
      value: selected,
    })
  }

  return { options: [] }
})

/**
 * Generate JSON for the external data source of `<ExternalSelect>`.
 *
 * It must contain elements either of `<Option>` or `<Optgroup>` as immediate
 * children. The outputted JSON has an array of corresponded elements, or empty
 * options array if it has provided no options.
 *
 * For example, {@link https://slack.dev/bolt/concepts#options Bolt framework for JavaScript}
 * by Slack can provide external data source easily by using `<SelectFragment>`
 * together.
 *
 * ```javascript
 * // `app` is an instance of the app created by Bolt framework
 * app.options('external_action', async ({ ack }) => {
 *  await ack(
 *    <SelectFragment>
 *      <Option value="a">Option A</Option>
 *      <Option value="b">Option B</Option>
 *      <Option value="c">Option C</Option>
 *    </SelectFragment>
 *  )
 * })
 * ```
 *
 * @return The JSON for the external data source
 */
export const SelectFragment: BuiltInComponent<SelectFragmentProps> = SelectFragmentInternal
