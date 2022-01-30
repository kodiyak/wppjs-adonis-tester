import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import WppPhone from './WppPhone'
import { v4 as uuidv4 } from 'uuid'

export default class Dispatch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public type: 'message'

  @column()
  public title: string

  @column({
    consume: (v) => JSON.parse(v),
    prepare: (v) => JSON.stringify(v),
  })
  public data: any

  @column()
  public organizationId: number

  @column()
  public wppPhoneId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @belongsTo(() => WppPhone)
  public phone: BelongsTo<typeof WppPhone>

  @beforeCreate()
  public static async createUuid(self: Dispatch) {
    if (!self.uuid) {
      self.uuid = uuidv4()
    }
  }
}
