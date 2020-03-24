/** @jsx JSXSlack.h */
import { JSXSlack, createComponent } from '../src/v2/jsx'

describe('JSXSlack v2', () => {
  describe('JSXSlack.Children helpers', () => {
    describe('JSXSlack.Children.map()', () => {
      it('invokes callback function with traversed children', () => {
        expect(JSXSlack.Children.map('hi', (v) => v)).toStrictEqual(['hi'])
        expect(JSXSlack.Children.map([1, 2], (_, i) => i)).toStrictEqual([0, 1])
        expect(JSXSlack.Children.map([['']], (v) => v)).toStrictEqual([''])
        expect(
          JSXSlack.Children.map([['a', 'b'], 'c'], function callbackFn() {
            return this
          })
        ).toStrictEqual(['a', 'b', 'c'])
      })

      it('returns passed value as is without calling callback when passed a nullish value', () => {
        const callbackFn = jest.fn()

        expect(JSXSlack.Children.map(null, callbackFn)).toBeNull()
        expect(JSXSlack.Children.map(undefined, callbackFn)).toBeUndefined()
        expect(callbackFn).toBeCalledTimes(0)
      })

      it('invokes callback function with null when the traversed child is invalid as element', () => {
        expect.assertions(4)

        JSXSlack.Children.map([null, undefined, true, false], (v) =>
          expect(v).toBeNull()
        )
      })

      it('does not collect mapped value when returned nullish value by callback', () => {
        expect(JSXSlack.Children.map('test', () => null)).toHaveLength(0)
        expect(JSXSlack.Children.map('test', () => undefined)).toHaveLength(0)

        // false, zero, and empty string are not nullish value
        expect(JSXSlack.Children.map('test', () => false)).toHaveLength(1)
        expect(JSXSlack.Children.map('test', () => 0)).toHaveLength(1)
        expect(JSXSlack.Children.map('test', () => '')).toHaveLength(1)
      })

      it('does not traverse children of a fragment', () => {
        expect(
          JSXSlack.Children.map(
            <JSXSlack.Fragment>
              abc
              {123}
            </JSXSlack.Fragment>,
            (v) => v
          )
        ).toStrictEqual([['abc', 123]])

        const ArrayComponent: JSXSlack.FC = () => (
          <JSXSlack.Fragment children={[7, 8, 9]} />
        )

        expect(
          JSXSlack.Children.map(
            [
              <JSXSlack.Fragment children={[1, 2, 3]} />,
              [4, 5, 6],
              <ArrayComponent />,
            ],
            (v) => v
          )
        ).toStrictEqual([[1, 2, 3], 4, 5, 6, [7, 8, 9]])
      })

      it('does not traverse an array returned from jsx-slack component', () => {
        const BuiltinComponent = createComponent(() => ['built-in', 'cmp'])
        const UserComponent: any = () => ['user', 'cmp']

        expect(
          JSXSlack.Children.map(
            [<BuiltinComponent />, <UserComponent />],
            (v) => v
          )
        ).toStrictEqual([['built-in', 'cmp'], 'user', 'cmp'])
      })
    })

    describe('JSXSlack.Children.forEach()', () => {
      it('calls JSXSlack.Children.map() but returns no value', () => {
        const spyMap = jest.spyOn(JSXSlack.Children, 'map')
        const callbackFn = jest.fn(() => 'test')

        expect(JSXSlack.Children.forEach([1, 2, 3], callbackFn)).toBeUndefined()
        expect(spyMap).toBeCalledWith([1, 2, 3], callbackFn)
      })
    })

    describe('JSXSlack.Children.toArray()', () => {
      it('returns flatten array', () => {
        const ObjComponent = createComponent(() => ({ foo: 'bar' }))

        // Array returned from component must not make flatten
        const ArrayComponent = createComponent(() => [1, 2, 3])

        // Functional component by user must return a fragment to pass array
        const UserArrayComponent: JSXSlack.FC = () => (
          <JSXSlack.Fragment children={[4, 5, 6]} />
        )

        // But also can return array directly for React compatibility
        const ReactLikeComponent: any = () => [7, 8, 9]

        expect(
          JSXSlack.Children.toArray(
            <JSXSlack.Fragment>
              a<JSXSlack.Fragment>b{'c'}</JSXSlack.Fragment>
              {false}
              {true && ['d', 'e']}
              {undefined}
              <JSXSlack.Fragment>
                {null}
                <ObjComponent />
                {0}
                <ArrayComponent />
              </JSXSlack.Fragment>
              <UserArrayComponent />
              <ReactLikeComponent />
            </JSXSlack.Fragment>
          )
        ).toHaveLength(14)
      })
    })
  })
})
