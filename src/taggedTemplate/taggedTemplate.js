import { createSafe, either } from '../proxies/safeAccess'

export const taggedTemplate = (string, ...values) =>
  string.reduce((template, string, i) => template + string + either(createSafe(values)[i], ''), '')
