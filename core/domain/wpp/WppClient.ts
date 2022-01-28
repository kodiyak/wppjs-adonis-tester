import { consoleClient } from '@helpers/consoleClient'
import WppPhone from 'App/Models/WppPhone'
import WppSession from 'App/Models/WppSession'
import WAWebJS, { Client } from 'whatsapp-web.js'

export class WppClient {
  public client: WAWebJS.Client

  public session?: WAWebJS.ClientSession

  public status = {
    isReady: false,
    isAuth: false,
    isReadyQr: false,
    isNeedAuth: false,
  }

  public qrCode: string

  constructor(protected wppPhone: WppPhone, public wppSession?: WppSession) {
    this.createClient()
  }

  public setSession(session: WppSession) {
    this.wppSession = session
    this.createClient()
  }

  private createClient() {
    if (!this.wppSession) return
    console.log(
      `[Wpp][CREATE_CLIENT][Phone][${this.wppPhone.phoneNumber}][${this.wppSession?.reference}]`
    )
    if (this.client) {
      this.client.destroy()
    }

    this.client = new Client({
      session: this.wppSession?.session,
      puppeteer: { headless: false },
    })

    this.client.on('authenticated', async (session) => {
      this.session = session
      this.status.isAuth = true
    })

    this.client.on('ready', async () => {
      if (this.session) {
        const { session: wppSession } = await this.wppPhone.wppAuth(this.client, this.session)
        this.wppSession = wppSession
        console.log(`[Wpp][READY][Phone][${this.wppPhone.phoneNumber}][${this.wppSession.id}]`)
      }
    })

    this.client.on('qr', async (qr) => {
      if (!this.status.isNeedAuth) {
        console.log(
          `[Wpp][CLOSE_BROWSER][Phone][${this.wppPhone.phoneNumber}][Needs Authentication]`
        )
        this.status.isReadyQr = true
        this.qrCode = qr

        await this.wppPhone.merge({ isActive: false }).save()
        this.status.isNeedAuth = true

        // setTimeout(() => {
        //   this.client.removeAllListeners()
        //   this.client.destroy()
        // }, 1000 * 20)
      }
    })

    this.client.on('disconnected', async () => {
      await this.wppPhone.merge({ isActive: false }).save()
      this.status.isNeedAuth = true
    })

    consoleClient(this.client)

    this.client.initialize()
  }
}
