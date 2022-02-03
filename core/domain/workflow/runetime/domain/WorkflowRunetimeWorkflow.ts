import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeWorkflow extends WorkflowRunetimeChild<'workflow'> {
  public async send(data: WorkflowRunetimeChild.SendParams) {
    for (const child of this.children) {
      await child.send(data)
    }
  }
}
