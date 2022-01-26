import { createHttpResponse } from '@infra/factories/http/createHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Organization from 'App/Models/Organization'

export default class HeaderOrganization {
  public async handle(
    { request, auth, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const isForce = guards?.includes('force') || false

    const organizationReference = request.header('x-organization')
    if (!organizationReference) {
      if (isForce) {
        return response.badRequest(
          createHttpResponse({
            statusCode: 400,
            status: 'error',
            message: 'Organization Reference is Required',
          })
        )
      }
      return await next()
    }
    const organizationId = Number(organizationReference)
    const organization = await Organization.findOrFail(organizationId)

    if (auth.user) {
      if (await auth.user.isOrganization(organization)) {
        request.organization = organization
      } else {
        return response.badRequest(
          createHttpResponse({
            statusCode: 400,
            status: 'error',
            message: `User authenticated is not in organization referenced`,
          })
        )
      }
    } else {
      request.organization = organization
    }

    return await next()
  }
}
