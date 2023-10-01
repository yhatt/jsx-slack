/* eslint-disable no-console */
import pako from 'pako'
import { convert } from './convert'
import examples from './example'

const getHashBody = (hash) =>
  hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : undefined

const inflateJSX = (base64url) =>
  pako.inflate(
    Uint8Array.from(
      atob(base64url.replace(/_/g, '/').replace(/-/g, '+')),
      (v) => v.charCodeAt(0),
    ),
    { to: 'string' },
  )

export const parseHash = ({
  hash = window.location.hash,
  strict = false,
} = {}) => {
  const hashBody = getHashBody(hash)

  if (examples[hashBody]) return { example: hashBody, text: examples[hashBody] }
  if (hashBody && hashBody.startsWith('jsx:')) {
    try {
      return { jsx: true, text: inflateJSX(hashBody.slice(4)) }
    } catch (e) {
      if (strict) {
        throw e
      } else {
        console.warn(e)
        console.warn('Invalid hash for JSX: Fallback to the default.')
      }
    }
  }
  if (strict) throw new Error('Invalid hash error')

  return { text: examples.message }
}

export const setJSXHash = (jsx) => {
  window.location.replace(
    `#jsx:${btoa(String.fromCharCode(...pako.deflate(jsx)))
      .replace(/\//g, '_')
      .replace(/\+/g, '-')}`,
  )
}

// Parse "bkb:" prefix to redirect into Block Kit Builder immediately
const { hash } = window.location

if (hash.startsWith('#bkb:')) {
  const targetHash = `#${hash.slice(5)}`

  try {
    const { text } = parseHash({ hash: targetHash, strict: true })
    const { url } = convert(text)

    if (!url) throw new Error('Corresponded URL cannot generate.')

    document.body.style.display = 'none'
    window.location.replace(url)
  } catch (e) {
    console.warn(e)
    console.warn('Failed to parse JSX: Fallback to the original hash.')

    window.location.replace(targetHash)
  }
}
