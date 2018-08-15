import { capitalize } from './propValidator'

describe('propValidator', () => {
  test('debe lanzar un error cuando un parámetro es obligatorio', () => {
    expect(() => {
      capitalize()
    }).toThrowError()
  })

  test('no debería lanzar error cuando el parámetro es nulo', () => {
    expect(() => {
      capitalize(null)
    }).toThrowError()
  })
})
