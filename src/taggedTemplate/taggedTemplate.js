import { createSafe, either } from '../proxies/safeAccess'

export const taggedTemplate = (strings, ...values) =>
  strings.reduce((template, string, i) => template + string + either(createSafe(values)[i], ''), '')
