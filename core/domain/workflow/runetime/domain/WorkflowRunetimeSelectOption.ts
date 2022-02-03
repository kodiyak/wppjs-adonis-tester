import { Buttons } from 'whatsapp-web.js'
import { WorkflowRunetimeChild } from './item/WorkflowRunetimeChild'

export class WorkflowRunetimeSelectOption extends WorkflowRunetimeChild<'select_option'> {
  public async send(contactId: string) {
    const messageButton = await this.runetime.client.client.sendMessage(
      contactId,
      new Buttons(
        'Body text/ MessageMedia instance',
        [
          { id: 'customId', body: 'button1' },
          { body: 'button2' },
          { body: 'button3' },
          { body: 'button4' },
        ],
        "Title here, doesn't work with media",
        'Footer here'
      ),
      { caption: 'if you used a MessageMedia instance, use the caption here' }
    )

    console.log('MESSAGE_BUTTON', messageButton)
  }
}
