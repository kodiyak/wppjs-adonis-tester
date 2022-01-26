export const consolePrefix = (...prefixes: string[]) => {
  return (...params: any[]) => {
    console.log(...prefixes, ...params)
  }
}
