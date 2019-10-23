/** @jsx JSXSlack.h */
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import {
  BlockComponentProps,
  BlocksInternal,
  blockTypeSymbol,
  InternalBlockType,
} from './Blocks'

export interface HomeProps {
  children: JSXSlack.Children<BlockComponentProps>
}

export const Home: JSXSlack.FC<HomeProps> = props => {
  // TODO: Use type definition to validate output
  return (
    <ObjectOutput
      type="home"
      blocks={JSXSlack(
        <BlocksInternal
          {...{ [blockTypeSymbol]: InternalBlockType.Home }}
          children={props.children}
        />
      )}
    />
  )
}
