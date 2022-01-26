import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export async function getAuthRoute(ctx: HttpContextContract) {
  const { auth } = ctx

  createAdonisHttpResponse(ctx, {
    status: 'success',
    statusCode: 200,
    message: '',
    data: { user: auth.user },
  })
}
