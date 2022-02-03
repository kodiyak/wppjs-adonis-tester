export namespace Workflow {
  export type Item<I extends Types = Types> = ItemsData[I]

  export namespace Items {
    type Main = {
      title: string
      uuid: string
      type: Workflow.Types
    }
    export type Default<T = any, I extends Types = Types> = T &
      Main & {
        children?: Workflow.Item<I>[]
      }
  }

  export namespace ItemProps {
    export type Text = {
      type: 'text'
      value: string
    }

    export type Workflow = {
      type: 'workflow'
    }

    export type SelectOption = {
      type: 'select_option'
      value?: {
        messageText?: string
      }
    }

    export type SelectOptionOption = {
      type: 'select_option.option'
      value: string
    }
  }

  export interface ItemsData {
    'text': Workflow.Items.Default<ItemProps.Text>
    'workflow': Workflow.Items.Default<ItemProps.Workflow>
    'select_option': Workflow.Items.Default<ItemProps.SelectOption, 'select_option.option'>
    'select_option.option': Workflow.Items.Default<ItemProps.SelectOptionOption, 'workflow'>
  }

  export type Types = keyof ItemsData

  export interface Main {
    tree: Workflow.Item<'workflow'>
  }

  export interface Events {
    forceUpdate: (e: Events.ForceUpdate) => void
  }

  export namespace Events {
    export interface ForceUpdate {
      uuid?: string
    }
  }
}
