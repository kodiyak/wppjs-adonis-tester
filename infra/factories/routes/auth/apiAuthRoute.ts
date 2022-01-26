import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export async function apiAuthRoute(ctx: HttpContextContract) {
  const { auth, request } = ctx
  const { email, password } = request.all()
  const token = await auth.use('api').attempt(email, password)

  await auth.user?.load('organizations')

  createAdonisHttpResponse(ctx, {
    status: 'success',
    statusCode: 200,
    message: 'Authenticated successfully!',
    data: { token, user: auth.user },
  })
}
