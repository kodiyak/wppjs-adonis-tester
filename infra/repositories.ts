import { WppClientsRepository } from './repositories/memory/WppClientsRepository'
import { WppPhoneAuthRepository } from './repositories/memory/WppPhoneAuthRepository'

export const repositories = {
  memory: {
    wppClients: new WppClientsRepository(),
    wppPhonesAuths: new WppPhoneAuthRepository(),
  },
}
