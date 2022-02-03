import { createEventEmitter } from '@infra/factories/createEventEmitter'
import Contact from 'App/Models/Contact'
import { Workflow } from 'Contracts/workflow'
import { createWorkflowRunetimeItem } from '../../../factories/createWorkflowRunetimeItem'
import { WorkflowRunetime } from '../../WorkflowRunetime'

export abstract class WorkflowRunetimeChild<
  T extends Workflow.Types,
  R = string,
  P extends Workflow.Types = Workflow.Types,
  C extends Workflow.Types = Workflow.Types
> {
  public response: WorkflowRunetimeChild.Response<R>

  public events = createEventEmitter<WorkflowRunetimeChild.Events>()

  public children: WorkflowRunetimeChild<C>[] = []

  public uuid: string

  constructor(
    protected runetime: WorkflowRunetime,
    protected item: Workflow.Item<T>,
    protected parent?: WorkflowRunetimeChild<P>
  ) {
    this.uuid = item.uuid
    if (item.children) {
      for (const child of item.children) {
        // @ts-ignore
        this.children.push(createWorkflowRunetimeItem(this.runetime, child, this))
      }
    }
  }

  public respond(response: WorkflowRunetimeChild.Response<R>) {
    this.response = response
    this.events.emit('response', response)
  }

  public abstract send(props: WorkflowRunetimeChild.SendParams): Promise<void>

  public getItem() {
    return this.item
  }
}

export namespace WorkflowRunetimeChild {
  export interface Response<T> {
    value: T
  }

  export interface Events {
    response: (v: Response<any>) => void
  }

  export interface SendParams {
    contact: Contact
  }
}
