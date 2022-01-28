import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Workflow from 'App/Models/Workflow'

export async function createWorkflowRoute(ctx: HttpContextContract) {
  const { request, params } = ctx
  const { data } = request.all()

  const workflow = await Workflow.updateOrCreate(
    { uuid: data.uuid },
    {
      title: data.title,
      description: data.description,
      wppPhoneId: params.phoneId,
      organizationId: request.organization?.id,
      data,
    }
  )

  return createAdonisHttpResponse(ctx, {
    statusCode: 200,
    status: 'success',
    data: { workflow },
  })
}
