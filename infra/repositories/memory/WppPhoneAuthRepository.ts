import { WppPhoneAuth } from '@core/domain/wpp/WppPhoneAuth'
import Organization from 'App/Models/Organization'

export class WppPhoneAuthRepository {
  private _items: Record<string, WppPhoneAuth> = {}

  public async findOrCreate(organization: Organization) {
    if (this._items[organization.id]) return this._items[organization.id]
    this._items[organization.id] = new WppPhoneAuth(organization)

    return this._items[organization.id]
  }
}
