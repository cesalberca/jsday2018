import { observe, createObservable } from '../observable'
import { flushPromises } from '../../../tests/utils/flushPromises'

describe(__filename, () => {
  test('se ejecuta la función descrita de nuevo cuando el valor observado cambia', async () => {
    expect.assertions(2)
    const person = createObservable({ name: 'John' })

    const stub = jest.fn(() => person.name)

    observe(stub)

    person.name = 'Dave'

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(stub).toHaveReturnedWith('Dave')
  })

  test('cambia el valor interno cuando se muta el objeto', async () => {
    expect.assertions(1)
    const person = createObservable({ name: 'Summer' })

    const stub = jest.fn(() => person.name)

    observe(stub)

    person.name = 'Autumn'

    await flushPromises()
    expect(person.name).toBe('Autumn')
  })

  test('se pueden observar con varias funciones', async () => {
    expect.assertions(4)
    const person = createObservable({ name: 'Marta' })

    const stub = jest.fn(() => person.name)
    const stub2 = jest.fn(() => person.name)

    observe(stub)
    observe(stub2)

    person.name = 'Laura'

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(stub2).toHaveBeenCalled()
    expect(stub).toHaveReturnedWith('Laura')
    expect(stub2).toHaveReturnedWith('Laura')
  })

  test('funciona con Arrays', async () => {
    expect.assertions(1)
    const person = createObservable({ jobs: ['developer', 'designer'] })
    const stub = jest.fn(() => person.jobs)

    observe(stub)

    person.jobs.push('ninja')

    await flushPromises()
    expect(stub).toHaveBeenCalled()
  })

  test('funciona con objetos anidados', async () => {
    expect.assertions(1)
    const person = createObservable({ name: 'César', company: { name: 'Autentia', people: 70 } })
    const stub = jest.fn(() => person.company.people)

    observe(stub)

    person.company.people++

    await flushPromises()
    expect(stub).toHaveBeenCalled()
  })

  test('funciona asíncronamente', async () => {
    expect.assertions(2)
    jest.useFakeTimers();

    const person = createObservable({ name: 'Sara' })
    const stub = jest.fn(() => person.name)

    observe(stub)

    setTimeout(() => person.name = 'James', 1000)

    jest.runAllTimers();
    await flushPromises()

    expect(stub).toHaveBeenCalled()
    expect(person.name).toBe('James')
  })

  test('se pueden añadir propiedades dinámicamente', async () => {
    expect.assertions(2)

    const person = createObservable({ name: 'Sara' })
    const stub = jest.fn(() => person.gender)

    observe(stub)
    person.gender = 'non binary'

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(person.gender).toBe('non binary')
  })
})
