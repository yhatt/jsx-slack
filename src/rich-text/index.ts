import type { RichTextBlock } from '@slack/types'
import type { RootContent } from 'hast'
import { visit } from 'unist-util-visit'
import { JSXSlack } from '../jsx'
import { decodeEntity } from '../mrkdwn/escape'
import parser from '../mrkdwn/parser'
// import remarkSlackStringifier from '../mrkdwn/stringifier'
import {
  hastUtilToMdast,
  hastUtilToMdastRoot as root,
  hastUtilToMdastListItem as listItem,
  hastUtilToMdastTextarea as toTextNode,
} from '../prebundles/hastUtilToMdast'
import { parseJSX } from './jsx'

const list = (state, node) => {
  const ordered = node.tagName === 'ol'
  const orderedType = ordered ? node.properties.type ?? '1' : null
  const start = ordered ? Number.parseInt(node.properties.start ?? 1, 10) : null

  // Mark implied list item
  let children = state.handlers.span(state, node, undefined)

  if (children) {
    children = ([] as any[]).concat(children).map((item) => {
      if (item.type !== 'listItem')
        return { type: 'listItem', data: { implied: true }, children: [item] }

      return item
    })
  }

  const result: any = {
    type: 'list',
    ordered,
    orderedType,
    start,
    children,
  }

  state.patch(node, result)

  return result
}

const hast2mdast: typeof hastUtilToMdast = (...args) => {
  const mdast = hastUtilToMdast(...args)

  // Restore text nodes
  visit(mdast, (n) => {
    if (n.type.startsWith('text-jsxslack-')) n.type = 'text'
  })

  return mdast
}

interface BuildingElement {
  type: 'section' | 'pre' | 'ul' | 'ol' | 'blockquote'
  nodes: RootContent[]
}

const htmlToRichText = (html: string) => {
  console.dir(html, { depth: null })

  const rehype = parser(html)
  console.dir(rehype, { depth: null })

  // Build rich text elements from rehype AST
  const elements: RichTextBlock['elements'] = []
  let currentElement: BuildingElement | null = null

  const pushNode = () => {
    if (currentElement && currentElement.nodes.length > 0) {
      switch (currentElement.type) {
        case 'section':
          elements.push({
            type: 'rich_text_section',
            elements: currentElement.nodes as any,
          })
          break
        case 'pre':
          elements.push({
            type: 'rich_text_preformatted',
            elements: currentElement.nodes as any,
          })
          break
        case 'ul':
          elements.push({
            type: 'rich_text_list',
            style: 'bullet',
            elements: currentElement.nodes as any,
          })
          break
        case 'ol':
          elements.push({
            type: 'rich_text_list',
            style: 'ordered',
            elements: currentElement.nodes as any,
          })
          break
        case 'blockquote':
          elements.push({
            type: 'rich_text_quote',
            elements: currentElement.nodes as any,
          })
          break
      }
    }
    currentElement = null
  }

  const setElement = (type: BuildingElement['type']) => {
    if (currentElement && currentElement.type !== type) pushNode()
    if (!currentElement) currentElement = { type, nodes: [] }
  }

  const buildRichText = (
    nodes: RootContent[],
    {
      level = 0,
      blocks = ['pre', 'ul', 'ol', 'blockquote'],
    }: {
      level?: number
      blocks?: BuildingElement['type'][]
    } = {},
  ) => {
    for (const node of nodes) {
      if (node.type === 'text') {
        if (level === 0) setElement('section')
        currentElement?.nodes.push(node)
      } else if (node.type === 'element') {
        if ((blocks as string[]).includes(node.tagName)) {
          if (level === 0) setElement(node.tagName as BuildingElement['type'])

          buildRichText(node.children, {
            level: level + 1,
            blocks:
              node.tagName === 'ul' || node.tagName === 'ol'
                ? ['ul', 'ol']
                : [],
          })
        } else {
          if (level === 0) setElement('section')
          currentElement?.nodes.push(node)
        }
      }
    }
  }

  buildRichText(rehype.children)
  pushNode()

  console.dir(elements, { depth: null })
  return
}

export const richText = (children: JSXSlack.ChildElements) =>
  htmlToRichText(parseJSX(children, []).join(''))
