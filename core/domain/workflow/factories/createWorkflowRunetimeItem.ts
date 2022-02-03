import { Workflow } from 'Contracts/workflow'
import { WorkflowRunetimeSelectOption } from '../runetime/domain/WorkflowRunetimeSelectOption'
import { WorkflowRunetimeSelectOptionOption } from '../runetime/domain/WorkflowRunetimeSelectOptionOption'
import { WorkflowRunetimeText } from '../runetime/domain/WorkflowRunetimeText'
import { WorkflowRunetimeWorkflow } from '../runetime/domain/WorkflowRunetimeWorkflow'
import { WorkflowRunetime } from '../runetime/WorkflowRunetime'

export function createWorkflowRunetimeItem<T extends Workflow.Types>(
  runetime: WorkflowRunetime,
  item: Workflow.Item<T>,
  parent?: any
) {
  if (item.type === 'workflow') return new WorkflowRunetimeWorkflow(runetime, item, parent)
  if (item.type === 'select_option') return new WorkflowRunetimeSelectOption(runetime, item, parent)
  if (item.type === 'select_option.option')
    return new WorkflowRunetimeSelectOptionOption(runetime, item, parent)
  if (item.type === 'text') return new WorkflowRunetimeText(runetime, item, parent)

  throw new Error(`Workflow Item Cannot be initalized ${JSON.stringify(item)}`)
}
