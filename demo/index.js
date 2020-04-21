import CodeMirror from 'codemirror'
import debounce from 'lodash.debounce'
import { JSXSlack, jsxslack } from '../src/index'
import { convert } from './convert'
import examples from './example'
import { parseHash, setJSXHash } from './parse-hash'
import schema from './schema'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

const jsx = document.getElementById('jsx')
const json = document.getElementById('json')
const copy = document.getElementById('copy')
const error = document.getElementById('error')
const errorDetails = document.getElementById('errorDetails')
const examplesSelect = document.getElementById('examples')
const previewBtn = document.getElementById('preview')

// Parse hash
const initialValue = parseHash()

if (initialValue.example) {
  examplesSelect.value = initialValue.example
  if (examplesSelect.value !== initialValue.example) examplesSelect.value = ''
}

// CodeMirror
const completeAfter = (cm, pred) => {
  if (!pred || pred())
    setTimeout(() => {
      if (!cm.state.completionActive) cm.showHint({ completeSingle: false })
    }, 100)
  return CodeMirror.Pass
}

const completeIfAfterLt = (cm) =>
  completeAfter(cm, () => {
    const cur = cm.getCursor()
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<'
  })

const completeIfInTag = (cm) =>
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
  value: initialValue.text,
})

const setPreview = (url) => {
  if (url) {
    previewBtn.removeAttribute('tabindex')
    previewBtn.setAttribute('href', url)
    previewBtn.classList.remove('disabled')
  } else {
    previewBtn.setAttribute('tabindex', -1)
    previewBtn.classList.add('disabled')
  }
}

const process = () => {
  try {
    const { text, url } = convert(jsxEditor.getValue())

    json.value = text
    setPreview(url)

    error.classList.add('hide')
  } catch (e) {
    console.error(e)

    errorDetails.textContent = e.message.trim()
    error.classList.remove('hide')
  }
}

const debouncedProcess = debounce(process, 600)
const onChangeEditor = () => {
  setJSXHash(jsxEditor.getValue())
  debouncedProcess()
}

jsxEditor.on('change', onChangeEditor)

process()

examplesSelect.addEventListener('change', () => {
  if (examplesSelect.value) {
    jsxEditor.off('change', onChangeEditor)
    setTimeout(() => jsxEditor.on('change', onChangeEditor), 0)

    window.location.hash = `#${examplesSelect.value}`
    jsxEditor.setValue(examples[examplesSelect.value])
    process()
  }
})

copy.addEventListener('click', () => {
  const tmpTextarea = document.createElement('textarea')
  tmpTextarea.value = json.value
  tmpTextarea.style =
    'position:absolute;left:0;top:0;opacity:0;pointer-events:none;'

  document.body.appendChild(tmpTextarea)
  tmpTextarea.select()

  document.execCommand('copy')
  document.body.removeChild(tmpTextarea)
  copy.focus()
})
