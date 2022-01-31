import { BaseCommand } from '@adonisjs/core/build/standalone'
import { strHelper } from '@helpers/strHelper'
import WppPhone from 'App/Models/WppPhone'

export default class WppContacts extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'wpp:contacts'

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
    this.logger.info('Hello world!')
    const wppPhoneId = 2
    const wppPhone = await WppPhone.findOrFail(wppPhoneId)
    const contacts = await wppPhone.getWppContacts()

    for (const contact of contacts) {
      await wppPhone.addContact({
        phoneNumber: contact.number,
        hasWhatsapp: contact.isWAContact,
        name: strHelper.normalize(contact.name || contact.pushname),
        personInfoId: null as any,
        data: contact,
      })
    }
  }
}
