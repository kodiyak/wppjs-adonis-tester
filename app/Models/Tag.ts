import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Contact from './Contact'
import { v4 as uuidv4 } from 'uuid'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public type: 'category' | 'tag'

  @column()
  public name: string

  @column()
  public slug: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Contact, {
    pivotTable: 'tags_contacts',
  })
  public contacts: ManyToMany<typeof Contact>

  @beforeCreate()
  public static async createUuid(self: Tag) {
    if (!self.uuid) {
      self.uuid = uuidv4()
    }
  }
}
