import { TypedEmitter, DefaultListener, ListenerSignature } from 'tiny-typed-emitter'

export function createEventEmitter<L extends ListenerSignature<L> = DefaultListener>() {
  return new TypedEmitter<L>()
}
