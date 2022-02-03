import { WppClient } from '@core/domain/wpp/WppClient'
import Contact from 'App/Models/Contact'
import Organization from 'App/Models/Organization'
import { default as WorkflowModel } from 'App/Models/Workflow'
import WppPhone from 'App/Models/WppPhone'
import { WorkflowRunetimeMain } from './domain/WorkflowRunetimeMain'
import { WorkflowRunetimeCurrent } from './WorkflowRunetimeCurrent'
import Env from '@ioc:Adonis/Core/Env'

export class WorkflowRunetime {
  public status = {
    isRunning: false,
    isStarted: false,
    isFinished: false,
    isError: false,
  }

  public client: WppClient

  public current: WorkflowRunetimeCurrent

  public tree: WorkflowRunetimeMain

  constructor(public props: WorkflowRunetime.InstanceParams) {
    this.current = new WorkflowRunetimeCurrent(this)
  }

  public async start() {
    this.status.isStarted = true
    if (Env.get('START_CLIENTS')) {
      this.client = await this.props.phone.client()
      if (this.client.status.isAuth) {
        this.tree = new WorkflowRunetimeMain(this, this.props.workflow.data.tree)
        this.run()
      }
    } else {
      this.tree = new WorkflowRunetimeMain(this, this.props.workflow.data.tree)
      this.run()
    }
  }

  public async run() {
    for (const contact of this.props.contacts) {
      await this.tree.run(contact)
    }
    // const message = this.current.getMessage()
  }

  public next() {}
}

export namespace WorkflowRunetime {
  export interface InstanceParams {
    workflow: WorkflowModel
    phone: WppPhone
    organization: Organization
    contacts: Contact[]
  }
}
