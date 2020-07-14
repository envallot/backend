import { EnvelopesModel } from "../model/EnvelopesModel";

export class EnvelopesServices {
  model: EnvelopesModel

  constructor(envelopesModel: EnvelopesModel) {
    this.model = envelopesModel
  }

  async create(userID: string, name: string, limitAmount: number): Promise<any> {
    return await this.model.add(userID, name, limitAmount)
  }

  async get(userID: string) {
    const itemsWithEnvID = await this.model.get(parseInt(userID))
    const unassignedItems: any = {}
    const envsWithItems: any = {}
    itemsWithEnvID.forEach((item: any) => {

      if (item.env_id === null) {
        unassignedItems[item.item_id] = item
      } else {
        if(!envsWithItems[item.env_id]) {
          envsWithItems[item.env_id] = {}
        }
        envsWithItems[item.env_id][item.item_id] = item
        envsWithItems[item.env_id][item.item_id].amount = envsWithItems[item.env_id][item.item_id].amount / 100
      }
    })
    return {unassignedItems, envsWithItems}
    // return itemsWithEnvID
  }

  // async getByUserID(userID: string) {
  //   return await this.model.get(parseInt(userID))
  // }

  // async getUnassigned(userID: string) {
  //   return await this.model.getUnassigned(parseInt(userID))
  // }

  // async change(id: number, name: string, amount: number, envelope_id: number) {
  //   return await this.model.update(id, name, amount, envelope_id )
  // }

  // async getByEnvelope(userID: string, id: string) {
  //   return await this.model.getByEnvelope(userID, id)
  // }

  // async remove(itemID: string) {
  //   return await this.model.delete(itemID)
  // }
}