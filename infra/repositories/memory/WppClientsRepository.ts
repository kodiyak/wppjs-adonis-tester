import { WppClient } from '@core/domain/wpp/WppClient'
import WppPhone from 'App/Models/WppPhone'
import WppSession from 'App/Models/WppSession'

export class WppClientsRepository {
  private _items: Record<string, WppClient> = {}

  public async findOrCreate(wppPhone: WppPhone, wppSession?: WppSession) {
    if (this._items[wppPhone.id]) return this._items[wppPhone.id]
    this._items[wppPhone.id] = new WppClient(wppPhone, wppSession)

    return this._items[wppPhone.id]
  }
}
