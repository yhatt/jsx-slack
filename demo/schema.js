const blockCommonAttrs = { id: null, blockId: null }
const blockInteractiveComponents = [
  'Button',
  'Select',
  'ExternalSelect',
  'UsersSelect',
  'ConversationsSelect',
  'ChannelsSelect',
  'Overflow',
  'DatePicker',
]
const blockInteractiveCommonAttrs = { actionId: null, confirm: null }
const dialogElementAttrs = {
  name: null,
  label: null,
  title: null,
  hint: null,
  placeholder: null,
  required: ['', 'required'],
}
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

const schema = {
  '!top': ['Blocks', 'Dialog'],

  // Block Kit
  Blocks: {
    attrs: {},
    children: [
      'Section',
      'Divider',
      'Image',
      'Actions',
      'Context',
      'File',

      // HTML compatible
      'section',
      'hr',
      'img',
    ],
  },

  // Block Kit components
  Section: {
    attrs: blockCommonAttrs,
    children: [
      'Field',
      'Image',
      'img',
      ...blockInteractiveComponents,
      ...markupHTML,
    ],
  },
  section: {
    attrs: { id: null },
    children: [
      'Field',
      'Image',
      'img',
      ...blockInteractiveComponents,
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
  Actions: { attrs: blockCommonAttrs, children: blockInteractiveComponents },
  Context: {
    attrs: blockCommonAttrs,
    children: ['Image', 'img', 'span', ...markupHTML],
  },
  File: {
    attrs: { externalId: null, source: ['remote'], ...blockCommonAttrs },
    children: [],
  },

  // Block elements
  Button: {
    attrs: {
      value: null,
      url: null,
      style: ['primary', 'danger'],
      ...blockInteractiveCommonAttrs,
    },
    children: [],
  },
  Select: {
    attrs: { placeholder: null, value: null, ...blockInteractiveCommonAttrs },
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
      ...blockInteractiveCommonAttrs,
    },
    children: [],
  },
  UsersSelect: {
    attrs: {
      placeholder: null,
      initialUser: null,
      ...blockInteractiveCommonAttrs,
    },
    children: [],
  },
  ConversationsSelect: {
    attrs: {
      placeholder: null,
      initialConversation: null,
      ...blockInteractiveCommonAttrs,
    },
    children: [],
  },
  ChannelsSelect: {
    attrs: {
      placeholder: null,
      initialChannel: null,
      ...blockInteractiveCommonAttrs,
    },
    children: [],
  },
  Overflow: { attrs: blockInteractiveCommonAttrs, children: ['OverflowItem'] },
  OverflowItem: { attrs: { value: null, url: null }, children: [] },
  DatePicker: {
    attrs: {
      placeholder: null,
      initialDate: null,
      ...blockInteractiveCommonAttrs,
    },
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

  // Dialog
  Dialog: {
    attrs: {
      callbackId: null,
      title: null,
      state: null,
      submitLabel: null,
      notifyOnCancel: ['', 'notifyOnCancel'],
    },
    children: [
      'Input',
      'Textarea',
      'Dialog.Select',
      'Dialog.ExternalSelect',
      'Dialog.UsersSelect',
      'Dialog.ConversationsSelect',
      'Dialog.ChannelsSelect',
    ],
  },

  // Dialog components
  Input: {
    attrs: {
      type: ['text', 'email', 'number', 'tel', 'url', 'hidden', 'submit'],
      ...dialogElementAttrs,
      value: null,
      maxLength: null,
      minLength: null,
    },
    children: [],
  },
  Textarea: {
    attrs: {
      ...dialogElementAttrs,
      value: null,
      subtype: ['email', 'number', 'tel', 'url'],
      maxLength: null,
      minLength: null,
    },
    children: [],
  },
  'Dialog.Select': {
    attrs: { ...dialogElementAttrs, value: null },
    children: ['Option', 'Optgroup'],
  },
  'Dialog.ExternalSelect': {
    attrs: { ...dialogElementAttrs, initialOption: null, minQueryLength: null },
    children: [],
  },
  'Dialog.UsersSelect': {
    attrs: { ...dialogElementAttrs, initialUser: null },
    children: [],
  },
  'Dialog.ConversationsSelect': {
    attrs: { ...dialogElementAttrs, initialConversation: null },
    children: [],
  },
  'Dialog.ChannelsSelect': {
    attrs: { ...dialogElementAttrs, initialChannel: null },
    children: [],
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
  span: { attrs: {}, children: markupHTML },
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

export default schema
