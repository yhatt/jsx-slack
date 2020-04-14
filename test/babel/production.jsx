/** @jsxImportSource @speee-js/jsx-slack */
jest.mock('../../jsx-runtime')

it('does not have __source prop', () => {
  const Component = ({ __source }) => __source
  expect(<Component />).toBeUndefined()
})
