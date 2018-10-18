import { pipe } from '../pipe'
import { createSafe, notDefined } from '../../proxies/safeAccess'
import { createLogger } from '../../proxies/logger'
import { createObservable, observe } from '../../observable/observable'
import { flushPromises } from '../../../tests/utils/flushPromises'
import { mockDate } from '../../../tests/utils/mockDate'

describe('pipe', () => {
  test('debería ejecutar las funciones en orden y con el valor anterior', () => {
    const functions = [() => 1, value => value + 2]

    const composedFunctions = pipe(...functions)
    const result = composedFunctions()
    expect(result).toBe(3)
  })

  test('invoca primero a la primera función', () => {
    const fnMock = jest.fn()

    const functions = [() => fnMock('first'), () => fnMock('second')]

    const composedFunctions = pipe(...functions)
    composedFunctions()
    expect(fnMock).toHaveBeenNthCalledWith(1, 'first')
  })

  test('debe aplicar las funciones', () => {
    const upperCase = string => string.toUpperCase()
    const dash = string =>
      string
        .split(' ')
        .map(word => word.split('').join('-'))
        .join(' ')
    const exclamation = string => `${string}!`
    const string = 'fus roh dah'

    const uppercasedDashedExclamation = pipe(
      upperCase,
      dash,
      exclamation
    )
    const result = uppercasedDashedExclamation(string)
    expect(result).toBe('F-U-S R-O-H D-A-H!')
  })

  test('funciona con proxies 🤪', () => {
    mockDate('2018-10-10T12:34:56z')
    const person = {
      name: 'César'
    }

    const logger = {
      log: jest.fn()
    }
    const safeObservableLogger = pipe(
      value => createLogger(value, logger),
      createObservable,
      createSafe
    )

    const safeObservableLoggerObject = safeObservableLogger(person)
    safeObservableLoggerObject.name

    expect(logger.log).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [object] (Prop: name) {Result: César}')
  })

  test('aplica el safe correctamente correctamente', () => {
    const person = {
      name: 'César',
      company: {
        name: 'Autentia'
      }
    }

    const safeObservableLogger = pipe(
      createObservable,
      createSafe
    )
    const safeObservableLoggerObject = safeObservableLogger(person)

    expect(safeObservableLoggerObject.vehicles.tesla).toBe(notDefined)
  })

  test('es un proxy observable', async () => {
    expect.assertions(2)
    const person = {
      name: 'César',
      twitterFollowers: 100
    }

    const stub = jest.fn(() => person.twitterFollowers)
    observe(stub)

    const safeObservableLogger = pipe(
      createSafe,
      createObservable
    )
    const safeObservableLoggerObject = safeObservableLogger(person)
    safeObservableLoggerObject.twitterFollowers *= 10
    await flushPromises()

    expect(stub).toHaveBeenCalled()
    expect(safeObservableLoggerObject.twitterFollowers).toBe(1000)
  })
})
