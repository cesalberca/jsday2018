export function isRequired() {
  throw new TypeError('Prop is required')
}

export function capitalize(string = isRequired()) {
  return string.toUpperCase().slice(0, 1) + string.slice(1)
}

export async function asyncCapitalize(string = isRequired()) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(capitalize(string))
    }, 1000)
  })
}
