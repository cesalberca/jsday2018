export function multiply(a = 1, b = 1) {
  return a * b
}

export function sumAfterTaxes(price, taxPercentage = multiply(21, 0.1)) {
  return price + taxPercentage
}
