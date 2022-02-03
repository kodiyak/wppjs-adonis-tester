import { createEventEmitter } from '@infra/factories/createEventEmitter'
import { Workflow } from 'Contracts/workflow'
import { createWorkflowRunetimeItem } from '../../../factories/createWorkflowRunetimeItem'

export abstract class WorkflowRunetimeChild<T extends Workflow.Types> {
  public response: WorkflowRunetimeItem.Response

  public events = createEventEmitter<WorkflowRunetimeItem.Events>()

  public children: WorkflowRunetimeChild<any>[] = []

  constructor(protected item: Workflow.Item<T>, protected parent?: WorkflowRunetimeChild<any>) {
    if (item.children) {
      for (const child of item.children) {
        this.children.push(createWorkflowRunetimeItem(child, this))
      }
    }
  }

  public respond(response: WorkflowRunetimeItem.Response) {
    this.response = response
    this.events.emit('response', response)
  }

  public abstract send(): Promise<void>
}

namespace WorkflowRunetimeItem {
  export interface Response {
    value: string
  }

  export interface Events {
    response: (v: Response) => void
  }
}
