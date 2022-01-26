import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QueryBuilderController from 'App/Controllers/Helpers/QueryString/QueryBuilderController'
import WppPhone from 'App/Models/WppPhone'

export async function listWppPhonesRoute(ctx: HttpContextContract) {
  const { request } = ctx
  const query = WppPhone.query()
  if (!request.organization) {
    return createAdonisHttpResponse(ctx, {
      statusCode: 200,
      status: 'success',
      data: await QueryBuilderController.run(request, query),
    })
  }

  const organization = request.organization
  return createAdonisHttpResponse(ctx, {
    statusCode: 200,
    status: 'success',
    data: await QueryBuilderController.run(
      request,
      query.where('organization_id', organization.id)
    ),
  })
}
