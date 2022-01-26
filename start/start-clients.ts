import WppPhone from 'App/Models/WppPhone'
import { DateTime } from 'luxon'

const run = async () => {
  // const isProd = Env.get('NODE_ENV') === 'production'
  const isProd = true

  if (isProd) {
    const phones = await WppPhone.all()
    for (const phone of phones) {
      const lastSession = await phone.getLastSession()
      if (!!lastSession) {
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
