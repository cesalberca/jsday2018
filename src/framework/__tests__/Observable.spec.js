import { observe, observable } from '../Observable'
import { flushPromises } from '../../../tests/utils/flushPromises'

describe('Observable', () => {
  test('se ejecuta la función descrita de nuevo cuando el valor observado cambia', async () => {
    expect.assertions(2)
    const person = observable({ name: 'John' })

    const stub = jest.fn(() => person.name)

    observe(stub)

    person.name = 'Dave'

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(stub).toHaveReturnedWith('Dave')
  })

  test('se pueden observar con varias funciones', async () => {
    expect.assertions(4)
    const person = observable({ name: 'Marta' })

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
    expect.assertions(2)
    const person = observable({ jobs: ['developer', 'designer'] })
    const stub = jest.fn(() => person.jobs)

    observe(stub)

    person.jobs.push('ninja')

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(person.jobs).toEqual(['developer', 'designer', 'ninja'])
  })

  test('funciona asíncronamente', async () => {
    expect.assertions(2)
    jest.useFakeTimers();

    const person = observable({ name: 'Sara' })
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

    const person = observable({ name: 'Sara' })
    const stub = jest.fn(() => person.gender)

    observe(stub)
    person.gender = 'non binary'

    await flushPromises()
    expect(stub).toHaveBeenCalled()
    expect(person.gender).toBe('non binary')
  })
})
