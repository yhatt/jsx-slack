import { PlainTextElement } from '@slack/types'
import { Option, OptionComposition } from './Option'
import { plainText } from './utils'
import { alias, resolveTagName } from '../utils'
import { JSXSlackError } from '../../error'
import { JSXSlack, createComponent } from '../../jsx'

export interface OptgroupComposition {
  label: PlainTextElement
  options: OptionComposition[]
}

export interface OptgroupProps {
  children: JSXSlack.ChildNodes

  /** A plain-text string for the label of the option group. */
  label: string
}

/**
 * Generate the composition object, for the group of option items in the static
 * select element.
 *
 * It must contain `<Option>` elements as its children.
 *
 * @returns The JSON of the composition object for option group
 */
export const Optgroup = createComponent<OptgroupProps, OptgroupComposition>(
  'Option',
  ({ children, label }) => {
    const options = JSXSlack.Children.toArray(children).reduce(
      (reducer: OptionComposition[], option) => {
        if (!JSXSlack.isValidElement(option)) return reducer

        let opt: any = option

        if (opt.$$jsxslack.type === 'option') opt = alias(opt, Option, false)
        if (opt.$$jsxslack.type !== Option) {
          const tag = resolveTagName(option)
          throw new JSXSlackError(
            `<Optgroup> must contain only <Option>${
              tag ? ` but it is included ${tag}` : ''
            }.`,
            option
          )
        }

        return [...reducer, opt]
      },
      []
    )

    return { label: plainText(label), options }
  }
)
