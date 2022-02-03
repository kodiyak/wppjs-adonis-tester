import { Workflow } from 'Contracts/workflow'
import { WorkflowRunetimeSelectOption } from '../runetime/domain/WorkflowRunetimeSelectOption'
import { WorkflowRunetimeSelectOptionOption } from '../runetime/domain/WorkflowRunetimeSelectOptionOption'
import { WorkflowRunetimeText } from '../runetime/domain/WorkflowRunetimeText'
import { WorkflowRunetimeWorkflow } from '../runetime/domain/WorkflowRunetimeWorkflow'

export function createWorkflowRunetimeItem<T extends Workflow.Types>(
  item: Workflow.Item<T>,
  parent?: any
) {
  if (item.type === 'workflow') return new WorkflowRunetimeWorkflow(item, parent)
  if (item.type === 'select_option') return new WorkflowRunetimeSelectOption(item, parent)
  if (item.type === 'select_option.option')
    return new WorkflowRunetimeSelectOptionOption(item, parent)
  if (item.type === 'text') return new WorkflowRunetimeText(item, parent)

  throw new Error(`Workflow Item Cannot be initalized ${JSON.stringify(item)}`)
}
