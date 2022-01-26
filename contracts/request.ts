import Organization from 'App/Models/Organization'

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    organization?: Organization
  }
}
