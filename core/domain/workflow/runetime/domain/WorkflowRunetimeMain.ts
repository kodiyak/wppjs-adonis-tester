import { WorkflowRunetimeItem } from './item/WorkflowRunetimeItem'

export class WorkflowRunetimeMain extends WorkflowRunetimeItem<'workflow'> {
  public async send() {}

  public async run(contactId: string) {
    for (const child of this.children) {
      await child.send(contactId)
    }
  }
}
