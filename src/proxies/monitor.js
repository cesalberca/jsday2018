import '@babel/polyfill'

import { createLoggerProxy } from './loggerProxies'
import { asyncCapitalize } from '../defaultParameters/propValidator'
;(() => {
  const asyncFunctionLogger = createLoggerProxy(asyncCapitalize)

  asyncFunctionLogger('test')
})()
