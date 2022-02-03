import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeText extends WorkflowRunetimeChild<'text'> {
  public async send(data: WorkflowRunetimeChild.SendParams) {
    const { contact } = data
    const message = await this.runetime.client.client.sendMessage(
      contact.data.id._serialized,
      this.item.value
    )
    if (!this.item.value || this.item.value === '') {
      console.log('EMPTY_MESSAGE', message)
    }
  }
}
