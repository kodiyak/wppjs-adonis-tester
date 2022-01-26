import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QueryBuilderController from 'App/Controllers/Helpers/QueryString/QueryBuilderController'
import Organization from 'App/Models/Organization'

export async function createOrganizationQsRoute(ctx: HttpContextContract) {
  createAdonisHttpResponse(ctx, {
    status: 'success',
    statusCode: 200,
    message: '',
    data: await QueryBuilderController.run(ctx.request, Organization.query()),
  })
}
