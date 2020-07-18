import { ItemsModel } from "../model/ItemsModel";

export class ItemsServices {
  model: ItemsModel

  constructor(itemsModel: ItemsModel) {
    this.model = itemsModel
  }

  async create(userID: string, name:string, amount:number):Promise<any> {
    return await this.model.add(userID, name, amount)
  }

  async getByUserID(userID: string) {
    const items = await this.model.get(parseInt(userID))
    return items
  }

  async getUnassigned(userID: string) {
    return await this.model.getUnassigned(parseInt(userID))
  }

  async change(id: number, name: string, amount: number, envelope_id: number) {
    return await this.model.update(id, name, amount, envelope_id )
  }

  async getByEnvelope(userID: string, id: string) {
    return await this.model.getByEnvelope(userID, id)
  }

  async remove(itemID: string) {
    return await this.model.delete(itemID)
  }
}