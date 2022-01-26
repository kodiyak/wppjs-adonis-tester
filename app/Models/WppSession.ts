import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import { createWppClient } from '@infra/factories/createWppClient'
import { WppClientAuthService } from '@core/services/modules/wpp-client/authenticate'
import WAWebJS from 'whatsapp-web.js'

export default class WppSession extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({
    prepare: (v) => JSON.stringify(v),
    consume: (v) => JSON.parse(v),
  })
  public session: WAWebJS.ClientSession

  @column()
  public reference: string

  @column()
  public organizationId: number

  @column()
  public wppPhoneId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public lastFetchedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  private _client?: WAWebJS.Client

  public async auth() {
    const client = await this.getClient()
    await new WppClientAuthService(client, this).handle()
  }

  public async getClient() {
    if (this._client) return this._client

    const client = await createWppClient(this)
    this._client = client
    return client
  }
}
