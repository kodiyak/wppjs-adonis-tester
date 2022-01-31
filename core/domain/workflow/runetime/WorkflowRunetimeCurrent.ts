import { Workflow } from 'Contracts/workflow'
import { WorkflowRunetimeContext } from './WorkflowRunetimeContext'

export class WorkflowRunetimeCurrent extends WorkflowRunetimeContext {
  private _executedItems: Workflow.Item[] = []

  public getMessage() {}
}
