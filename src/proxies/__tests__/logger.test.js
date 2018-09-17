import { createLogger } from '../logger'
import { asyncCapitalize, capitalize } from '../../defaultParameters/propValidator'
import { mockDate, RealDate } from '../../../tests/utils/mockDate'

describe('logger', () => {
  afterEach(() => {
    global.Date = RealDate
  })

  test('createLogger debería hacer un log cuando se ejecuta una función', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn()
    }

    const functionLogger = createLogger(capitalize, loggerStub)

    functionLogger('test')

    expect(loggerStub.log).toHaveBeenCalledWith(
      '2018-10-10T12:34:56.000Z [Function] capitalize (Args: test) {Result: Test}'
    )
  })

  test('createLogger debería hacer un log cuando se accede a una propiedad de un objeto', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn()
    }

    const objectLogger = createLogger({ a: 1 }, loggerStub)

    objectLogger.a

    expect(loggerStub.log).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object] (Prop: a) {Result: 1}')
  })

  test('createLogger debería hacer un log cuando se accede a un elemento de un array', () => {
    mockDate('2018-10-10T12:34:56z')
    const loggerStub = {
      log: jest.fn()
    }

    const arrayLogger = createLogger([1, 2], loggerStub)

    arrayLogger[0]

    expect(loggerStub.log).toHaveBeenCalledWith('2018-10-10T12:34:56.000Z [Object] (Prop: 0) {Result: 1}')
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

    expect(loggerStub.time).toHaveBeenCalledWith('Execution of asyncCapitalize in')
    expect(loggerStub.timeEnd).toHaveBeenCalledWith('Execution of asyncCapitalize in')
  })
})
