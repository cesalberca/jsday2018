const observers = new Map()
const queuedObservers = new Set()
let currentObserver

export function observe(fn) {
  queueObserver(fn)
}

export function createObservable(obj) {
  observers.set(obj, new Map())
  return new Proxy(obj, {
    get,
    set
  })
}

function queueObserver(observer) {
  if (queuedObservers.size === 0) {
    Promise.resolve().then(runObservers)
  }
  queuedObservers.add(observer)
}

function runObservers() {
  try {
    queuedObservers.forEach(runObserver)
  } finally {
    currentObserver = undefined
    queuedObservers.clear()
  }
}

function runObserver(observer) {
  currentObserver = observer
  observer()
}

function get(target, key, receiver) {
  const result = Reflect.get(target, key, receiver)
  if (currentObserver) {
    registerObserver(target, key, currentObserver)
    if (typeof result === 'object') {
      const observableResult = createObservable(result)
      Reflect.set(target, key, observableResult, receiver)
      return observableResult
    }
  }
  return result
}

function registerObserver(target, key, observer) {
  let observersForKey = observers.get(target).get(key)
  if (!observersForKey) {
    observersForKey = new Set()
    observers.get(target).set(key, observersForKey)
  }
  observersForKey.add(observer)
}

function set(target, key, value, receiver) {
  const observersForKey = observers.get(target).get(key)
  if (observersForKey) {
    observersForKey.forEach(observer => queueObserver(observer))
  }
  return Reflect.set(target, key, value, receiver)
}
