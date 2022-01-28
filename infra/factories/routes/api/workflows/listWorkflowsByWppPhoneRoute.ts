import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QueryBuilderController from 'App/Controllers/Helpers/QueryString/QueryBuilderController'
import Workflow from 'App/Models/Workflow'

export async function listWorkflowsByWppPhoneRoute(ctx: HttpContextContract) {
  const { request, params } = ctx
  const { phoneId } = params
  const query = Workflow.query().where('wpp_phone_id', phoneId)

  return createAdonisHttpResponse(ctx, {
    statusCode: 200,
    status: 'success',
    data: await QueryBuilderController.run(request, query),
  })
}
