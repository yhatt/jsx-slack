import compact from 'mdast-util-compact'
import { CompilerFunction, Processor } from 'unified'

export const MrkdwnCompiler: CompilerFunction = root => {
  for (const node of compact(root, true).children) {
    // TODO: Build mrkdwn from root node
    // paragraph
    // blockquote
    // code
    // list
  }

  return ''
}

export default function remarkSlackStringifier(this: Processor) {
  this.Compiler = MrkdwnCompiler
}
