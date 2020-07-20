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
    // Return to client amount values in dollars, not cents
    for (let i = 0; i < items.length; i++) {
      items[i].amount = items[i].amount / 100
    }
    return items
  }

  async getUnassigned(userID: string) {
    return await this.model.getUnassigned(parseInt(userID))
  }

  async change(id: number, name: string, amount: number, envelope_id: number) {
    const pennies = amount * 100 // We store a bigint value in pennies
    const newItem =  await this.model.update(id, name, pennies, envelope_id )
    console.log('newItem before', newItem)
    newItem.amount = newItem.amount / 100 // We return a number in dollars
    console.log('newItem after', newItem)

    return newItem
  }

  async getByEnvelope(userID: string, id: string) {
    return await this.model.getByEnvelope(userID, id)
  }

  async remove(itemID: string) {
    return await this.model.delete(itemID)
  }
}