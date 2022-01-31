import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import PersonInfo from './PersonInfo'
import Tag from './Tag'
import WppPhone from './WppPhone'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public phoneNumber: string

  @column()
  public hasWhatsapp: boolean

  @column()
  public name: string

  @column({
    consume: (v) => JSON.parse(v),
    prepare: (v) => JSON.stringify(v),
  })
  public data: any

  @column()
  public personInfoId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => PersonInfo)
  public personInfo: BelongsTo<typeof PersonInfo>

  @manyToMany(() => Tag, {
    pivotTable: 'tags_contacts',
  })
  public tags: ManyToMany<typeof Tag>

  @manyToMany(() => WppPhone, {
    pivotTable: 'contacts_wpp_phones',
  })
  public phones: ManyToMany<typeof WppPhone>
}
