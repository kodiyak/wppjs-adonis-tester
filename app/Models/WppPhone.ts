import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
  ModelAttributes,
} from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import { v4 as uuidv4 } from 'uuid'
import Contact from './Contact'
import { WithOptional } from 'Contracts/types-helpers'
import PersonInfo from './PersonInfo'
import WppSession from './WppSession'
import WAWebJS from 'whatsapp-web.js'
import { readAsync, writeAsync } from 'fs-jetpack'
import { createTmpPath } from '@infra/factories/createTmpPath'
import { repositories } from '@infra/repositories'
import { WppClient } from '@core/domain/wpp/WppClient'

export default class WppPhone extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @column()
  public phoneNumber: string

  @column()
  public isActive: boolean

  @column()
  public organizationId: number

  @column.dateTime()
  public lastActionAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @hasMany(() => WppSession)
  public sessions: HasMany<typeof WppSession>

  @manyToMany(() => Contact, {
    pivotTable: 'contacts_wpp_phones',
  })
  public contacts: ManyToMany<typeof Contact>

  @beforeCreate()
  public static async createUuid(self: WppPhone) {
    if (!self.uuid) {
      self.uuid = uuidv4()
    }
  }

  public async addContact(
    contactProps: WithOptional<
      ModelAttributes<Contact>,
      'createdAt' | 'updatedAt' | 'name' | 'id' | 'hasWhatsapp' | 'personInfoId'
    >,
    personInfo?: PersonInfo
  ) {
    const self: WppPhone = this
    const contact = await Contact.updateOrCreate(
      { phoneNumber: contactProps.phoneNumber },
      contactProps
    )

    await self.related('contacts').detach([contact.id])
    await self.related('contacts').attach([contact.id])
    if (!personInfo) {
      await contact.load('personInfo')
      const personInfo = contact.personInfo || (await new PersonInfo().save())
      await contact.related('personInfo').associate(personInfo)
    }

    return contact
  }

  public async client() {
    const client = await repositories.memory.wppClients.findOrCreate(
      this,
      await this.getLastSession()
    )

    return client
  }

  public async setWppClientSession(client: WppClient) {
    const session = await this.getLastSession()
    if (session) {
      client.setSession(session)
    }
  }

  public async getLastSession() {
    const self: WppPhone = this
    const session = await self
      .related('sessions')
      .query()
      .orderBy('last_fetched_at', 'desc')
      .first()

    return session || undefined
  }

  public async setWppChats(chats: WAWebJS.Chat[]) {
    return writeAsync(this.getWppFilePath('chats.json'), JSON.stringify(chats))
  }

  public async setWppContacts(contacts: WAWebJS.Contact[]) {
    return writeAsync(this.getWppFilePath('contacts.json'), JSON.stringify(contacts))
  }

  public async getWppChats(): Promise<WAWebJS.Chat[]> {
    const data = await readAsync(this.getWppFilePath('chats.json'))
    if (!data) return []

    return JSON.parse(data)
  }

  public async getWppContacts(): Promise<WAWebJS.Contact[]> {
    const data = await readAsync(this.getWppFilePath('contacts.json'))
    if (!data) return []

    return JSON.parse(data)
  }

  private getWppFilePath(filename: string) {
    return createTmpPath('wpp-web-cache', `phone-${this.id}`, filename)
  }

  public async wppAuth(client: WAWebJS.Client, session: WAWebJS.ClientSession) {
    const self: WppPhone = this
    const chats = await client.getChats()
    const contacts = await client.getContacts()

    await this.setWppChats(chats)
    await this.setWppContacts(contacts)
    const wppSession = await self
      .related('sessions')
      .updateOrCreate(
        { reference: `${session.WABrowserId}-${session.WAToken1}-${session.WAToken2}` },
        { session, lastFetchedAt: DateTime.now() }
      )

    return { chats, contacts, session: wppSession }
  }
}
