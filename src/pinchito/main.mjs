export class Renderer {
  constructor(container) {
    this.diffDom = new diffDOM()
    this.container = container
  }

  render(string) {
    const newElement = document.createElement('body')
    newElement.innerHTML = string

    this.diffDom.apply(this.container, this.diffDom.diff(this.container, newElement))
  }
}

export const html = (strings, ...values) =>
  strings.reduce((template, string, i) => template + string + (values[i] || ''), '')
