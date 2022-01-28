import Organization from 'App/Models/Organization'
import WAWebJS, { Client } from 'whatsapp-web.js'
import qrcodeTerminal from 'qrcode-terminal'
import WppPhone from 'App/Models/WppPhone'
import { DateTime } from 'luxon'
import { consoleClient } from '@helpers/consoleClient'
import Env from '@ioc:Adonis/Core/Env'

export class WppPhoneAuth {
  public client: WAWebJS.Client

  public qrCode: string

  public session: WAWebJS.ClientSession

  constructor(public organization: Organization) {
    this.createClient()
  }

  private createClient() {
    const client = new Client({
      puppeteer: {
        headless: Env.get('BROWSER_HEADLESS'),
      },
    })
    this.client = client

    this.client.on('authenticated', async (session) => {
      this.session = session

      // console.log('reset')

      // this.reset()
    })

    this.client.on('ready', async () => {
      const contacts = await client.getContacts()
      const me = contacts.find((c) => c.isMe)
      if (!me) {
        console.log(`Cannot create Wpp Phone [${this.organization.id}]`)

        return
      }

      const wppPhone = await WppPhone.updateOrCreate(
        { phoneNumber: me.number },
        {
          name: 'Zap Phone',
          isActive: false,
          organizationId: this.organization.id,
          lastActionAt: DateTime.now(),
        }
      )

      await wppPhone.wppAuth(this.client, this.session)

      this.reset()
    })

    consoleClient(this.client)
    // this.client.on('qr', consolePrefix('qr'))

    this.client.on('qr', (qr) => {
      // qrcodeTerminal.generate(qr, { small: true })
      this.qrCode = qr
    })

    this.client.initialize()
  }

  public async getSession() {
    if (this.session) {
      return this.session
    }

    return new Promise<WAWebJS.ClientSession>((resolve) => {
      this.client.on('authenticated', resolve)
    })
  }

  public async getQrCode() {
    if (this.qrCode) {
      return this.qrCode
    }

    return new Promise<string>((resolve) => {
      this.client.on('qr', resolve)
    })
  }

  public reset() {
    this.qrCode = undefined!
    this.session = undefined!
    this.client.destroy()
    this.createClient()
    return this
  }
}
