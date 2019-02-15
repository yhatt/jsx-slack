/** @jsx h */
import { h, Block } from '../src/index'

describe('jsx-slack', () => {
  it('builds JSON object for Slack Block Kit from JSX', () =>
    expect(<Block />).toBe('JSX'))
})
