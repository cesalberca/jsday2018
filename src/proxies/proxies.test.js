import { createLoggerProxy, createSimpleProxy } from './proxies'
import { asyncCapitalize, capitalize } from "../defaultParameters/propValidator";

describe('proxies', () => {
  const RealDate = Date

  function mockDate(isoDate) {
    global.Date = class extends RealDate {
      constructor() {
        super()
        return new RealDate(isoDate)
      }
    }
  }

  afterEach(() => {
    global.Date = RealDate
  })

  test('createSimpleProxy debería hacer que el retorno de cualquier propiedad sea 1', () => {
    const expectedResult = 1
    const target = { a: 2 }

    const proxy = createSimpleProxy(target)

    expect(proxy.a).toBe(expectedResult)
  })

  test('createLoggerProxy debería hacer un log cuando se ejecuta una función', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      error: jest.fn()
    }

    const functionLogger = createLoggerProxy(capitalize, `Capitalize`, loggerStub, { level: 'error' })

    functionLogger('test')

    expect(loggerStub.error).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Function Capitalize] (Args: test) {Result: Test}')
  })

  test('createLoggerProxy debería hacer un log cuando se accede a una propiedad de un objeto', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      warn: jest.fn()
    }

    const objectLogger = createLoggerProxy({ a: 1 }, `Object`, loggerStub, { level: 'warn' })

    objectLogger.a

    expect(loggerStub.warn).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object Object] (Prop: a) {Result: 1}')
  })

  test('createLoggerProxy debería hacer un log cuando se accede a un elemento de un array', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn()
    }

    const arrayLogger = createLoggerProxy([1, 2], `Array`, loggerStub, { level: 'log' })

    arrayLogger[0]

    expect(loggerStub.log).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object Array] (Prop: 0) {Result: 1}')
  })

  test('createLoggerProxy debería hacer un log cuando se ejecuta una función asíncrona', async () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn(),
      time: jest.fn(),
      timeEnd: jest.fn()
    }

    const asyncFunctionLogger = createLoggerProxy(asyncCapitalize, `AsyncCapitalize`, loggerStub)

    await asyncFunctionLogger('test')

    expect(loggerStub.time).toHaveBeenCalledWith()
    expect(loggerStub.timeEnd).toHaveBeenCalledWith()
  })
})
