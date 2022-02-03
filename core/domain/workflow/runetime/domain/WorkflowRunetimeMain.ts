import Contact from 'App/Models/Contact'
import { WorkflowRunetimeItem } from './item/WorkflowRunetimeItem'

export class WorkflowRunetimeMain extends WorkflowRunetimeItem<'workflow'> {
  public async send() {}

  public async run(contact: Contact) {
    for (const child of this.children) {
      await child.send(contact)
    }
  }
}
