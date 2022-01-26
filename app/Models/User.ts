import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Organization from './Organization'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public nivel: 'admin' | 'user' | 'owner'

  @column()
  public avatar: string

  @column()
  public cover: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Organization, {
    foreignKey: 'ownerId',
  })
  public ownedOrganizations: HasMany<typeof Organization>

  @manyToMany(() => Organization, {
    pivotTable: 'users_organizations',
    onQuery: (query) => {
      query.pivotColumns(['nivel'])
    },
  })
  public organizations: ManyToMany<typeof Organization>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async createUuid(user: User) {
    if (!user.uuid) {
      user.uuid = uuidv4()
    }
  }

  public async isOrganization(organization: Organization) {
    const existsIn = (orgs: Organization[]) => {
      return !!orgs.find((o) => o.id === organization.id)
    }
    const exists = existsIn(this.organizations)
    if (!exists) {
      const user = await User.findOrFail(this.id)
      await user.load('organizations', (query) => {
        query.select('id')
      })

      return existsIn(user.organizations)
    }

    return exists
  }
}
