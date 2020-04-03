import { PlainTextElement } from '@slack/types'
import { Option, OptionComposition } from './Option'
import { plainText } from './utils'
import { alias, resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface OptgroupComposition {
  label: PlainTextElement
  options: OptionComposition[]
}

interface OptgroupProps {
  children: JSXSlack.ChildNodes
  label: string
}

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
          throw new Error(
            `<Optgroup> must contain only <Option>${
              tag ? ` but it is included ${tag}` : ''
            }.`
          )
        }

        return [...reducer, opt]
      },
      []
    )

    return { label: plainText(label), options }
  }
)
