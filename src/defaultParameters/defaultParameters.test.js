import {
  defaultParameters,
  defaultParametersWithDestructuring,
  defaultParametersWithExpression
} from './defaultParameters'

describe('parámetros por defecto', () => {
  test('retorna la suma de dos valores cuando estos son pasados por parámetros', () => {
    expect(defaultParameters(1, 2)).toBe(3)
  })

  test('por defecto el segundo parámetro debe tener valor 2', () => {
    expect(defaultParameters(1)).toBe(3)
  })

  test('si el primer parámetro queremos que coja su valor por defecto podremos pasar undefined', () => {
    expect(defaultParameters(undefined, 3)).toBe(4)
  })

  test('si el primer parámetro queremos que coja su valor por defecto no podremos pasar null', () => {
    expect(defaultParameters(null, null)).toBe(0)
  })

  test('podemos hacer destructuración de objetos con valores por defecto si no pasamos ningún valor', () => {
    expect(defaultParametersWithDestructuring()).toBe(3)
  })

  test('podemos hacer destructuración de objetos con valores por defecto si pasamos un valor arbitrario', () => {
    expect(defaultParametersWithDestructuring({ a: 1 })).toBe(1)
    expect(defaultParametersWithDestructuring({ b: 1 })).toBe(1)
  })

  test('también se puede hacer uso de funciones', () => {
    expect(defaultParametersWithExpression()).toBe(4)
  })
})
