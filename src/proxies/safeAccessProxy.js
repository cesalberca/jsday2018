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

export function createSafeProxy(obj) {
  return new Proxy(obj, {
    get(target, name) {
      if (hasKey(target, name)) {
        if (isObject(target[name])) {
          return createSafeProxy(target[name])
        }

        return target[name]
      }

      return Undefined
    }
  })
}
