import { createSafe, either } from '../proxies/safeAccess.js'

export const taggedTemplate = (strings, ...values) =>
  strings.reduce((template, string, i) => template + string + either(createSafe(values)[i], ''), '')
