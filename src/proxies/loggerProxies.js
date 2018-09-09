import { capitalize } from '../defaultParameters/propValidator'

export function createSimpleProxy(target) {
  const handler = {
    get() {
      return 1
    }
  }

  return new Proxy(target, handler)
}

export function createLoggerProxy(target, logger = console, { level } = { level: 'log' }) {
  const message = `${new Date().toISOString()} [${capitalize(typeof target)} ${target.name}]`

  const handler = {
    get(target, prop) {
      logger[level](`${message} (Prop: ${prop}) {Result: ${target[prop]}}`)
      return Reflect.get(...arguments)
    },
    apply(target, thisArgument, listOfArguments) {
      const result = target(...listOfArguments)
      handleResult(result, logger)
      logger[level](`${message} (Args: ${listOfArguments}) {Result: ${result}}`)
      return result
    }
  }

  return new Proxy(target, handler)
}

async function handleResult(result, logger = console) {
  const isResultAPromise = Promise.resolve(result) == result
  if (isResultAPromise) {
    const label = 'Execution in'
    logger.time(label)
    await result
    logger.timeEnd(label)
  }
}
