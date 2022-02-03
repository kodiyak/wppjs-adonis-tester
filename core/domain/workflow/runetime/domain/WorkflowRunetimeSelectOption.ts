import Contact from 'App/Models/Contact'
import { Workflow } from 'Contracts/workflow'
import WAWebJS, { Buttons } from 'whatsapp-web.js'
import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'
import { WorkflowRunetimeSelectOptionOption } from './WorkflowRunetimeSelectOptionOption'

export class WorkflowRunetimeSelectOption extends WorkflowRunetimeChild<
  'select_option',
  {
    text: string
    optionId: string
  },
  Workflow.Types,
  'select_option.option'
> {
  public async send(data: WorkflowRunetimeChild.SendParams) {
    const { contact } = data
    const isChild = (v: string) => this.children.map((c) => c.uuid).includes(v)
    const messageButton = await this.runetime.client.client.sendMessage(
      contact.data.id._serialized,
      new Buttons(`Selecione uma das opções abaixo`, this.children.map(this.createButton))
    )

    await new Promise<void>(async (resolve) => {
      console.log('MESSAGE_BUTTON', messageButton)
      const onMessage = async (message: WAWebJS.Message) => {
        if (message.selectedButtonId) {
          if (isChild(message.selectedButtonId)) {
            const child = this.children.find((c) => c.uuid === message.selectedButtonId)
            if (child) {
              await child.send(data)
            }
          }
        }

        this.runetime.client.client.off('message', onMessage)

        resolve()
      }

      this.runetime.client.client.on('message', onMessage)
    })
  }

  private createButton(option: WorkflowRunetimeSelectOptionOption) {
    return { id: option.getId(), body: option.getBody() } as any
  }
}
