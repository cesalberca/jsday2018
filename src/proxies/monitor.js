import '@babel/polyfill'

import { createLogger } from './logger'
import { asyncCapitalize } from '../defaultParameters/propValidator'
;(() => {
  const asyncFunctionLogger = createLogger(asyncCapitalize)

  asyncFunctionLogger('test')
})()
