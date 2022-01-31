import { consoleClient } from '@helpers/consoleClient'
import WppPhone from 'App/Models/WppPhone'
import WppSession from 'App/Models/WppSession'
import WAWebJS, { Client } from 'whatsapp-web.js'
import Env from '@ioc:Adonis/Core/Env'

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

  constructor(public wppPhone: WppPhone, public wppSession?: WppSession) {
    this.createClient()
  }

  public setSession(session: WppSession) {
    this.wppSession = session
    this.createClient()
  }

  public async onReady(cb: () => void | Promise<void>) {
    if (this.status.isReady) {
      await cb()
    } else {
      return new Promise<void>((resolve) => {
        this.client.on('ready', async () => {
          await cb()
          resolve()
        })
      })
    }
  }

  private createClient() {
    if (!this.wppSession) return
    console.log(`[Wpp][CREATE_CLIENT][Phone][${this.wppPhone.phoneNumber}]`)
    if (this.client) {
      this.client.destroy()
    }

    this.client = new Client({
      session: this.wppSession?.session,
      puppeteer: { headless: Env.get('BROWSER_HEADLESS') },
    })

    this.client.on('authenticated', async (session) => {
      this.session = session
      this.status.isAuth = true
      console.log(`[Wpp][AUTHENTICATED][Phone][${this.wppPhone.phoneNumber}]`)
    })

    this.client.on('ready', async () => {
      this.status.isReady = true
      if (this.session) {
        const { session: wppSession } = await this.wppPhone.wppAuth(this.client, this.session)
        this.wppSession = wppSession
        console.log(`[Wpp][READY][Phone][${this.wppPhone.phoneNumber}]`)
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
