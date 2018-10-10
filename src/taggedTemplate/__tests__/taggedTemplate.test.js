import { taggedTemplate } from '../taggedTemplate'
import { createObservable, observe } from '../../observable/observable'
import { flushPromises } from '../../../tests/utils/flushPromises'

describe('taggedTemplate', () => {
  test('retorna el string y un valor ya interpolado', () => {
    const string = 'World'
    const actual = taggedTemplate`Hello ${string}`
    expect(actual).toEqual('Hello World')
  })

  test('tiene soporte para varios valores', () => {
    const value1 = 'JSDay'
    const value2 = '2018'
    const actual = taggedTemplate`Hello ${value1} ${value2}!`
    expect(actual).toEqual('Hello JSDay 2018!')
  })

  test('admite expresiones', () => {
    const value1 = 1
    const value2 = 2
    const actual = taggedTemplate`${value1} + ${value2} = ${value1 + value2}`
    expect(actual).toEqual('1 + 2 = 3')
  })

  test('funciona con observables', async () => {
    expect.assertions(1)
    const observable = createObservable({ audience: 'great' })
    let string = observable.audience

    const observedTemplate = () => {
      string = taggedTemplate`This audience is ${observable.audience}`
    }
    observe(observedTemplate)
    observable.audience = 'awesome'

    await flushPromises()
    expect(string).toEqual('This audience is awesome')
  })
})
