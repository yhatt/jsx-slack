/** @jsxImportSource jsx-slack */
jest.mock('../../jsx-runtime')

describe('Babel transpilation through automatic runtime (Production mode)', () => {
  it('does not have __source prop', () => {
    const Component = ({ __source }) => __source
    expect(<Component />).toBeUndefined()
  })
})
