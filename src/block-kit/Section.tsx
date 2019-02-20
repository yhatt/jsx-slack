/** @jsx JSXSlack.h */
import { SectionBlock } from '@slack/client'
import { JSXSlack } from '../jsx'
import { ObjectOutput } from '../utils'
import html from '../html'
import { BlockComponentProps } from './Block'

export const Section: JSXSlack.FC<
  BlockComponentProps & { children: JSXSlack.Children<{}> }
> = ({ blockId, children, id }) => {
  return (
    <ObjectOutput<SectionBlock>
      type="section"
      block_id={id || blockId}
      text={{
        type: 'mrkdwn',
        text: html(children),
        verbatim: false,
      }}
    />
  )
}
