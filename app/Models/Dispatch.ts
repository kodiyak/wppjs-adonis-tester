import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import WppPhone from './WppPhone'
import { v4 as uuidv4 } from 'uuid'
import { StartWorkflowService } from '@core/services/modules/workflows/start'
import Workflow from './Workflow'
import Contact from './Contact'

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

  public async dispatch() {
    const self: Dispatch = this
    await self.load((loader) => {
      loader.load('organization').load('phone')
    })
    const workflows = await this.getWorkflows()
    const contacts = await this.getContacts()

    for (const workflow of workflows) {
      const handler = new StartWorkflowService(workflow, this.phone, this.organization, contacts)
      await handler.handle()
    }
  }

  public async getWorkflows() {
    return Workflow.query().whereIn('uuid', this.data.workflows)
  }

  public async getContacts() {
    return Contact.query().whereIn('id', this.data.contacts)
  }
}
