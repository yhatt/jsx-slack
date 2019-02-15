declare namespace JSX {
  interface IntrinsicElements {
    [elmName: string]: any
  }
}

export function h(...args) {
  console.log(args)

  return 'JSX'
}

export function Block() {}
