const isObject = obj => obj && typeof obj === 'object'
const hasKey = (obj, key) => key in obj

export const Undefined = new Proxy(
  {},
  {
    get() {
      return Undefined
    }
  }
)

export const either = (value, fallback) => (value === Undefined ? fallback : value)

export function createSafe(obj) {
  return new Proxy(obj, {
    get(target, name) {
      if (hasKey(target, name)) {
        const targetElement = target[name]

        if (isObject(targetElement)) {
          return createSafe(targetElement)
        }

        return targetElement
      }

      return Undefined
    }
  })
}
