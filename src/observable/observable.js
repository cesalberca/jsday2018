const observers = new WeakMap()
const queuedObservers = new Set()
let currentObserver

export function observe(fn) {
  queueObserver(fn)
}

export function createObservable(data) {
  observers.set(data, new Map())
  return new Proxy(data, {
    get,
    set
  })
}

function get(target, key, receiver) {
  const result = Reflect.get(...arguments)
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

function set(target, key) {
  const observersForKey = getObserversKey(target, key)
  if (observersForKey) {
    observersForKey.forEach(queueObserver)
  }
  return Reflect.set(...arguments)
}

function registerObserver(target, key, observer) {
  let observersForKey = getObserversKey(target, key)
  if (!observersForKey) {
    observersForKey = new Set()
    observers.get(target).set(key, observersForKey)
  }
  observersForKey.add(observer)
}

async function queueObserver(observer) {
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

function getObserversKey(target, key) {
  return observers.get(target).get(key);
}
