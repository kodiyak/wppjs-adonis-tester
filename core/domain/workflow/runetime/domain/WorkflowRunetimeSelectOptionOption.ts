import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeSelectOptionOption extends WorkflowRunetimeChild<'select_option.option'> {
  public async send(data: WorkflowRunetimeChild.SendParams) {
    if (this.children.length > 0 && this.children?.[0] !== undefined) {
      const [child] = this.children
      const item = child.getItem()

      if (item.type === 'workflow') {
        await child.send(data)
      }
    }
  }

  public getBody() {
    return this.item.title
  }

  public getId() {
    return this.item.uuid
  }
}
