import Env from '@ioc:Adonis/Core/Env'
import WppPhone from 'App/Models/WppPhone'
import { DateTime } from 'luxon'

const run = async () => {
  const canStart = Env.get('START_CLIENTS')
  // const isProd = true

  if (canStart) {
    const phones = await WppPhone.all()
    for (const phone of phones) {
      const lastSession = await phone.getLastSession()
      if (!!lastSession && !phone.phoneNumber.endsWith('4114')) {
        await phone.client()
        await phone.merge({ lastActionAt: DateTime.now(), isActive: true }).save()
        console.log(`[Wpp][START_CLIENT][Phone][${phone.phoneNumber}]`)
      } else {
        await phone.merge({ isActive: false }).save()
      }
    }
  }
}

run()
