import { registerPlugin, transform } from '@babel/standalone'
import babelJsx from '@babel/plugin-transform-react-jsx'
import debounce from 'lodash.debounce'
import * as JSXSlack from '../src/index'

const availableComponents = { ...JSXSlack }
delete availableComponents.default

registerPlugin('@babel/plugin-transform-react-jsx', babelJsx)

const jsx = document.getElementById('jsx')
const json = document.getElementById('json')

const convert = () => {
  try {
    const { code } = transform(jsx.value, {
      presets: ['es2015'],
      plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
    })

    const matched = code.match(/^"use strict";\n\n(h\([\s\S]+\);)$/)
    if (!matched) throw new Error('Invalid JSX')

    const funcParams = [
      'h',
      ...Object.keys(availableComponents),
      `"use strict";\nreturn ${matched[1]}`,
    ]

    // eslint-disable-next-line no-new-func
    const func = new Function(...funcParams)

    json.value = JSON.stringify(
      JSXSlack.JSXSlack(
        func(JSXSlack.default.h, ...Object.values(availableComponents))
      )
    )
  } catch (e) {
    console.error(e)
  }
}

jsx.addEventListener('input', debounce(convert, 700))

convert()
