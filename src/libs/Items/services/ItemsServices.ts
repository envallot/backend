import { ItemsModel } from "../model/ItemsModel";

export class ItemsServices {
  model: ItemsModel

  constructor(itemsModel: ItemsModel) {
    this.model = itemsModel
  }

  async create(userID: string, name:string, amount:number):Promise<any> {
    return await this.model.add(userID, name, amount)
  }
}