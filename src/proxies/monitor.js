import '@babel/polyfill'

import { createLogger } from './logger'
import { asyncCapitalize } from '../defaultParameters/propValidator'
;(async () => {
  const asyncFunctionLogger = createLogger(asyncCapitalize)
  const promises = [
    () => asyncFunctionLogger('t'),
    () => asyncFunctionLogger('te'),
    () => asyncFunctionLogger('tes'),
    () => asyncFunctionLogger('test')
  ]

  for (const promise of promises) {
    const result = await promise()
    console.warn(result)
  }
})()
