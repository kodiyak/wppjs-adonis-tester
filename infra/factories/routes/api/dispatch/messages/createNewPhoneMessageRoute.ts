import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import Dispatch from 'App/Models/Dispatch'
import WppPhone from 'App/Models/WppPhone'

export async function createNewPhoneMessageRoute(ctx: HttpContextContract) {
  const { request, params } = ctx
  const { organization } = request
  const data = request.all()
  const { phoneId } = params
  const phone = await WppPhone.findOrFail(phoneId)
  const contacts = await Contact.query().whereIn('id', data.contacts)

  const dispatch = await Dispatch.create({
    title: data.title,
    organizationId: organization?.id,
    wppPhoneId: Number(phoneId),
    data,
    type: 'message',
  })

  await dispatch.dispatch()

  return createAdonisHttpResponse(ctx, {
    statusCode: 200,
    status: 'success',
    data: {
      dispatch,
      organization,
      phone,
      contacts,
    },
  })
}
