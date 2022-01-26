import { createAdonisHttpResponse } from '@infra/factories/http/createAdonisHttpResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QR from 'qrcode-base64'

export async function generateQrCodeRoute(ctx: HttpContextContract) {
  try {
    const { request } = ctx
    if (!request.organization) return

    const organization = request.organization
    const wppPhoneAuth = await organization.phoneAuth()
    const qr = await wppPhoneAuth.getQrCode()
    const qrBase64 = QR.drawImg(qr, {
      size: 500,
    })

    return createAdonisHttpResponse(ctx, {
      statusCode: 200,
      status: 'success',
      data: {
        organization: wppPhoneAuth.organization,
        data: {
          qr: qrBase64,
        },
      },
    })
  } catch (error) {
    return {
      error: true,
    }
  }
}
