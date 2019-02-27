import { registerPlugin, transform } from '@babel/standalone'
import babelJsx from '@babel/plugin-transform-react-jsx'
import CodeMirror from 'codemirror'
import debounce from 'lodash.debounce'
import * as JSXSlack from '../src/index'
import example from './example'
import schema from './schema'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

const availableComponents = { ...JSXSlack }
delete availableComponents.default

registerPlugin('@babel/plugin-transform-react-jsx', babelJsx)

const jsx = document.getElementById('jsx')
const json = document.getElementById('json')
const error = document.getElementById('error')
const errorDetails = document.getElementById('errorDetails')
const previewBtn = document.getElementById('preview')

json.addEventListener('click', () => json.select())

const completeAfter = (cm, pred) => {
  if (!pred || pred())
    setTimeout(() => {
      if (!cm.state.completionActive) cm.showHint({ completeSingle: false })
    }, 100)
  return CodeMirror.Pass
}

const completeIfAfterLt = cm =>
  completeAfter(cm, () => {
    const cur = cm.getCursor()
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<'
  })

const completeIfInTag = cm =>
  completeAfter(cm, () => {
    const tok = cm.getTokenAt(cm.getCursor())
    if (
      tok.type === 'string' &&
      (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
        tok.string.length === 1)
    )
      return false
    const inner = CodeMirror.innerMode(cm.getMode(), tok.state).state
    return inner.tagName
  })

const jsxEditor = CodeMirror(jsx, {
  autoCloseBrackets: true,
  autoCloseTags: true,
  extraKeys: {
    "'<'": completeAfter,
    "'/'": completeIfAfterLt,
    "' '": completeIfInTag,
    "'='": completeIfInTag,
    'Ctrl-Space': 'autocomplete',
  },
  hintOptions: { schemaInfo: schema },
  indentUnit: 2,
  lineWrapping: true,
  mode: 'jsx',
  value: example,
})

const convert = () => {
  try {
    const { code } = transform(jsxEditor.getValue(), {
      presets: ['es2015'],
      plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]],
    })

    const matched = code.match(/^"use strict";[\s\S]*\n\nh\([\s\S]+\);$/)
    if (!matched) throw new Error('Invalid JSX')

    const funcParams = ['h', ...Object.keys(availableComponents), code]

    // eslint-disable-next-line no-new-func
    const func = new Function(...funcParams)

    let output

    func((...args) => {
      output = JSXSlack.default.h(...args)
      return output
    }, ...Object.values(availableComponents))

    output = JSXSlack.JSXSlack(output)

    json.value = JSON.stringify(output, null, '  ')
    previewBtn.setAttribute(
      'href',
      `https://api.slack.com/tools/block-kit-builder?blocks=${encodeURIComponent(
        JSON.stringify(output)
      )}`
    )

    error.classList.add('hide')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)

    errorDetails.textContent = e.message.trim()
    error.classList.remove('hide')
  }
}

jsxEditor.on('change', debounce(convert, 600))

convert()
