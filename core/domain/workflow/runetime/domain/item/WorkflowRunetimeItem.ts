import { createEventEmitter } from '@infra/factories/createEventEmitter'
import { Workflow } from 'Contracts/workflow'
import { createWorkflowRunetimeItem } from '../../../factories/createWorkflowRunetimeItem'
import { WorkflowRunetime } from '../../WorkflowRunetime'

export abstract class WorkflowRunetimeItem<T extends Workflow.Types> {
  public response: WorkflowRunetimeItem.Response

  public events = createEventEmitter<WorkflowRunetimeItem.Events>()

  public children: WorkflowRunetimeItem<any>[] = []

  constructor(
    protected runetime: WorkflowRunetime,
    protected item: Workflow.Item<T>,
    protected parent?: WorkflowRunetimeItem<any>
  ) {
    if (item.children) {
      for (const child of item.children) {
        // @ts-ignore
        this.children.push(createWorkflowRunetimeItem(this.runetime, child, this))
      }
    }
  }

  public respond(response: WorkflowRunetimeItem.Response) {
    this.response = response
    this.events.emit('response', response)
  }

  public abstract send(contactId: string): Promise<void>
}

namespace WorkflowRunetimeItem {
  export interface Response {
    value: string
  }

  export interface Events {
    response: (v: Response) => void
  }
}
