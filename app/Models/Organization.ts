import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import WppSession from './WppSession'
import { repositories } from '@infra/repositories'
import User from './User'
import WppPhone from './WppPhone'

export default class Organization extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public name: string

  @column()
  public companyName: string

  @column()
  public fantasyName: string

  @column()
  public cnpj: string

  @column()
  public cover: string

  @column()
  public avatar: string

  @column()
  public ownerId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUuid(self: Organization) {
    if (!self.uuid) {
      self.uuid = uuidv4()
    }
  }

  @hasMany(() => WppSession)
  public sessions: HasMany<typeof WppSession>

  @hasMany(() => WppPhone)
  public phones: HasMany<typeof WppPhone>

  @manyToMany(() => User, {
    pivotTable: 'users_organizations',
  })
  public users: ManyToMany<typeof User>

  public async phoneAuth() {
    return repositories.memory.wppPhonesAuths.findOrCreate(this)
  }

  public async setAdmin(user: User) {
    const self: Organization = this
    await self.related('users').detach([user.id])

    await self.related('users').attach({
      [user.id]: { nivel: 'admin' },
    })
  }

  public async addUser() {}
}
