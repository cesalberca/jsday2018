export function defaultParameters(a = 1, b = 2) {
  return a + b
}

export function defaultParametersWithExpression(a = 1, b = defaultParameters(1, 2)) {
  return a + b
}
