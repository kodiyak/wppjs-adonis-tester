import { WorkflowRunetime } from '@core/domain/workflow/runetime/WorkflowRunetime'
import Contact from 'App/Models/Contact'
import Organization from 'App/Models/Organization'
import { default as WorkflowModel } from 'App/Models/Workflow'
import WppPhone from 'App/Models/WppPhone'

export class StartWorkflowService {
  constructor(
    protected workflow: WorkflowModel,
    protected wppPhone: WppPhone,
    protected organization: Organization,
    protected contacts: Contact[]
  ) {}

  public async handle() {
    await new WorkflowRunetime({
      workflow: this.workflow,
      contacts: this.contacts,
      organization: this.organization,
      phone: this.wppPhone,
    }).start()

    return {
      workflow: this.workflow,
      status: {
        success: true,
      },
    }
  }
}
