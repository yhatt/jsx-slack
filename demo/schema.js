const blockCommonAttrs = { id: null, blockId: null }
const interactiveComponents = [
  'Button',
  'Select',
  'ExternalSelect',
  'UsersSelect',
  'ConversationsSelect',
  'ChannelsSelect',
  'Overflow',
  'DatePicker',
]
const interactiveCommonAttrs = { actionId: null, confirm: null }
const markupHTML = [
  'Escape',
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'del',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'strike',
  'strong',
  'time',
  'ul',
]

export default {
  '!top': ['Blocks'],
  Blocks: {
    attrs: {},
    children: [
      'Section',
      'Divider',
      'Image',
      'Actions',
      'Context',

      // HTML compatible
      'section',
      'hr',
      'img',
    ],
  },

  // Block Kit component
  Section: {
    attrs: blockCommonAttrs,
    children: [
      'Field',
      'Image',
      'image',
      ...interactiveComponents,
      ...markupHTML,
    ],
  },
  section: {
    attrs: { id: null },
    children: [
      'Field',
      'Image',
      'image',
      ...interactiveComponents,
      ...markupHTML,
    ],
  },
  Field: { attrs: {}, children: markupHTML },
  Divider: { attrs: blockCommonAttrs, children: [] },
  hr: { attrs: { id: null }, children: [] },
  Image: {
    attrs: { src: null, alt: null, title: null, ...blockCommonAttrs },
    children: [],
  },
  img: {
    attrs: { src: null, alt: null, title: null, id: null },
    children: [],
  },
  Actions: { attrs: blockCommonAttrs, children: interactiveComponents },
  Context: {
    attrs: blockCommonAttrs,
    children: ['Image', 'img', ...markupHTML],
  },

  // Interactive components
  Button: {
    attrs: {
      value: null,
      url: null,
      style: ['primary', 'danger'],
      ...interactiveCommonAttrs,
    },
    children: [],
  },
  Select: {
    attrs: { placeholder: null, value: null, ...interactiveCommonAttrs },
    children: ['Option', 'Optgroup'],
  },
  Option: { attrs: { value: null }, children: [] },
  Optgroup: {
    attrs: { label: null },
    children: ['Option'],
  },
  ExternalSelect: {
    attrs: {
      placeholder: null,
      initialOption: null,
      minQueryLength: null,
      ...interactiveCommonAttrs,
    },
    children: [],
  },
  UsersSelect: {
    attrs: { placeholder: null, initialUser: null, ...interactiveCommonAttrs },
    children: [],
  },
  ConversationsSelect: {
    attrs: {
      placeholder: null,
      initialConversation: null,
      ...interactiveCommonAttrs,
    },
    children: [],
  },
  ChannelsSelect: {
    attrs: {
      placeholder: null,
      initialChannel: null,
      ...interactiveCommonAttrs,
    },
    children: [],
  },
  Overflow: { attrs: interactiveCommonAttrs, children: ['OverflowItem'] },
  OverflowItem: { attrs: { value: null, url: null }, children: [] },
  DatePicker: {
    attrs: { placeholder: null, initialDate: null, ...interactiveCommonAttrs },
    children: [],
  },

  // Composition objects
  Confirm: {
    attrs: { title: null, confirm: null, deny: null },
    children: markupHTML,
  },

  // Helper component
  Escape: {
    attrs: {},
    children: markupHTML,
  },

  // HTML elements
  a: { attrs: { href: null }, children: markupHTML.filter(t => t !== 'a') },
  b: {
    attrs: {},
    children: markupHTML.filter(t => t !== 'b' && t !== 'strong'),
  },
  blockquote: {
    attrs: {},
    children: markupHTML.filter(t => t !== 'blockquote'),
  },
  br: { attrs: {}, children: [] },
  code: { attrs: {}, children: [] },
  del: {
    attrs: {},
    children: markupHTML.filter(
      t => t !== 's' && t !== 'strike' && t !== 'del'
    ),
  },
  em: { attrs: {}, children: markupHTML.filter(t => t !== 'i' && t !== 'em') },
  i: { attrs: {}, children: markupHTML.filter(t => t !== 'i' && t !== 'em') },
  li: {
    attrs: {},
    children: markupHTML.filter(t => t !== 'ul' && t !== 'ol' && t !== 'li'),
  },
  ol: { attrs: { start: null }, children: ['li'] },
  p: { attrs: {}, children: markupHTML.filter(t => t !== 'p') },
  pre: { attrs: {}, children: [] },
  s: {
    attrs: {},
    children: markupHTML.filter(
      t => t !== 's' && t !== 'strike' && t !== 'del'
    ),
  },
  strike: {
    attrs: {},
    children: markupHTML.filter(
      t => t !== 's' && t !== 'strike' && t !== 'del'
    ),
  },
  strong: {
    attrs: {},
    children: markupHTML.filter(t => t !== 'b' && t !== 'strong'),
  },
  time: { attrs: { datetime: null, fallback: null }, children: [] },
  ul: { attrs: {}, children: ['li'] },
}
