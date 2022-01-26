import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createHttpResponse, HttpResponse } from './createHttpResponse'
export function createAdonisHttpResponse<T>(ctx: HttpContextContract, res: HttpResponse<T>) {
  const httpResponse = createHttpResponse(res)

  ctx.response.status(httpResponse.statusCode)
  ctx.response.json(httpResponse)
}
