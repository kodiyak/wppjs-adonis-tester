import { Workflow } from 'Contracts/workflow'
import { WorkflowRunetimeChild } from './domain/item/WorkflowRunetimeChild'
import { WorkflowRunetimeContext } from './WorkflowRunetimeContext'

export class WorkflowRunetimeCurrent extends WorkflowRunetimeContext {
  private _executedItems: WorkflowRunetimeCurrent.Item[] = []

  public async next() {}
}

namespace WorkflowRunetimeCurrent {
  export interface Item<T extends Workflow.Types = Workflow.Types> {
    order: number
    item: WorkflowRunetimeChild<T>
  }
}
