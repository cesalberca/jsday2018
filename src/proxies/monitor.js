import '@babel/polyfill'

import { createLoggerProxy } from './proxies'
import { asyncCapitalize } from '../defaultParameters/propValidator'
;(() => {
  const asyncFunctionLogger = createLoggerProxy(asyncCapitalize, `AsyncCapitalize`)

  asyncFunctionLogger('test')
})()
