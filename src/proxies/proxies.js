import { capitalize } from '../defaultParameters/propValidator'

export function createSimpleProxy(target) {
  const handler = {
    get() {
      return 1
    }
  }

  return new Proxy(target, handler)
}

export function createLoggerProxy(target, log, logger = console, { level } = { level: 'log' }) {
  const message = `${new Date().toISOString()} [${capitalize(typeof target)} ${log}]`

  const handler = {
    get(target, prop) {
      const result = target[prop]
      logger[level](`${message} (Prop: ${prop}) {Result: ${result}}`)
      return result
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
    logger.time()
    await result
    logger.timeEnd()
  }
}
