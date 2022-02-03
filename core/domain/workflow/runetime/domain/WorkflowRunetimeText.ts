import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeText extends WorkflowRunetimeChild<'text'> {
  public async send(contactId: string) {
    const message = await this.runetime.client.client.sendMessage(contactId, this.item.value)
    if (!this.item.value || this.item.value === '') {
      console.log('EMPTY_MESSAGE', message)
    }
  }
}
