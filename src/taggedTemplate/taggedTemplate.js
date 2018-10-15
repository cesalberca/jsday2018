export const taggedTemplate = (strings, ...values) =>
  strings.reduce((template, string, i) => template + string + (values[i] || ''), '')
