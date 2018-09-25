export class Renderer {
  constructor(container) {
    this.container = container
  }

  render(string) {
    this.container.firstChild.replaceWith(document.createRange().createContextualFragment(string))
  }
}

export const html = (string, ...values) =>
  string.reduce((template, string, i) => template + string + (values[i] || ''), '')
