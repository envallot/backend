import { ItemsModel } from "../model/ItemsModel";

export class ItemsServices {
  model: ItemsModel

  constructor(itemsModel: ItemsModel) {
    this.model = itemsModel
  }

  async create(userID: string, name:string, amount:number):Promise<any> {
    const amountInCents = amount * 100
    return await this.model.add(userID, name, amountInCents)
  }

  async getByUserID(userID: string) {
    return await this.model.get(parseInt(userID))
  }
}