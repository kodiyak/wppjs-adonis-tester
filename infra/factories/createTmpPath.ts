import Application from '@ioc:Adonis/Core/Application'

export function createTmpPath(...paths: string[]) {
  return Application.tmpPath(...paths)
}
