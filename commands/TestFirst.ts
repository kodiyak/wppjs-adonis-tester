import { BaseCommand } from '@adonisjs/core/build/standalone'
import { WppPhoneAuth } from '@core/domain/wpp/WppPhoneAuth'
import Dispatch from 'App/Models/Dispatch'
import Organization from 'App/Models/Organization'
import { createWriteStream } from 'fs-jetpack'
import qrcode from 'qrcode-terminal'

export default class TestFirst extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'test:first'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const dispatcher = await Dispatch.firstOrFail()
    await dispatcher.dispatch()

    // const organization = await Organization.firstOrFail()
    // const auth = new WppPhoneAuth(organization)

    // const client = await organization.client()

    // client.client.on('qr', (qr) => {
    //   console.log('QR_CODE')
    //   qrcode.generate(qr, { small: true })
    // })

    // const session = await organization.createSession()
    // this.logger.info('Hello world!')
  }
}
