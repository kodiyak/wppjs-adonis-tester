import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QueryBuilderController from 'App/Controllers/Helpers/QueryString/QueryBuilderController'
import WppPhone from 'App/Models/WppPhone'

export async function listContactsByWppPhoneRoute(ctx: HttpContextContract) {
  const { request, params } = ctx
  const { phoneId } = params
  const phone = await WppPhone.findOrFail(phoneId)
  const query = phone.related('contacts').query()

  return createAdonisHttpResponse(ctx, {
    statusCode: 200,
    status: 'success',
    data: await QueryBuilderController.run(request, query),
  })
}
