import { createLogger, createSimpleProxy } from '../logger'
import { asyncCapitalize, capitalize } from '../../defaultParameters/propValidator'
import { mockDate, RealDate } from '../../../tests/utils/mockDate'

describe('proxies', () => {
  afterEach(() => {
    global.Date = RealDate
  })

  test('createSimpleProxy debería hacer que el retorno de cualquier propiedad sea 1', () => {
    const expectedResult = 1
    const target = { a: 2 }

    const proxy = createSimpleProxy(target)

    expect(proxy.a).toBe(expectedResult)
  })

  test('createLogger debería hacer un log cuando se ejecuta una función', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      error: jest.fn()
    }

    const functionLogger = createLogger(capitalize, loggerStub, { level: 'error' })

    functionLogger('test')

    expect(loggerStub.error).toHaveBeenCalledWith(
      '2018-10-10T12:34:56.000Z [Function capitalize] (Args: test) {Result: Test}'
    )
  })

  test('createLogger debería hacer un log cuando se accede a una propiedad de un objeto', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      warn: jest.fn()
    }

    const objectLogger = createLogger({ a: 1 }, loggerStub, { level: 'warn' })

    objectLogger.a

    expect(loggerStub.warn).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object undefined] (Prop: a) {Result: 1}')
  })

  test('createLogger debería hacer un log cuando se accede a un elemento de un array', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn()
    }

    const arrayLogger = createLogger([1, 2], loggerStub, { level: 'log' })

    arrayLogger[0]

    expect(loggerStub.log).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object undefined] (Prop: 0) {Result: 1}')
  })

  test('createLogger debería hacer un log cuando se ejecuta una función asíncrona', async () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn(),
      time: jest.fn(),
      timeEnd: jest.fn()
    }

    const asyncFunctionLogger = createLogger(asyncCapitalize, loggerStub)

    await asyncFunctionLogger('test')

    expect(loggerStub.time).toHaveBeenCalledWith('Execution in')
    expect(loggerStub.timeEnd).toHaveBeenCalledWith('Execution in')
  })
})
