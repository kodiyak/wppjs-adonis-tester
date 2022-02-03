import { WppClient } from '@core/domain/wpp/WppClient'
import Contact from 'App/Models/Contact'
import Organization from 'App/Models/Organization'
import { default as WorkflowModel } from 'App/Models/Workflow'
import WppPhone from 'App/Models/WppPhone'
import { WorkflowRunetimeMain } from './domain/WorkflowRunetimeMain'
import { WorkflowRunetimeWorkflow } from './domain/WorkflowRunetimeWorkflow'
import { WorkflowRunetimeCurrent } from './WorkflowRunetimeCurrent'

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
    // this.client = await this.props.phone.client()
    this.status.isStarted = true
    // if (this.client.status.isAuth) {
    this.tree = new WorkflowRunetimeMain(this.props.workflow.data.tree)
    // console.log('WORKFLOW', this.props.workflow.data.tree.children)
    console.log('WORKFLOW_TREE', this.tree.children)
    // }
  }

  public async run() {
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
