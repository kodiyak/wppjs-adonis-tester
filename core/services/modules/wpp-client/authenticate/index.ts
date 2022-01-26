import WppSession from 'App/Models/WppSession'
import WAWebJS from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

export class WppClientAuthService {
  constructor(protected client: WAWebJS.Client, protected session?: WppSession) {}

  public async handle() {
    console.log('start auth')
    this.client.on('qr', (qr) => {
      console.log('REQUIRED_AUTH', qr)
      qrcode.generate(qr, { small: true })
    })
    return new Promise<void>((resolve, reject) => {
      this.client.on('authenticated', async (session) => {
        if (this.session) {
          this.session.session = session
          await this.session.save()
        }

        resolve()
      })

      this.client.on('auth_failure', (message) => {
        reject(message)
      })
    })
  }
}
