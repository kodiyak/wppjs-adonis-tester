class StrHelper {
  public slug(value?: string): string {
    if (!value) return ''
    return value
      .toString() // Cast to string
      .toLowerCase() // Convert the string to lowercase letters
      .normalize('NFD') // The normalize() method returns the Unicode Normalization Form of a given string.
      .trim() // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-')
  }

  public normalize(value?: string): string {
    if (!value) return ''
    return value.replace(/[^\w\s]/gi, '')
  }

  public removeFromSides(v: string, sideValue: string) {
    let newValue = v.trim()
    if (newValue.startsWith(sideValue)) {
      newValue = newValue.slice(sideValue.length)
    }

    if (newValue.endsWith(sideValue)) {
      newValue = newValue.slice(0, newValue.length - sideValue.length)
    }

    return newValue
  }

  public truncate(str?: string, length: number = 10) {
    if (!str || str === '') return str
    if (str.length <= length) {
      return str
    }
    return str.slice(0, length) + '...'
  }

  public title(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  public digits(str: string): string {
    return `${str}`?.match(/(\d+)/gm)?.join('') || ''
  }

  public camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, '')
  }
}

export const strHelper = new StrHelper()
