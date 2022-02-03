import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeWorkflow extends WorkflowRunetimeChild<'workflow'> {
  public async send(contactId: string) {
    for (const child of this.children) {
      await child.send(contactId)
    }
  }
}
